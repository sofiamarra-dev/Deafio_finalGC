"""Perfil do aluno (o próprio, editável) e perfil público (o que os colegas veem a partir do ranking)."""
from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field, field_validator
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db import obter_sessao
from app.modelos import Matricula, Turma, Usuario
from app.servicos.autenticacao import exigir_aluno
from app.servicos.criatura import criatura_do_aluno, ovo_da_turma
from app.servicos.jogador import resumo_jogador
from app.servicos.progressao import estagio_do_ovo
from app.servicos.ranking import CORES, conquistas, estatisticas, nome_exibido, ranking

rotas = APIRouter(prefix="/api", tags=["perfil"])


class EdicaoPerfil(BaseModel):
    apelido: str | None = Field(default=None, max_length=30)
    cor: Literal[CORES] | None = None  # type: ignore[valid-type]

    @field_validator("apelido")
    @classmethod
    def limpar(cls, valor: str | None) -> str | None:
        if valor is None:
            return None
        valor = " ".join(valor.split())
        if valor and len(valor) < 2:
            raise ValueError("O apelido precisa ter pelo menos 2 letras.")
        return valor


def _perfil(sessao: Session, usuario: Usuario, proprio: bool) -> dict:
    dados = {
        "id": usuario.id, "nome_exibido": nome_exibido(usuario), "cor": usuario.avatar,
        "ovo": estagio_do_ovo(sessao, usuario.id), "jogador": resumo_jogador(sessao, usuario.id),
        "conquistas": conquistas(sessao, usuario.id), "proprio": proprio,
        "criatura": criatura_do_aluno(sessao, usuario),
    }
    if proprio:
        dados.update(nome=usuario.nome, apelido=usuario.apelido or "", cores=list(CORES),
                     estatisticas=estatisticas(sessao, usuario.id))
    return dados


@rotas.get("/perfil")
def meu_perfil(aluno: Usuario = Depends(exigir_aluno), sessao: Session = Depends(obter_sessao)) -> dict:
    return _perfil(sessao, aluno, proprio=True)


@rotas.patch("/perfil")
def editar_perfil(dados: EdicaoPerfil, aluno: Usuario = Depends(exigir_aluno),
                  sessao: Session = Depends(obter_sessao)) -> dict:
    if dados.apelido is not None:
        aluno.apelido = dados.apelido or None
    if dados.cor is not None:
        aluno.avatar = dados.cor
    sessao.commit()
    return _perfil(sessao, aluno, proprio=True)


@rotas.get("/perfil/{usuario_id}")
def perfil_publico(usuario_id: int, aluno: Usuario = Depends(exigir_aluno),
                   sessao: Session = Depends(obter_sessao)) -> dict:
    outro = sessao.get(Usuario, usuario_id)
    if outro is None or outro.papel != "aluno":
        raise HTTPException(404, "Aluno não encontrado.")
    return _perfil(sessao, outro, proprio=outro.id == aluno.id)


@rotas.get("/ranking")
def ver_ranking(escopo: Literal["geral", "semana", "turma"] = Query("geral"), aluno: Usuario = Depends(exigir_aluno),
                sessao: Session = Depends(obter_sessao)) -> dict:
    dados = ranking(sessao, aluno.id, escopo)
    if escopo == "turma":
        dados["ovos_turma"] = ovos_das_turmas(sessao, aluno.id)
    return dados


def ovos_das_turmas(sessao: Session, aluno_id: int) -> list[dict]:
    turmas = sessao.execute(select(Turma).join(Matricula, Matricula.turma_id == Turma.id)
                            .where(Matricula.aluno_id == aluno_id)).scalars().all()
    return [{"turma": t.nome, **ovo_da_turma(sessao, t.id)} for t in turmas]
