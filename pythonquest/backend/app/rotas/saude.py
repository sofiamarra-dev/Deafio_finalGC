"""Rota que diz se o servidor e o banco estão respondendo."""
from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.config import obter_configuracao
from app.db import obter_sessao

rotas = APIRouter(prefix="/api", tags=["saúde"])


@rotas.get("/saude")
def saude(sessao: Session = Depends(obter_sessao)) -> dict:
    sessao.execute(text("SELECT 1"))
    return {"servidor": "ok", "banco": "ok", "ambiente": obter_configuracao().ambiente}
