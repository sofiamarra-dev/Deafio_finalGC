"""Ranking geral, da semana e da turma, e o perfil público do aluno.

No ranking aparece o apelido (ou o primeiro nome com a inicial do sobrenome). E-mail nunca aparece."""
from datetime import datetime, timedelta

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.modelos import Envio, Matricula, ProgressoExercicio, ProgressoModulo, Usuario
from app.modelos.tempo import agora
from app.servicos.jogador import FUSO, dia_local, nivel_de, sequencia, xp_total

CORES = ("verde", "azul", "roxo", "laranja", "rosa", "amarelo")
TAMANHO = 50


def nome_exibido(usuario: Usuario) -> str:
    if usuario.apelido:
        return usuario.apelido
    partes = usuario.nome.split()
    return partes[0] if len(partes) == 1 else f"{partes[0]} {partes[-1][0]}."


def inicio_da_semana(momento: datetime | None = None) -> datetime:
    """Segunda-feira 00:00 no horário de Brasília, convertida para UTC (como o banco guarda)."""
    hoje = dia_local(momento or agora())
    segunda = hoje - timedelta(days=hoje.weekday())
    return datetime(segunda.year, segunda.month, segunda.day) - FUSO


def turmas_do_aluno(sessao: Session, aluno_id: int) -> list[int]:
    return list(sessao.scalars(select(Matricula.turma_id).where(Matricula.aluno_id == aluno_id)))


def ranking(sessao: Session, aluno_id: int, escopo: str) -> dict:
    xp = func.coalesce(func.sum(Envio.xp_ganho), 0).label("xp")
    juncao = Envio.aluno_id == Usuario.id
    if escopo == "semana":
        juncao = juncao & (Envio.criado_em >= inicio_da_semana())
    consulta = (select(Usuario, xp).outerjoin(Envio, juncao).where(Usuario.papel == "aluno")
                .group_by(Usuario.id))
    if escopo == "turma":
        turmas = turmas_do_aluno(sessao, aluno_id)
        if not turmas:
            return {"escopo": escopo, "linhas": [], "eu": None, "sem_turma": True}
        colegas = select(Matricula.aluno_id).where(Matricula.turma_id.in_(turmas))
        consulta = consulta.where(Usuario.id.in_(colegas))
    linhas = sessao.execute(consulta).all()
    # quem ainda não ganhou XP (no período) não enche o ranking; só a própria pessoa se vê mesmo com 0
    linhas = [l for l in linhas if l.xp > 0 or l.Usuario.id == aluno_id]
    linhas.sort(key=lambda l: (-l.xp, l.Usuario.id))
    from app.servicos.criatura import forma_da_criatura  # aqui dentro: criatura.py importa jogador.py
    from app.servicos.progressao import estagio_do_ovo

    def linha(posicao, l):
        total = l.xp if escopo != "semana" else xp_total(sessao, l.Usuario.id)
        return {"posicao": posicao, "id": l.Usuario.id, "nome": nome_exibido(l.Usuario), "cor": l.Usuario.avatar,
                "ninho": l.Usuario.ninho, "casca": l.Usuario.casca,
                "xp": int(l.xp), "nivel": nivel_de(int(total)), "ovo": estagio_do_ovo(sessao, l.Usuario.id),
                "especie": l.Usuario.criatura,
                "forma": forma_da_criatura(sessao, l.Usuario.id) if l.Usuario.criatura else 1,
                "eu": l.Usuario.id == aluno_id}

    todas = [linha(i, l) for i, l in enumerate(linhas, start=1)]
    eu = next((l for l in todas if l["eu"]), None)
    return {"escopo": escopo, "linhas": todas[:TAMANHO], "eu": eu, "sem_turma": False}


def conquistas(sessao: Session, aluno_id: int) -> list[dict]:
    """Conquistas calculadas na hora a partir do que está gravado. Nada é marcado à mão."""
    progresso = sessao.scalars(select(ProgressoExercicio).where(ProgressoExercicio.aluno_id == aluno_id,
                                                                ProgressoExercicio.concluido_em.is_not(None))).all()
    de_primeira = sum(p.tentativas_ate_acertar == 1 for p in progresso)
    sem_dica = sessao.scalar(select(func.count()).select_from(Envio).where(
        Envio.aluno_id == aluno_id, Envio.xp_ganho > 0, Envio.dicas_vistas == 0)) or 0
    persistente = sum((p.tentativas_ate_acertar or 0) >= 3 for p in progresso)
    salas = sessao.scalar(select(func.count()).select_from(ProgressoModulo).where(ProgressoModulo.aluno_id == aluno_id)) or 0
    seq = sequencia(sessao, aluno_id)["melhor"]
    lista = [
        ("primeiro-passo", "Primeiro passo", "Conclua seu primeiro exercício.", len(progresso), 1),
        ("de-primeira", "Mira certeira", "Acerte 5 exercícios de primeira.", de_primeira, 5),
        ("sem-dica", "Por conta própria", "Conclua 5 exercícios sem abrir dica.", sem_dica, 5),
        ("persistente", "Não desisto", "Acerte um exercício depois de errar 2 vezes ou mais.", persistente, 1),
        ("sequencia", "Ritmo", "Estude 3 dias seguidos.", seq, 3),
        ("primeira-sala", "Porta aberta", "Conclua a primeira sala.", salas, 1),
        ("tres-salas", "Explorador de salas", "Conclua 3 salas.", salas, 3),
    ]
    return [{"id": i, "titulo": t, "descricao": d, "progresso": min(v, meta), "meta": meta, "ganhou": v >= meta}
            for i, t, d, v, meta in lista]


def estatisticas(sessao: Session, aluno_id: int) -> dict:
    envios = sessao.scalar(select(func.count()).select_from(Envio).where(Envio.aluno_id == aluno_id)) or 0
    acertos = sessao.scalar(select(func.count()).select_from(Envio).where(Envio.aluno_id == aluno_id, Envio.correto)) or 0
    concluidos = sessao.scalar(select(func.count()).select_from(ProgressoExercicio).where(
        ProgressoExercicio.aluno_id == aluno_id, ProgressoExercicio.concluido_em.is_not(None))) or 0
    return {"envios": envios, "acertos": acertos, "erros": envios - acertos, "exercicios_concluidos": concluidos,
            "taxa_acerto": round(100 * acertos / envios) if envios else None}
