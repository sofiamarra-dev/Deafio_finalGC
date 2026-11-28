"""XP, nível e sequência de dias. Tudo sai dos envios gravados, então não dá para inflar mexendo no navegador.

Regras contra "farmar" XP:
- XP só na PRIMEIRA vez que o aluno acerta um exercício. Refazer não dá XP.
- Acertar de primeira dá bônus; cada erro antes de acertar e cada dica aberta tiram um pouco.
- O mínimo é 40% do XP do exercício: errar e pedir dica nunca deixa o aluno sem nada.
- Concluir um módulo (sala) dá um bônus fixo, uma vez só."""
from dataclasses import dataclass, field
from datetime import date, datetime, timedelta

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.modelos import Envio
from app.modelos.tempo import agora

BONUS_PRIMEIRA = 0.5
DESCONTO_ERRO = 0.10
DESCONTO_DICA = 0.15
MINIMO = 0.4
BONUS_MODULO = 50
FUSO = timedelta(hours=-3)  # horário de Brasília (sem horário de verão desde 2019)


@dataclass
class Ganho:
    total: int = 0
    partes: list[dict] = field(default_factory=list)


def calcular_xp(xp_base: int, tentativas: int, dicas: int, modulo_concluido: bool) -> Ganho:
    erros = max(tentativas - 1, 0)
    fator = 1 + (BONUS_PRIMEIRA if erros == 0 else 0) - DESCONTO_ERRO * erros - DESCONTO_DICA * dicas
    fator = max(fator, MINIMO)
    ganho = Ganho()
    ganho.partes.append({"motivo": "Exercício concluído", "xp": xp_base})
    if erros == 0:
        ganho.partes.append({"motivo": "Acertou de primeira", "xp": round(xp_base * BONUS_PRIMEIRA)})
    desconto = round(xp_base * (1 + (BONUS_PRIMEIRA if erros == 0 else 0))) - round(xp_base * fator)
    if desconto > 0:
        motivos = []
        if erros:
            motivos.append(f"{erros} erro" + ("s" if erros > 1 else ""))
        if dicas:
            motivos.append(f"{dicas} dica" + ("s" if dicas > 1 else ""))
        ganho.partes.append({"motivo": "Desconto por " + " e ".join(motivos), "xp": -desconto})
    if modulo_concluido:
        ganho.partes.append({"motivo": "Sala concluída", "xp": BONUS_MODULO})
    ganho.total = sum(p["xp"] for p in ganho.partes)
    return ganho


def xp_para_nivel(nivel: int) -> int:
    """XP acumulado para chegar ao nível: 0, 60, 180, 360, 600, 900... (cada nível pede 60 a mais que o anterior)."""
    return 30 * (nivel - 1) * nivel


def nivel_de(xp: int) -> int:
    nivel = 1
    while xp >= xp_para_nivel(nivel + 1):
        nivel += 1
    return nivel


def dia_local(momento: datetime) -> date:
    return (momento + FUSO).date()


def xp_total(sessao: Session, aluno_id: int, desde: datetime | None = None) -> int:
    consulta = select(func.coalesce(func.sum(Envio.xp_ganho), 0)).where(Envio.aluno_id == aluno_id)
    if desde is not None:
        consulta = consulta.where(Envio.criado_em >= desde)
    return int(sessao.scalar(consulta))


def sequencia(sessao: Session, aluno_id: int, hoje: date | None = None) -> dict:
    """Dias seguidos com pelo menos um acerto. Vale até ontem: quem ainda não estudou hoje não perde a sequência."""
    momentos = sessao.scalars(select(Envio.criado_em).where(Envio.aluno_id == aluno_id, Envio.correto)).all()
    dias = {dia_local(m) for m in momentos}
    hoje = hoje or dia_local(agora())
    atual, dia = 0, hoje if hoje in dias else hoje - timedelta(days=1)
    while dia in dias:
        atual += 1
        dia -= timedelta(days=1)
    melhor, corrida, anterior = 0, 0, None
    for d in sorted(dias):
        corrida = corrida + 1 if anterior and d - anterior == timedelta(days=1) else 1
        melhor, anterior = max(melhor, corrida), d
    return {"dias": atual, "estudou_hoje": hoje in dias, "melhor": melhor}


def resumo_jogador(sessao: Session, aluno_id: int) -> dict:
    xp = xp_total(sessao, aluno_id)
    nivel = nivel_de(xp)
    return {
        "xp": xp, "nivel": nivel,
        "xp_inicio_nivel": xp_para_nivel(nivel), "xp_proximo_nivel": xp_para_nivel(nivel + 1),
        "sequencia": sequencia(sessao, aluno_id),
    }
