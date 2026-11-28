def test_saude_responde_servidor_e_banco(cliente):
    resposta = cliente.get("/api/saude")
    assert resposta.status_code == 200
    dados = resposta.json()
    assert dados["servidor"] == "ok"
    assert dados["banco"] == "ok"


def test_frontend_e_servido_na_raiz(cliente):
    resposta = cliente.get("/")
    assert resposta.status_code == 200
    assert "PythonQuest" in resposta.text


def test_documentacao_da_api_fica_em_api_docs(cliente):
    assert cliente.get("/api/docs").status_code == 200


def test_banco_sem_tabelas_avisa_o_comando_certo(tmp_path, monkeypatch):
    from app import diagnostico
    from app.db import criar_motor
    monkeypatch.setattr(diagnostico, "motor", criar_motor(f"sqlite:///{tmp_path / 'vazio.db'}"))
    assert "alembic upgrade head" in diagnostico.conferir_banco()[0]


def test_sqlite_relativo_aponta_para_a_pasta_backend():
    from app.config import PASTA_BACKEND, Configuracao
    url = Configuracao(url_banco="sqlite:///./pythonquest.db").url_banco
    assert url == f"sqlite:///{(PASTA_BACKEND / 'pythonquest.db').resolve()}"
