"""Conexão com o banco de dados e a base das tabelas (SQLAlchemy)."""
from collections.abc import Iterator

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.config import obter_configuracao


class Base(DeclarativeBase):
    """Todas as tabelas (em app/modelos/) herdam desta classe."""


def criar_motor(url: str):
    argumentos = {"check_same_thread": False} if url.startswith("sqlite") else {}
    return create_engine(url, connect_args=argumentos)


motor = criar_motor(obter_configuracao().url_banco)
FabricaSessao = sessionmaker(bind=motor, autoflush=False, expire_on_commit=False)


def obter_sessao() -> Iterator[Session]:
    """Dependência do FastAPI: uma sessão por requisição, sempre fechada no fim."""
    with FabricaSessao() as sessao:
        yield sessao
