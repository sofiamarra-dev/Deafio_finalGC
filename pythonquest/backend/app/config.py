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


@lru_cache
def obter_configuracao() -> Configuracao:
    return Configuracao()
