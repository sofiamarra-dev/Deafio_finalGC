"""A trilha do aluno: módulos, exercícios com estado (concluído, liberado, bloqueado) e o ovo."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db import obter_sessao
from app.modelos import Modulo, Usuario
from app.servicos.autenticacao import exigir_aluno
from app.rotas.perfil import ovos_das_turmas
from app.servicos.criatura import criatura_do_aluno
from app.servicos.jogador import resumo_jogador
from app.servicos.progressao import estado_da_trilha, estagio_do_ovo, proximo_exercicio

rotas = APIRouter(prefix="/api", tags=["trilha"])


@rotas.get("/trilha")
def trilha(aluno: Usuario = Depends(exigir_aluno), sessao: Session = Depends(obter_sessao)) -> dict:
    modulos = estado_da_trilha(sessao, aluno.id)
    return {
        "modulos": [{
            "id": m.modulo.id, "ordem": m.modulo.ordem, "titulo": m.modulo.titulo,
            "descricao": m.modulo.descricao, "estado": m.estado, "tem_guia": bool(m.modulo.guia),
            "concluidos": m.concluidos, "total": len(m.exercicios),
            "exercicios": [{
                "id": e.exercicio.id, "titulo": e.exercicio.titulo, "dificuldade": e.exercicio.dificuldade,
                "tipo": e.exercicio.tipo, "desafio_final": e.exercicio.eh_desafio_final, "estado": e.estado,
            } for e in m.exercicios],
        } for m in modulos],
        "ovo": {"estagio": estagio_do_ovo(sessao, aluno.id), "estagios": len(modulos)},
        "proximo_exercicio": proximo_exercicio(sessao, aluno.id),
        "jogador": resumo_jogador(sessao, aluno.id),
        "criatura": criatura_do_aluno(sessao, aluno),
        "ovos_turma": ovos_das_turmas(sessao, aluno.id),
        "resumo": {
            "exercicios_concluidos": sum(m.concluidos for m in modulos),
            "exercicios_total": sum(len(m.exercicios) for m in modulos),
            "modulos_concluidos": sum(m.estado == "concluido" for m in modulos),
        },
    }


@rotas.get("/modulos/{modulo_id}/guia")
def guia(modulo_id: str, aluno: Usuario = Depends(exigir_aluno), sessao: Session = Depends(obter_sessao)) -> dict:
    modulo = sessao.get(Modulo, modulo_id)
    if modulo is None:
        raise HTTPException(404, "Módulo não encontrado.")
    return {"titulo": modulo.titulo, "guia": modulo.guia}
