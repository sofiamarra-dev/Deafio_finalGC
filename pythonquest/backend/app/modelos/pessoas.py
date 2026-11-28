"""Pessoas: usuários (aluno ou professor), sessões de login, turmas e matrículas."""
from datetime import datetime

from sqlalchemy import ForeignKey, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.db import Base
from app.modelos.tempo import agora


class Usuario(Base):
    __tablename__ = "usuarios"

    id: Mapped[int] = mapped_column(primary_key=True)
    nome: Mapped[str] = mapped_column(String(60))
    email: Mapped[str] = mapped_column(String(254), unique=True, index=True)
    senha_hash: Mapped[str] = mapped_column(String(255))
    papel: Mapped[str] = mapped_column(String(20), default="aluno")  # aluno | professor
    apelido: Mapped[str | None] = mapped_column(String(30))  # nome que aparece no ranking
    avatar: Mapped[str] = mapped_column(String(30), default="verde")  # cor das manchas do ovo
    fuso: Mapped[str] = mapped_column(String(40), default="America/Sao_Paulo")
    criado_em: Mapped[datetime] = mapped_column(default=agora)
    ultimo_acesso_em: Mapped[datetime | None]


class Sessao(Base):
    """Uma sessão de login. Guardamos só o hash do token: quem lê o banco não consegue entrar como ninguém."""
    __tablename__ = "sessoes"

    token_hash: Mapped[str] = mapped_column(String(64), primary_key=True)
    usuario_id: Mapped[int] = mapped_column(ForeignKey("usuarios.id", ondelete="CASCADE"), index=True)
    criada_em: Mapped[datetime] = mapped_column(default=agora)
    expira_em: Mapped[datetime]


class Turma(Base):
    __tablename__ = "turmas"

    id: Mapped[int] = mapped_column(primary_key=True)
    nome: Mapped[str] = mapped_column(String(60))
    codigo_convite: Mapped[str] = mapped_column(String(12), unique=True, index=True)
    professor_id: Mapped[int] = mapped_column(ForeignKey("usuarios.id"))
    criada_em: Mapped[datetime] = mapped_column(default=agora)


class Matricula(Base):
    __tablename__ = "matriculas"
    __table_args__ = (UniqueConstraint("aluno_id", "turma_id"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    aluno_id: Mapped[int] = mapped_column(ForeignKey("usuarios.id", ondelete="CASCADE"), index=True)
    turma_id: Mapped[int] = mapped_column(ForeignKey("turmas.id", ondelete="CASCADE"), index=True)
    entrou_em: Mapped[datetime] = mapped_column(default=agora)
