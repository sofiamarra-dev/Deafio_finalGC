"""Servidor do PyQuest: a API de dicas da IA e, de brinde, o próprio jogo (a pasta frontend/).
Rodar:  cd backend && uvicorn app.main:app --reload --port 8000   e abrir http://127.0.0.1:8000"""
from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

from . import config, ia
from .limite import Limite

cfg = config.carregar()
limite = Limite(cfg.limite_minuto, cfg.limite_dia)
app = FastAPI(title="PyQuest", docs_url="/api/docs", openapi_url="/api/openapi.json")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cfg.origens,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


class Tentativa(BaseModel):
    bloco: str = Field(max_length=60)
    resultado: str = Field(max_length=300)


class PedidoDica(BaseModel):
    desafio_id: str = Field(pattern=r"^[a-z0-9_]{1,60}$")
    objetivo: str = Field(max_length=500)
    codigo: str = Field(max_length=1500)
    tentativas: list[Tentativa] = Field(default_factory=list, max_length=6)


def erro(status: int, codigo: str, mensagem: str) -> JSONResponse:
    return JSONResponse(status_code=status, content={"erro": codigo, "mensagem": mensagem})


@app.get("/api/saude")
async def saude():
    """O jogo pergunta isto ao abrir: só mostra o botão "Dica da IA" se a IA estiver disponível."""
    c = config.carregar()
    return {"ok": True, "ia": bool(c.chave_ia or c.ia_falsa)}


@app.post("/api/dica")
async def dica(pedido: PedidoDica, request: Request):
    c = config.carregar()
    quem = request.client.host if request.client else "desconhecido"
    if not limite.permitir(quem):
        return erro(429, "limite", "Você já pediu várias dicas. Espere um pouco e tente de novo.")
    try:
        texto = await ia.gerar_dica(c, pedido.objetivo, pedido.codigo, [t.model_dump() for t in pedido.tentativas])
    except ia.IAIndisponivel:
        return erro(503, "ia_indisponivel", "A dica da IA não está ligada neste servidor.")
    except ia.IAFalhou:
        return erro(502, "ia_falhou", "A IA não respondeu agora. Use a dica fixa do desafio.")
    return {"dica": texto}


# O jogo (frontend/) é servido na raiz, no mesmo endereço da API: não precisa de CORS nem de configurar o endereço.
_frontend = Path(__file__).resolve().parents[2] / "frontend"
if _frontend.is_dir():
    app.mount("/", StaticFiles(directory=_frontend, html=True), name="jogo")
