"""Configurações lidas do arquivo .env (ou de variáveis de ambiente)."""
from functools import lru_cache
from pathlib import Path
from typing import Literal

from pydantic_settings import BaseSettings, SettingsConfigDict

PASTA_BACKEND = Path(__file__).resolve().parent.parent
PASTA_FRONTEND = PASTA_BACKEND.parent / "frontend"


class Configuracao(BaseSettings):
    model_config = SettingsConfigDict(env_file=PASTA_BACKEND / ".env", extra="ignore")

    ambiente: Literal["desenvolvimento", "producao"] = "desenvolvimento"
    url_banco: str = f"sqlite:///{PASTA_BACKEND / 'pythonquest.db'}"
    pasta_frontend: Path = PASTA_FRONTEND

    # Login
    dias_sessao: int = 14

    # Corretor: "docker" (seguro, padrão) ou "local" (só desenvolvimento e testes; recusado em produção)
    corretor: Literal["docker", "local"] = "docker"
    sandbox_imagem: str = "python:3.12-alpine"
    sandbox_tempo_caso_s: float = 2.0
    sandbox_tempo_total_s: float = 20.0
    envios_por_minuto: int = 10


@lru_cache
def obter_configuracao() -> Configuracao:
    return Configuracao()
