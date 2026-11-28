"""Criação de turmas com código de convite único."""
import secrets

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.modelos import Turma

LETRAS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"  # sem 0/O e 1/I, que confundem


def gerar_codigo() -> str:
    return "".join(secrets.choice(LETRAS) for _ in range(6))


def criar_turma(sessao: Session, professor_id: int, nome: str) -> Turma:
    codigo = gerar_codigo()
    while sessao.scalar(select(Turma).where(Turma.codigo_convite == codigo)):
        codigo = gerar_codigo()
    turma = Turma(nome=nome, codigo_convite=codigo, professor_id=professor_id)
    sessao.add(turma)
    sessao.flush()
    return turma
