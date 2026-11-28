"""Roda as migrações usando a mesma URL de banco do app (lida do .env)."""
from logging.config import fileConfig

from alembic import context

from app.config import obter_configuracao
from app.db import criar_motor
from app.modelos import Base

if context.config.config_file_name is not None:
    fileConfig(context.config.config_file_name)

URL = obter_configuracao().url_banco
alvo = Base.metadata


def migrar_offline() -> None:
    context.configure(url=URL, target_metadata=alvo, literal_binds=True, render_as_batch=True)
    with context.begin_transaction():
        context.run_migrations()


def migrar_online() -> None:
    with criar_motor(URL).connect() as conexao:
        # render_as_batch: o SQLite não altera colunas direto; o Alembic recria a tabela por baixo.
        context.configure(connection=conexao, target_metadata=alvo, render_as_batch=True)
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    migrar_offline()
else:
    migrar_online()
