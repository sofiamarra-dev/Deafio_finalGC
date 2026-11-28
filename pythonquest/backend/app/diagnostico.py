"""Confere, ao ligar o servidor, se o banco está pronto. Mostra no terminal o comando que falta rodar."""
from sqlalchemy import inspect, select
from sqlalchemy.exc import SQLAlchemyError

from app.db import FabricaSessao, motor
from app.modelos import Base, Exercicio


def conferir_banco() -> list[str]:
    try:
        existentes = set(inspect(motor).get_table_names())
    except SQLAlchemyError as erro:
        return [f"Não consegui abrir o banco de dados ({erro}). Confira URL_BANCO no .env."]
    faltando = set(Base.metadata.tables) - existentes
    if faltando:
        return ["O banco de dados ainda não tem as tabelas. Pare o servidor (Ctrl+C) e rode: python -m alembic upgrade head"]
    inspetor = inspect(motor)
    for nome, tabela in Base.metadata.tables.items():
        if set(tabela.columns.keys()) - {c["name"] for c in inspetor.get_columns(nome)}:
            return ["O banco de dados está desatualizado (o código ganhou coisas novas). "
                    "Pare o servidor (Ctrl+C) e rode: python -m alembic upgrade head"]
    with FabricaSessao() as sessao:
        if sessao.scalar(select(Exercicio.id).limit(1)) is None:
            return ["Não há exercícios no banco. Rode: python -m app.conteudo.importar"]
    return []
