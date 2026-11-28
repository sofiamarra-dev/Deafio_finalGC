"""Compras na lojinha. Como os envios, compras nunca são editadas nem apagadas: o saldo é sempre recalculado."""
from datetime import datetime

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db import Base
from app.modelos.tempo import agora


class Compra(Base):
    __tablename__ = "compras"

    id: Mapped[int] = mapped_column(primary_key=True)
    aluno_id: Mapped[int] = mapped_column(ForeignKey("usuarios.id", ondelete="CASCADE"), index=True)
    item_id: Mapped[str] = mapped_column(String(40))
    preco: Mapped[int]
    criado_em: Mapped[datetime] = mapped_column(default=agora)
