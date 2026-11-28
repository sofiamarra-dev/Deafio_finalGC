"""A lojinha: o aluno gasta "bytes" com itens para o ovo, escudos de sequência e a evolução da criatura.

Bytes ganhos = metade do XP + 15 por conquista. Como o XP só vem na primeira vez que o aluno acerta cada
exercício, não dá para farmar bytes refazendo exercício. O saldo é recalculado sempre (ganhos - compras).
A loja NÃO vende dica, XP nem resposta: o ranking continua medindo estudo."""
from dataclasses import dataclass

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.modelos import Compra, Usuario
from app.servicos.criatura import ESPECIES, forma_da_criatura
from app.servicos.jogador import nivel_de, sequencia, xp_total
from app.servicos.ranking import conquistas

BYTES_POR_CONQUISTA = 15
MAX_ESCUDOS = 2


@dataclass(frozen=True)
class Item:
    id: str
    nome: str
    descricao: str
    categoria: str  # ninho | casca | escudo | evolucao
    preco: int
    nivel: int = 1


CATALOGO = [
    Item("escudo-sequencia", "Escudo de sequência", "Se você pular um dia, o escudo protege sua sequência. Guarde até 2.", "escudo", 30),
    Item("ninho-palha", "Ninho de palha", "Um ninho simples e quentinho para o seu ovo.", "ninho", 20),
    Item("ninho-circuito", "Ninho de circuito", "Placa de circuito com luzes verdes piscando.", "ninho", 45, 2),
    Item("ninho-cristal", "Ninho de cristal", "Cristais azuis que brilham em volta do ovo.", "ninho", 80, 3),
    Item("ninho-vulcao", "Ninho de lava", "Pedras vulcânicas. Só para quem já subiu bastante.", "ninho", 120, 4),
    Item("casca-listras", "Casca listrada", "Listras na cor do seu ovo.", "casca", 25),
    Item("casca-binaria", "Casca binária", "A casca coberta de 0 e 1.", "casca", 40, 2),
    Item("casca-estrelas", "Casca estrelada", "Estrelas douradas pela casca.", "casca", 60, 3),
    Item("casca-dourada", "Casca de ouro", "A casca inteira dourada. Rara.", "casca", 150, 5),
    Item("evolucao-2", "Evolução: forma 2", "Sua criatura cresce, ganha enfeites novos e um nome novo. Precisa que ela já tenha nascido.", "evolucao", 100, 4),
    Item("evolucao-3", "Evolução: forma final", "A forma final, com aura e tudo. Precisa da forma 2.", "evolucao", 250, 6),
]
ITENS = {i.id: i for i in CATALOGO}


class CompraRecusada(ValueError):
    pass


def bytes_ganhos(sessao: Session, aluno_id: int) -> dict:
    xp = xp_total(sessao, aluno_id)
    ganhas = sum(c["ganhou"] for c in conquistas(sessao, aluno_id))
    return {"do_xp": xp // 2, "das_conquistas": ganhas * BYTES_POR_CONQUISTA, "total": xp // 2 + ganhas * BYTES_POR_CONQUISTA}


def compras(sessao: Session, aluno_id: int) -> list[Compra]:
    return list(sessao.scalars(select(Compra).where(Compra.aluno_id == aluno_id)))


def saldo(sessao: Session, aluno_id: int) -> int:
    gasto = sessao.scalar(select(func.coalesce(func.sum(Compra.preco), 0)).where(Compra.aluno_id == aluno_id))
    return bytes_ganhos(sessao, aluno_id)["total"] - int(gasto)


def _bloqueio(item: Item, aluno: Usuario, nivel: int, possui: set[str], escudos: int) -> str | None:
    if item.categoria in ("ninho", "casca") and item.id in possui:
        return "Você já tem."
    if item.categoria == "escudo" and escudos >= MAX_ESCUDOS:
        return f"Você já tem {MAX_ESCUDOS} escudos guardados."
    if item.categoria == "evolucao":
        if item.id in possui:
            return "Já evoluiu."
        if not aluno.criatura:
            return "Sua criatura ainda não nasceu."
        if item.id == "evolucao-3" and "evolucao-2" not in possui:
            return "Precisa da forma 2 antes."
    if nivel < item.nivel:
        return f"Libera no nível {item.nivel}."
    return None


def vitrine(sessao: Session, aluno: Usuario) -> dict:
    nivel = nivel_de(xp_total(sessao, aluno.id))
    possui = {c.item_id for c in compras(sessao, aluno.id)}
    seq = sequencia(sessao, aluno.id)
    disponivel = saldo(sessao, aluno.id)
    itens = []
    for item in CATALOGO:
        motivo = _bloqueio(item, aluno, nivel, possui, seq["escudos"])
        if motivo is None and disponivel < item.preco:
            motivo = f"Faltam {item.preco - disponivel} bytes."
        itens.append({"id": item.id, "nome": item.nome, "descricao": item.descricao, "categoria": item.categoria,
                      "preco": item.preco, "nivel": item.nivel, "possui": item.id in possui,
                      "pode_comprar": motivo is None, "motivo": motivo,
                      "equipado": item.id in (aluno.ninho, aluno.casca)})
    return {"saldo": disponivel, "ganhos": bytes_ganhos(sessao, aluno.id), "nivel": nivel, "escudos": seq["escudos"],
            "equipado": {"ninho": aluno.ninho, "casca": aluno.casca}, "forma": forma_da_criatura(sessao, aluno.id),
            "criatura": ({"especie": aluno.criatura, "formas": ESPECIES[aluno.criatura]["formas"]} if aluno.criatura else None),
            "itens": itens}


def comprar(sessao: Session, aluno: Usuario, item_id: str) -> Compra:
    item = ITENS.get(item_id)
    if item is None:
        raise CompraRecusada("Esse item não existe.")
    nivel = nivel_de(xp_total(sessao, aluno.id))
    possui = {c.item_id for c in compras(sessao, aluno.id)}
    motivo = _bloqueio(item, aluno, nivel, possui, sequencia(sessao, aluno.id)["escudos"])
    if motivo:
        raise CompraRecusada(motivo)
    if saldo(sessao, aluno.id) < item.preco:
        raise CompraRecusada("Bytes insuficientes.")
    compra = Compra(aluno_id=aluno.id, item_id=item.id, preco=item.preco)
    sessao.add(compra)
    if item.categoria == "ninho":
        aluno.ninho = item.id  # comprou, já usa
    elif item.categoria == "casca":
        aluno.casca = item.id
    return compra


def equipar(sessao: Session, aluno: Usuario, categoria: str, item_id: str | None) -> None:
    if categoria not in ("ninho", "casca"):
        raise CompraRecusada("Só dá para trocar ninho e casca.")
    if item_id is not None:
        item = ITENS.get(item_id)
        possui = {c.item_id for c in compras(sessao, aluno.id)}
        if item is None or item.categoria != categoria or item_id not in possui:
            raise CompraRecusada("Você não tem esse item.")
    setattr(aluno, categoria, item_id)
