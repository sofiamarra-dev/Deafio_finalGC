"""lojinha: compras, ninho e casca

Revision ID: d4e8a6b1c3f7
Revises: c7a3f19e2b44
Create Date: 2026-11-28 02:30:00

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = 'd4e8a6b1c3f7'
down_revision: Union[str, Sequence[str], None] = 'c7a3f19e2b44'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'compras',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('aluno_id', sa.Integer(), nullable=False),
        sa.Column('item_id', sa.String(length=40), nullable=False),
        sa.Column('preco', sa.Integer(), nullable=False),
        sa.Column('criado_em', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['aluno_id'], ['usuarios.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_compras_aluno_id'), 'compras', ['aluno_id'], unique=False)
    with op.batch_alter_table('usuarios') as tabela:
        tabela.add_column(sa.Column('ninho', sa.String(length=40), nullable=True))
        tabela.add_column(sa.Column('casca', sa.String(length=40), nullable=True))


def downgrade() -> None:
    with op.batch_alter_table('usuarios') as tabela:
        tabela.drop_column('casca')
        tabela.drop_column('ninho')
    op.drop_index(op.f('ix_compras_aluno_id'), table_name='compras')
    op.drop_table('compras')
