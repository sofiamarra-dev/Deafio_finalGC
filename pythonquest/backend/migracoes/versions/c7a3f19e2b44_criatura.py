"""criatura que nasce do ovo

Revision ID: c7a3f19e2b44
Revises: b51c2e7a9d10
Create Date: 2026-11-28 01:55:00

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = 'c7a3f19e2b44'
down_revision: Union[str, Sequence[str], None] = 'b51c2e7a9d10'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    with op.batch_alter_table('usuarios') as tabela:
        tabela.add_column(sa.Column('criatura', sa.String(length=20), nullable=True))


def downgrade() -> None:
    with op.batch_alter_table('usuarios') as tabela:
        tabela.drop_column('criatura')
