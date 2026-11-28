"""Conteúdo: módulos, exercícios, casos de teste e alternativas.
Vem dos arquivos YAML em backend/conteudo/ (veja app/conteudo/importar.py), nunca é editado à mão no banco."""
from sqlalchemy import JSON, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db import Base

DIFICULDADES = ("facil", "intermediario", "avancado")
TIPOS = ("multipla_escolha", "completar", "montar", "achar_erro", "programa")
MODOS_TESTE = ("stdin", "funcao", "variavel")


class Modulo(Base):
    __tablename__ = "modulos"

    id: Mapped[str] = mapped_column(String(40), primary_key=True)  # ex.: "fundamentos"
    ordem: Mapped[int] = mapped_column(unique=True)
    titulo: Mapped[str] = mapped_column(String(80))
    descricao: Mapped[str] = mapped_column(String(200))
    guia: Mapped[str] = mapped_column(Text, default="")  # resumo do conteúdo, aberto pelo botão "Guia"


class Exercicio(Base):
    __tablename__ = "exercicios"

    id: Mapped[str] = mapped_column(String(60), primary_key=True)  # ex.: "fundamentos-f1"
    modulo_id: Mapped[str] = mapped_column(ForeignKey("modulos.id"), index=True)
    dificuldade: Mapped[str] = mapped_column(String(20))
    ordem: Mapped[int]
    tipo: Mapped[str] = mapped_column(String(20))
    titulo: Mapped[str] = mapped_column(String(100))
    enunciado: Mapped[str] = mapped_column(Text)
    codigo_inicial: Mapped[str] = mapped_column(Text, default="")
    blocos: Mapped[list] = mapped_column(JSON, default=list)       # sugestões da lacuna (completar) ou peças do programa (montar)
    dicas: Mapped[list] = mapped_column(JSON, default=list)        # reveladas uma por vez
    explicacao: Mapped[str] = mapped_column(Text, default="")      # mostrada quando o aluno erra
    assuntos: Mapped[list] = mapped_column(JSON, default=list)     # ex.: ["for", "range"]
    xp_base: Mapped[int] = mapped_column(default=10)
    eh_desafio_final: Mapped[bool] = mapped_column(default=False)
    modo_teste: Mapped[str | None] = mapped_column(String(20))     # stdin | funcao | variavel
    funcao: Mapped[str | None] = mapped_column(String(60))         # nome da função (modo funcao)
    variavel: Mapped[str | None] = mapped_column(String(60))       # nome da variável (modo variavel)
    solucao: Mapped[str] = mapped_column(Text, default="")         # nunca sai do servidor
    respostas_erradas: Mapped[list] = mapped_column(JSON, default=list)  # usadas só pelo validador


class CasoTeste(Base):
    __tablename__ = "casos_teste"

    id: Mapped[int] = mapped_column(primary_key=True)
    exercicio_id: Mapped[str] = mapped_column(ForeignKey("exercicios.id", ondelete="CASCADE"), index=True)
    ordem: Mapped[int]
    entrada: Mapped[str] = mapped_column(Text, default="")  # stdin, argumentos (lista Python) ou valor da variável
    saida_esperada: Mapped[str] = mapped_column(Text)
    visivel: Mapped[bool] = mapped_column(default=False)


class Alternativa(Base):
    __tablename__ = "alternativas"

    id: Mapped[int] = mapped_column(primary_key=True)
    exercicio_id: Mapped[str] = mapped_column(ForeignKey("exercicios.id", ondelete="CASCADE"), index=True)
    ordem: Mapped[int]
    texto: Mapped[str] = mapped_column(Text)
    correta: Mapped[bool] = mapped_column(default=False)  # nunca sai do servidor antes do envio
    explicacao: Mapped[str] = mapped_column(Text, default="")
