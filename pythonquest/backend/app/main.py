"""Cria o app: rotas da API em /api e os arquivos do frontend no resto."""
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy.exc import OperationalError

from app.config import obter_configuracao
from app.diagnostico import conferir_banco
from app.rotas import contas, exercicios, loja, perfil, professor, saude, trilha

log = logging.getLogger("uvicorn.error")


@asynccontextmanager
async def ciclo_de_vida(_app: FastAPI):
    for aviso in conferir_banco():
        log.warning("\n\n  >>> %s\n", aviso)
    yield


def criar_app() -> FastAPI:
    app = FastAPI(title="PythonQuest", docs_url="/api/docs", openapi_url="/api/openapi.json", lifespan=ciclo_de_vida)
    for modulo in (saude, contas, trilha, exercicios, perfil, loja, professor):
        app.include_router(modulo.rotas)

    @app.exception_handler(OperationalError)
    async def banco_nao_preparado(_request: Request, erro: OperationalError):
        log.error("Erro no banco: %s", erro.orig)
        detalhe = "O banco de dados não está preparado. No terminal do servidor, rode: python -m alembic upgrade head"
        if "no such table" not in str(erro.orig) and "does not exist" not in str(erro.orig):
            detalhe = "Erro no banco de dados. Veja o terminal onde o servidor está rodando."
        return JSONResponse(status_code=503, content={"detail": detalhe})

    # O frontend vem por último para não esconder as rotas da API.
    app.mount("/", StaticFiles(directory=obter_configuracao().pasta_frontend, html=True), name="frontend")
    return app


app = criar_app()
