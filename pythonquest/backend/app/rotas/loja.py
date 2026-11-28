"""Rotas da lojinha. Preço, saldo e requisitos são conferidos aqui no servidor."""
from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.db import obter_sessao
from app.modelos import Usuario
from app.servicos.autenticacao import exigir_aluno
from app.servicos.loja import CompraRecusada, comprar, equipar, vitrine

rotas = APIRouter(prefix="/api/loja", tags=["loja"])


class PedidoCompra(BaseModel):
    item_id: str = Field(max_length=40)


class PedidoEquipar(BaseModel):
    categoria: Literal["ninho", "casca"]
    item_id: str | None = Field(default=None, max_length=40)


@rotas.get("")
def ver_loja(aluno: Usuario = Depends(exigir_aluno), sessao: Session = Depends(obter_sessao)) -> dict:
    return vitrine(sessao, aluno)


@rotas.post("/comprar")
def fazer_compra(dados: PedidoCompra, aluno: Usuario = Depends(exigir_aluno), sessao: Session = Depends(obter_sessao)) -> dict:
    try:
        comprar(sessao, aluno, dados.item_id)
    except CompraRecusada as erro:
        raise HTTPException(status.HTTP_409_CONFLICT, str(erro)) from erro
    sessao.commit()
    return vitrine(sessao, aluno)


@rotas.post("/equipar")
def trocar_item(dados: PedidoEquipar, aluno: Usuario = Depends(exigir_aluno), sessao: Session = Depends(obter_sessao)) -> dict:
    try:
        equipar(sessao, aluno, dados.categoria, dados.item_id)
    except CompraRecusada as erro:
        raise HTTPException(status.HTTP_409_CONFLICT, str(erro)) from erro
    sessao.commit()
    return vitrine(sessao, aluno)
