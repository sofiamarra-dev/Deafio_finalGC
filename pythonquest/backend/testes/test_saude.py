from fastapi.testclient import TestClient

from app.main import app

cliente = TestClient(app)


def test_saude_responde_servidor_e_banco():
    resposta = cliente.get("/api/saude")
    assert resposta.status_code == 200
    dados = resposta.json()
    assert dados["servidor"] == "ok"
    assert dados["banco"] == "ok"


def test_frontend_e_servido_na_raiz():
    resposta = cliente.get("/")
    assert resposta.status_code == 200
    assert "PythonQuest" in resposta.text


def test_documentacao_da_api_fica_em_api_docs():
    assert cliente.get("/api/docs").status_code == 200
