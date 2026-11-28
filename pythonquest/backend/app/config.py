"""Configurações lidas do arquivo .env (ou de variáveis de ambiente)."""
from functools import lru_cache
from pathlib import Path
from typing import Literal

from pydantic import field_validator
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
    # Código que o professor digita no cadastro para criar uma conta de professor.
    # Vazio = cadastro de professor desligado (só pelo comando app.criar_professor).
    codigo_professor: str = ""

    # Corretor: "docker" (seguro, padrão) ou "local" (só desenvolvimento e testes; recusado em produção)
    corretor: Literal["docker", "local"] = "docker"
    sandbox_imagem: str = "python:3.12-alpine"
    sandbox_tempo_caso_s: float = 2.0
    sandbox_tempo_total_s: float = 20.0
    envios_por_minuto: int = 10

    @field_validator("url_banco")
    @classmethod
    def sqlite_relativo_ao_backend(cls, url: str) -> str:
        """sqlite:///./pythonquest.db aponta sempre para a pasta backend, de onde quer que o servidor seja ligado.
        Assim o alembic e o uvicorn usam o mesmo arquivo."""
        prefixo = "sqlite:///"
        if url.startswith(prefixo) and not url.startswith(prefixo + "/"):
            caminho = Path(url[len(prefixo):])
            if not caminho.is_absolute():
                return prefixo + str((PASTA_BACKEND / caminho).resolve())
        return url


@lru_cache
def obter_configuracao() -> Configuracao:
    return Configuracao()
