"""Onde o código do aluno roda: num contêiner Docker descartável (padrão) ou, só em desenvolvimento,
num processo local com limites. O resultado volta como JSON e a comparação acontece fora daqui."""
import json
import subprocess
import sys
from pathlib import Path

from app.config import obter_configuracao

EXECUTOR = Path(__file__).with_name("executor.py")


class CorretorIndisponivel(RuntimeError):
    """O sandbox não pôde rodar (Docker fechado, imagem ausente...). Não é culpa do aluno."""


def _comando_docker(config) -> list[str]:
    return [
        "docker", "run", "--rm", "-i",
        "--network", "none",                 # sem internet
        "--read-only", "--tmpfs", "/tmp:rw,size=16m",
        "--memory", "128m", "--memory-swap", "128m",
        "--cpus", "0.5", "--pids-limit", "32",
        "--cap-drop", "ALL", "--security-opt", "no-new-privileges",
        "--user", "65534:65534",             # usuário sem privilégios (nobody)
        "-e", "TMPDIR=/tmp",
        config.sandbox_imagem,
        "python", "-I", "-c", EXECUTOR.read_text(encoding="utf-8"),
    ]


def executar(casos: list[dict]) -> list[dict]:
    config = obter_configuracao()
    if config.corretor == "local":
        if config.ambiente == "producao":
            raise CorretorIndisponivel("O corretor local não pode ser usado em produção. Use CORRETOR=docker.")
        comando = [sys.executable, "-I", str(EXECUTOR)]
    else:
        comando = _comando_docker(config)

    pedido = json.dumps({"tempo_caso": config.sandbox_tempo_caso_s, "casos": casos})
    try:
        processo = subprocess.run(
            comando, input=pedido, capture_output=True, text=True, encoding="utf-8",
            timeout=config.sandbox_tempo_total_s,
        )
    except FileNotFoundError as erro:
        raise CorretorIndisponivel("Docker não encontrado. Instale e abra o Docker Desktop.") from erro
    except subprocess.TimeoutExpired as erro:
        raise CorretorIndisponivel("O corretor demorou demais para responder.") from erro
    if processo.returncode != 0:
        raise CorretorIndisponivel("O corretor falhou: " + processo.stderr.strip()[-300:])
    try:
        return json.loads(processo.stdout)["resultados"]
    except (ValueError, KeyError) as erro:
        raise CorretorIndisponivel("Resposta inesperada do corretor.") from erro
