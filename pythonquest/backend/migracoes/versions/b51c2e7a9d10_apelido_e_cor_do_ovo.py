"""apelido e cor do ovo

Revision ID: b51c2e7a9d10
Revises: 8e0bda4049da
Create Date: 2026-11-28 01:40:00

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = 'b51c2e7a9d10'
down_revision: Union[str, Sequence[str], None] = '8e0bda4049da'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    with op.batch_alter_table('usuarios') as tabela:
        tabela.add_column(sa.Column('apelido', sa.String(length=30), nullable=True))
    op.execute("UPDATE usuarios SET avatar = 'verde' WHERE avatar = 'padrao'")


def downgrade() -> None:
    op.execute("UPDATE usuarios SET avatar = 'padrao' WHERE avatar = 'verde'")
    with op.batch_alter_table('usuarios') as tabela:
        tabela.drop_column('apelido')
