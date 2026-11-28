def test_saude_responde_servidor_e_banco(cliente, fabrica, monkeypatch):
    from app import diagnostico
    monkeypatch.setattr(diagnostico, "motor", fabrica.kw["bind"])
    monkeypatch.setattr(diagnostico, "FabricaSessao", fabrica)
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


def test_banco_desatualizado_pede_alembic(tmp_path, monkeypatch):
    import sqlalchemy as sa
    from app import diagnostico
    from app.db import Base, criar_motor
    motor = criar_motor(f"sqlite:///{tmp_path / 'velho.db'}")
    Base.metadata.create_all(motor)
    with motor.begin() as conexao:  # simula um banco de antes da coluna apelido
        conexao.execute(sa.text("ALTER TABLE usuarios DROP COLUMN apelido"))
    monkeypatch.setattr(diagnostico, "motor", motor)
    assert "desatualizado" in diagnostico.conferir_banco()[0]
