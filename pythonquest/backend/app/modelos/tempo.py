from datetime import datetime, timezone


def agora() -> datetime:
    """Hora atual em UTC. Todo horário no banco fica em UTC; o fuso do aluno só entra na exibição."""
    return datetime.now(timezone.utc).replace(tzinfo=None)
