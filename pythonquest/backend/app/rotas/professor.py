"""Rotas do professor. Por enquanto as turmas dele (listar e criar); o painel vem na etapa 7."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.db import obter_sessao
from app.esquemas.contas import NovaTurma
from app.modelos import Matricula, Turma, Usuario
from app.servicos.autenticacao import exigir_professor
from app.servicos.criatura import ovo_da_turma
from app.servicos.painel import painel_da_turma
from app.servicos.turmas import criar_turma

rotas = APIRouter(prefix="/api/professor", tags=["professor"])


@rotas.get("/turmas")
def minhas_turmas(professor: Usuario = Depends(exigir_professor), sessao: Session = Depends(obter_sessao)) -> list[dict]:
    linhas = sessao.execute(
        select(Turma, func.count(Matricula.id)).outerjoin(Matricula, Matricula.turma_id == Turma.id)
        .where(Turma.professor_id == professor.id).group_by(Turma.id).order_by(Turma.criada_em.desc())).all()
    return [{"id": t.id, "nome": t.nome, "codigo_convite": t.codigo_convite, "alunos": n, "ovo": ovo_da_turma(sessao, t.id)}
            for t, n in linhas]


@rotas.post("/turmas", status_code=status.HTTP_201_CREATED)
def nova_turma(dados: NovaTurma, professor: Usuario = Depends(exigir_professor),
               sessao: Session = Depends(obter_sessao)) -> dict:
    turma = criar_turma(sessao, professor.id, dados.nome)
    sessao.commit()
    return {"id": turma.id, "nome": turma.nome, "codigo_convite": turma.codigo_convite, "alunos": 0}


@rotas.get("/turmas/{turma_id}/painel")
def painel(turma_id: int, professor: Usuario = Depends(exigir_professor), sessao: Session = Depends(obter_sessao)) -> dict:
    turma = sessao.get(Turma, turma_id)
    if turma is None or turma.professor_id != professor.id:  # professor só vê as próprias turmas
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Turma não encontrada.")
    return {"turma": {"id": turma.id, "nome": turma.nome, "codigo_convite": turma.codigo_convite},
            "ovo": ovo_da_turma(sessao, turma.id), **painel_da_turma(sessao, turma.id)}
