import pytest
from fastapi.testclient import TestClient

from app import ia
from app.limite import Limite

PEDIDO = {
    "desafio_id": "geladeira",
    "objetivo": "Encaixe o operador para que \"Gelada\" apareça só quando a temperatura for menor que 5.",
    "codigo": "temperatura = 3\n\nif temperatura ___ 5:\n    print(\"Gelada\")",
    "tentativas": [{"bloco": "<=", "resultado": "2 de 3 testes. temperatura = 5: esperado Esquentou!, obtido Gelada"}],
}


@pytest.fixture
def cliente(monkeypatch):
    monkeypatch.delenv("ANTHROPIC_API_KEY", raising=False)
    monkeypatch.setenv("IA_FALSA", "0")
    from app import main
    main.limite = Limite(100, 1000)
    return TestClient(main.app)


def test_saude_sem_chave_diz_que_ia_esta_desligada(cliente):
    assert cliente.get("/api/saude").json() == {"ok": True, "ia": False}


def test_dica_sem_chave_devolve_503(cliente):
    r = cliente.post("/api/dica", json=PEDIDO)
    assert r.status_code == 503
    assert r.json()["erro"] == "ia_indisponivel"


def test_modo_de_teste_devolve_dica_pronta(cliente, monkeypatch):
    monkeypatch.setenv("IA_FALSA", "1")
    assert cliente.get("/api/saude").json()["ia"] is True
    r = cliente.post("/api/dica", json=PEDIDO)
    assert r.status_code == 200
    assert r.json()["dica"]


def test_pedido_invalido_e_recusado(cliente, monkeypatch):
    monkeypatch.setenv("IA_FALSA", "1")
    ruim = dict(PEDIDO, desafio_id="../../etc/passwd")
    assert cliente.post("/api/dica", json=ruim).status_code == 422
    grande = dict(PEDIDO, codigo="x" * 5000)
    assert cliente.post("/api/dica", json=grande).status_code == 422


def test_limite_por_minuto(monkeypatch):
    monkeypatch.setenv("IA_FALSA", "1")
    from app import main
    main.limite = Limite(2, 100)
    c = TestClient(main.app)
    assert c.post("/api/dica", json=PEDIDO).status_code == 200
    assert c.post("/api/dica", json=PEDIDO).status_code == 200
    r = c.post("/api/dica", json=PEDIDO)
    assert r.status_code == 429 and r.json()["erro"] == "limite"


def test_limite_libera_depois_de_um_minuto():
    lim = Limite(1, 100)
    assert lim.permitir("a", agora=1000)
    assert not lim.permitir("a", agora=1030)
    assert lim.permitir("a", agora=1061)
    assert lim.permitir("b", agora=1030)  # outro aluno não é afetado


def test_codigo_na_resposta_da_ia_e_removido():
    texto = "Pense no operador.\n```python\nif t < 5:\n```\nTente de novo."
    saida = ia.limpar_resposta(texto)
    assert "if t < 5" not in saida and "(código omitido)" in saida


def test_pedido_leva_os_dados_do_aluno_em_tags():
    p = ia.montar_pedido("objetivo", "x = ___", [{"bloco": "+", "resultado": "falhou"}])
    assert "<objetivo>objetivo</objetivo>" in p and "falhou" in p


def test_frontend_e_servido_na_raiz(cliente):
    r = cliente.get("/")
    assert r.status_code == 200 and "PyQuest" in r.text


class _Bloco:
    type = "text"

    def __init__(self, text):
        self.text = text


class _Resposta:
    def __init__(self, texto):
        self.content = [_Bloco(texto)]


def _cliente_falso(texto=None, falha=None, registro=None):
    class Falso:
        def __init__(self, **kw):
            if registro is not None:
                registro["cliente"] = kw
            self.messages = self

        async def create(self, **kw):
            if registro is not None:
                registro["pedido"] = kw
            if falha:
                raise falha
            return _Resposta(texto)

    return Falso


def test_chama_a_ia_com_prompt_seguro_e_devolve_a_dica(cliente, monkeypatch):
    import anthropic
    registro = {}
    monkeypatch.setenv("ANTHROPIC_API_KEY", "chave-de-teste")
    monkeypatch.setenv("MODELO_IA", "modelo-x")
    monkeypatch.setattr(anthropic, "AsyncAnthropic", _cliente_falso("Compare o 5 do teste com o seu operador.", registro=registro))
    r = cliente.post("/api/dica", json=PEDIDO)
    assert r.status_code == 200 and r.json()["dica"].startswith("Compare")
    assert registro["cliente"]["api_key"] == "chave-de-teste"
    assert registro["pedido"]["model"] == "modelo-x" and registro["pedido"]["max_tokens"] <= 300
    assert "NUNCA escreva o bloco" in registro["pedido"]["system"]
    assert "<=" in registro["pedido"]["messages"][0]["content"]


def test_erro_da_ia_vira_502_sem_vazar_detalhes(cliente, monkeypatch):
    import anthropic
    import httpx
    monkeypatch.setenv("ANTHROPIC_API_KEY", "chave-de-teste")
    falha = anthropic.APIConnectionError(request=httpx.Request("POST", "https://x"))
    monkeypatch.setattr(anthropic, "AsyncAnthropic", _cliente_falso(falha=falha))
    r = cliente.post("/api/dica", json=PEDIDO)
    assert r.status_code == 502 and "chave" not in r.text.lower().replace("dica fixa", "")
