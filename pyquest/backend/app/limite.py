"""Limite de pedidos por aluno, para a IA não virar uma conta surpresa.
Guarda tudo em memória: reiniciar o servidor zera os contadores (suficiente para uma turma)."""
import time
from collections import defaultdict, deque


class Limite:
    def __init__(self, por_minuto: int, por_dia: int):
        self.por_minuto = por_minuto
        self.por_dia = por_dia
        self._pedidos: dict[str, deque[float]] = defaultdict(deque)

    def permitir(self, quem: str, agora: float | None = None) -> bool:
        """True se `quem` ainda pode pedir; nesse caso já conta o pedido."""
        agora = time.time() if agora is None else agora
        fila = self._pedidos[quem]
        while fila and agora - fila[0] > 86400:
            fila.popleft()
        no_ultimo_minuto = sum(1 for t in fila if agora - t <= 60)
        if no_ultimo_minuto >= self.por_minuto or len(fila) >= self.por_dia:
            return False
        fila.append(agora)
        return True
