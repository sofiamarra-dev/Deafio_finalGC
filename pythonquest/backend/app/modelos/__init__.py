"""Tabelas do banco. Cada módulo importado aqui fica visível para o Alembic."""
from app.db import Base  # noqa: F401
from app.modelos.pessoas import Matricula, Sessao, Turma, Usuario  # noqa: F401
from app.modelos.conteudo import Alternativa, CasoTeste, Exercicio, Modulo  # noqa: F401
from app.modelos.progresso import (  # noqa: F401
    Abertura, DicaVista, Envio, ProgressoExercicio, ProgressoModulo, ResultadoTeste,
)
