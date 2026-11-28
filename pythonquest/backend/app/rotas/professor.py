"""Rotas do professor. Por enquanto só as turmas dele (com o código de convite); o painel vem na etapa 7."""
from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.db import obter_sessao
from app.modelos import Matricula, Turma, Usuario
from app.servicos.autenticacao import exigir_professor

rotas = APIRouter(prefix="/api/professor", tags=["professor"])


@rotas.get("/turmas")
def minhas_turmas(professor: Usuario = Depends(exigir_professor), sessao: Session = Depends(obter_sessao)) -> list[dict]:
    linhas = sessao.execute(
        select(Turma, func.count(Matricula.id)).outerjoin(Matricula, Matricula.turma_id == Turma.id)
        .where(Turma.professor_id == professor.id).group_by(Turma.id).order_by(Turma.criada_em.desc())).all()
    return [{"id": t.id, "nome": t.nome, "codigo_convite": t.codigo_convite, "alunos": n} for t, n in linhas]
