"""Cria o app: rotas da API em /api e os arquivos do frontend no resto."""
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from app.config import obter_configuracao
from app.rotas import saude


def criar_app() -> FastAPI:
    app = FastAPI(title="PythonQuest", docs_url="/api/docs", openapi_url="/api/openapi.json")
    app.include_router(saude.rotas)
    # O frontend vem por último para não esconder as rotas da API.
    app.mount("/", StaticFiles(directory=obter_configuracao().pasta_frontend, html=True), name="frontend")
    return app


app = criar_app()
