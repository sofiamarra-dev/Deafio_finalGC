from fastapi.testclient import TestClient

from app.main import app
from app.servicos.criatura import especie_dominante
from testes.test_trilha_e_permissoes import _resolver


def test_especie_dominante_e_desempate():
    base = {"certeira": 50, "persistente": 50, "exploradora": 10, "independente": 90, "constante": 0}
    assert especie_dominante(base) == "independente"
    assert especie_dominante({k: 0 for k in base}) == "certeira"  # empate: a primeira da lista


def test_criatura_so_aparece_depois_de_alguns_exercicios(aluno):
    assert aluno.get("/api/perfil").json()["criatura"]["situacao"] == "cedo"
    for exercicio_id in ("fundamentos-f1", "fundamentos-f2", "fundamentos-f3"):
        _resolver(aluno, exercicio_id)
    criatura = aluno.get("/api/perfil").json()["criatura"]
    assert criatura["situacao"] == "formando"
    # acertou tudo de primeira e sem dica, num dia só
    valores = {t["id"]: t["valor"] for t in criatura["tracos"]}
    assert valores["certeira"] == 100 and valores["independente"] == 100 and valores["persistente"] == 0
    assert criatura["especie"] == "certeira"


def test_ovo_da_turma_racha_com_a_media_de_salas(cliente, fabrica):
    def novo(nome, email):
        c = TestClient(app)
        assert c.post("/api/contas/cadastro", json={"nome": nome, "email": email, "senha": "12345678",
                                                    "codigo_turma": "ABC234"}).status_code == 201
        return c
    ana, caio = novo("Ana Souza", "ana@x.com"), novo("Caio Lima", "caio@x.com")
    obrigatorios = ["fundamentos-f1", "fundamentos-f2", "fundamentos-f3", "fundamentos-f4", "fundamentos-i1",
                    "fundamentos-i2", "fundamentos-i3", "fundamentos-a2"]
    for exercicio_id in obrigatorios:
        _resolver(ana, exercicio_id)
    ovo = ana.get("/api/trilha").json()["ovos_turma"][0]
    assert ovo["alunos"] == 2 and ovo["salas"] == 1 and ovo["estagio"] == 0 and ovo["salas_para_proximo"] == 1
    for exercicio_id in obrigatorios:
        _resolver(caio, exercicio_id)
    ovo = caio.get("/api/ranking?escopo=turma").json()["ovos_turma"][0]
    assert ovo["estagio"] == 1 and ovo["especie"] == "certeira"
