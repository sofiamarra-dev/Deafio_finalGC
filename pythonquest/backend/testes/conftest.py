"""Cada teste usa um banco SQLite novo e o corretor local (os testes não dependem do Docker)."""
import os

os.environ.setdefault("CORRETOR", "local")
os.environ.setdefault("ENVIOS_POR_MINUTO", "1000")
os.environ.setdefault("CODIGO_PROFESSOR", "codigo-secreto-de-teste")

import pytest  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402
from sqlalchemy.orm import sessionmaker  # noqa: E402

from app.conteudo.importar import importar  # noqa: E402
from app.db import Base, criar_motor, obter_sessao  # noqa: E402
from app.main import app  # noqa: E402
from app.modelos import Turma, Usuario  # noqa: E402
from app.servicos import senhas  # noqa: E402
from app.servicos.autenticacao import falhas_login  # noqa: E402


@pytest.fixture()
def fabrica(tmp_path):
    motor = criar_motor(f"sqlite:///{tmp_path / 'teste.db'}")
    Base.metadata.create_all(motor)
    fabrica = sessionmaker(bind=motor, autoflush=False, expire_on_commit=False)
    with fabrica() as sessao:
        importar(sessao)
        professor = Usuario(nome="Prof", email="prof@escola.br", senha_hash=senhas.gerar_hash("senha-prof"),
                            papel="professor")
        sessao.add(professor)
        sessao.flush()
        sessao.add(Turma(nome="Turma A", codigo_convite="ABC234", professor_id=professor.id))
        sessao.commit()

    def sessao_de_teste():
        with fabrica() as s:
            yield s

    app.dependency_overrides[obter_sessao] = sessao_de_teste
    falhas_login._eventos.clear()
    yield fabrica
    app.dependency_overrides.clear()


@pytest.fixture()
def cliente(fabrica):
    return TestClient(app)


@pytest.fixture()
def aluno(cliente):
    resposta = cliente.post("/api/contas/cadastro", json={"nome": "Bia", "email": "bia@x.com", "senha": "12345678"})
    assert resposta.status_code == 201, resposta.text
    return cliente
