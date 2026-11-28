"""Rota que diz se o servidor e o banco estão respondendo."""
from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.config import obter_configuracao
from app.db import obter_sessao
from app.diagnostico import conferir_banco

rotas = APIRouter(prefix="/api", tags=["saúde"])


@rotas.get("/saude")
def saude(sessao: Session = Depends(obter_sessao)) -> dict:
    sessao.execute(text("SELECT 1"))
    avisos = conferir_banco()
    return {"servidor": "ok", "banco": "ok" if not avisos else "incompleto", "avisos": avisos,
            "ambiente": obter_configuracao().ambiente}
