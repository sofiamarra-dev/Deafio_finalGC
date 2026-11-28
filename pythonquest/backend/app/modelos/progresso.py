"""Progresso: tudo o que o aluno faz fica registrado aqui. Envios nunca são editados nem apagados."""
from datetime import datetime

from sqlalchemy import ForeignKey, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.db import Base
from app.modelos.tempo import agora


class Abertura(Base):
    """Quando o aluno abriu um exercício. Serve para medir o tempo até acertar."""
    __tablename__ = "aberturas"

    id: Mapped[int] = mapped_column(primary_key=True)
    aluno_id: Mapped[int] = mapped_column(ForeignKey("usuarios.id", ondelete="CASCADE"), index=True)
    exercicio_id: Mapped[str] = mapped_column(ForeignKey("exercicios.id"), index=True)
    aberto_em: Mapped[datetime] = mapped_column(default=agora)


class Envio(Base):
    __tablename__ = "envios"

    id: Mapped[int] = mapped_column(primary_key=True)
    aluno_id: Mapped[int] = mapped_column(ForeignKey("usuarios.id", ondelete="CASCADE"), index=True)
    exercicio_id: Mapped[str] = mapped_column(ForeignKey("exercicios.id"), index=True)
    abertura_id: Mapped[int | None] = mapped_column(ForeignKey("aberturas.id"))
    resposta: Mapped[str] = mapped_column(Text)
    correto: Mapped[bool]
    testes_passados: Mapped[int] = mapped_column(default=0)
    testes_total: Mapped[int] = mapped_column(default=0)
    tipo_erro: Mapped[str | None] = mapped_column(String(40))  # SyntaxError, saida_errada, tempo_esgotado...
    duracao_ms: Mapped[int | None]
    dicas_vistas: Mapped[int] = mapped_column(default=0)
    xp_ganho: Mapped[int] = mapped_column(default=0)  # o XP entra na etapa de gamificação
    criado_em: Mapped[datetime] = mapped_column(default=agora, index=True)


class ResultadoTeste(Base):
    __tablename__ = "resultados_teste"

    id: Mapped[int] = mapped_column(primary_key=True)
    envio_id: Mapped[int] = mapped_column(ForeignKey("envios.id", ondelete="CASCADE"), index=True)
    caso_ordem: Mapped[int]
    passou: Mapped[bool]
    saida_obtida: Mapped[str] = mapped_column(Text, default="")  # cortada em 2 KB


class ProgressoExercicio(Base):
    __tablename__ = "progresso_exercicio"
    __table_args__ = (UniqueConstraint("aluno_id", "exercicio_id"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    aluno_id: Mapped[int] = mapped_column(ForeignKey("usuarios.id", ondelete="CASCADE"), index=True)
    exercicio_id: Mapped[str] = mapped_column(ForeignKey("exercicios.id"))
    tentativas: Mapped[int] = mapped_column(default=0)
    tentativas_ate_acertar: Mapped[int | None]
    concluido_em: Mapped[datetime | None]


class ProgressoModulo(Base):
    __tablename__ = "progresso_modulo"
    __table_args__ = (UniqueConstraint("aluno_id", "modulo_id"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    aluno_id: Mapped[int] = mapped_column(ForeignKey("usuarios.id", ondelete="CASCADE"), index=True)
    modulo_id: Mapped[str] = mapped_column(ForeignKey("modulos.id"))
    concluido_em: Mapped[datetime] = mapped_column(default=agora)


class DicaVista(Base):
    """Cada dica que o aluno abriu. Ajuda o professor a ver onde a turma precisa de apoio."""
    __tablename__ = "dicas_vistas"
    __table_args__ = (UniqueConstraint("aluno_id", "exercicio_id", "indice"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    aluno_id: Mapped[int] = mapped_column(ForeignKey("usuarios.id", ondelete="CASCADE"), index=True)
    exercicio_id: Mapped[str] = mapped_column(ForeignKey("exercicios.id"))
    indice: Mapped[int]
    vista_em: Mapped[datetime] = mapped_column(default=agora)
