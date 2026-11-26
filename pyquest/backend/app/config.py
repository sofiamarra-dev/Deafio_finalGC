"""Configurações lidas do ambiente (arquivo .env). Nada de segredo fica no código."""
import os
from dataclasses import dataclass

from dotenv import load_dotenv

load_dotenv()


def _lista(texto: str) -> list[str]:
    return [item.strip() for item in texto.split(",") if item.strip()]


@dataclass(frozen=True)
class Config:
    chave_ia: str
    modelo: str
    ia_falsa: bool
    origens: list[str]
    limite_minuto: int
    limite_dia: int


def carregar() -> Config:
    """Lê o ambiente a cada chamada, então os testes podem trocar as variáveis."""
    return Config(
        chave_ia=os.environ.get("ANTHROPIC_API_KEY", "").strip(),
        modelo=os.environ.get("MODELO_IA", "claude-sonnet-5-5").strip(),
        ia_falsa=os.environ.get("IA_FALSA", "0").strip() == "1",
        origens=_lista(os.environ.get("ORIGENS_PERMITIDAS", "http://127.0.0.1:5500,http://localhost:5500")),
        limite_minuto=int(os.environ.get("LIMITE_POR_MINUTO", "4")),
        limite_dia=int(os.environ.get("LIMITE_POR_DIA", "60")),
    )
