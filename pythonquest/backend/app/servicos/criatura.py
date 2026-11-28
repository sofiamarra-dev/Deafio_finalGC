"""A criatura que nasce do ovo depende do JEITO de estudar, não só de quanto o aluno estudou.

Cinco traços, cada um de 0 a 100, calculados a partir do que está gravado (envios, dicas, progresso):
- certeira: acerta de primeira
- persistente: acerta depois de errar várias vezes (não desiste)
- exploradora: faz os avançados opcionais, que não são obrigatórios
- independente: resolve sem abrir dica
- constante: estuda em dias diferentes, um pouco por vez

Enquanto o ovo não eclode, a criatura "em formação" é a do traço mais forte e pode mudar.
Quando o ovo eclode (última sala concluída), a espécie fica gravada para sempre."""
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.modelos import Envio, Exercicio, Matricula, ProgressoExercicio, ProgressoModulo, Usuario
from app.servicos.jogador import dia_local

ESPECIES = {
    "certeira": {"nome": "Coruja Binária", "traco": "Certeira", "frase": "Pensa antes de enviar e costuma acertar de primeira."},
    "persistente": {"nome": "Tartaruga Loop", "traco": "Persistente", "frase": "Erra, tenta de novo e não desiste até passar nos testes."},
    "exploradora": {"nome": "Dragãozinho Pyxel", "traco": "Exploradora", "frase": "Vai atrás dos desafios avançados mesmo quando não são obrigatórios."},
    "independente": {"nome": "Gato Sintaxe", "traco": "Independente", "frase": "Gosta de descobrir sozinho, quase sem pedir dica."},
    "constante": {"nome": "Abelha Commit", "traco": "Constante", "frase": "Estuda um pouco a cada dia, sem pular."},
}
ORDEM = list(ESPECIES)  # desempate: a ordem acima
MINIMO_EXERCICIOS = 3
ESTAGIO_ECLOSAO = 6


def tracos(sessao: Session, aluno_id: int) -> dict:
    progresso = sessao.scalars(select(ProgressoExercicio).where(
        ProgressoExercicio.aluno_id == aluno_id, ProgressoExercicio.concluido_em.is_not(None))).all()
    feitos = len(progresso)
    if feitos == 0:
        return {"feitos": 0, "valores": {t: 0 for t in ORDEM}}
    de_primeira = sum(p.tentativas_ate_acertar == 1 for p in progresso)
    persistentes = sum((p.tentativas_ate_acertar or 0) >= 3 for p in progresso)
    sem_dica = sessao.scalar(select(func.count()).select_from(Envio).where(
        Envio.aluno_id == aluno_id, Envio.xp_ganho > 0, Envio.dicas_vistas == 0)) or 0
    opcionais = sessao.scalars(select(Exercicio.id).where(Exercicio.dificuldade == "avancado",
                                                          Exercicio.eh_desafio_final.is_(False))).all()
    ids_feitos = {p.exercicio_id for p in progresso}
    opcionais_feitos = sum(i in ids_feitos for i in opcionais)
    dias = {dia_local(m) for m in sessao.scalars(select(Envio.criado_em).where(Envio.aluno_id == aluno_id, Envio.correto))}

    def pct(valor, total):
        return round(100 * min(valor / total, 1)) if total else 0

    return {"feitos": feitos, "valores": {
        "certeira": pct(de_primeira, feitos),
        "persistente": pct(persistentes * 3, feitos),      # acertar depois de 2+ erros vale mais: é raro
        "exploradora": pct(opcionais_feitos, max(len(opcionais), 1)),
        "independente": pct(sem_dica, feitos),
        "constante": pct(len(dias), max(feitos / 3, 1)),   # um dia de estudo a cada 3 exercícios = 100
    }}


def especie_dominante(valores: dict) -> str:
    return max(ORDEM, key=lambda t: (valores[t], -ORDEM.index(t)))


def criatura_do_aluno(sessao: Session, aluno: Usuario) -> dict:
    dados = tracos(sessao, aluno.id)
    estagio = sessao.scalar(select(func.count()).select_from(ProgressoModulo).where(ProgressoModulo.aluno_id == aluno.id)) or 0
    if aluno.criatura:
        especie, situacao = aluno.criatura, "nasceu"
    elif dados["feitos"] < MINIMO_EXERCICIOS:
        especie, situacao = None, "cedo"
    else:
        especie, situacao = especie_dominante(dados["valores"]), "formando"
    return {"situacao": situacao, "especie": especie, **(ESPECIES[especie] if especie else {}),
            "tracos": [{"id": t, "nome": ESPECIES[t]["traco"], "valor": dados["valores"][t]} for t in ORDEM],
            "estagio": estagio, "minimo": MINIMO_EXERCICIOS, "feitos": dados["feitos"]}


def fixar_se_eclodiu(sessao: Session, aluno: Usuario) -> None:
    """Chamado quando uma sala é concluída: se foi a última, a espécie fica gravada."""
    estagio = sessao.scalar(select(func.count()).select_from(ProgressoModulo).where(ProgressoModulo.aluno_id == aluno.id)) or 0
    if estagio >= ESTAGIO_ECLOSAO and not aluno.criatura:
        aluno.criatura = especie_dominante(tracos(sessao, aluno.id)["valores"])


def ovo_da_turma(sessao: Session, turma_id: int) -> dict:
    """O ovo coletivo: cada sala que QUALQUER aluno da turma conclui aquece o ovo.
    Ele racha um estágio quando a turma soma, em média, uma sala por aluno. Para eclodir, todo mundo precisa chegar
    ao fim junto: quem está na frente ganha motivo para ajudar quem está atrás."""
    alunos = list(sessao.scalars(select(Matricula.aluno_id).where(Matricula.turma_id == turma_id)))
    n = len(alunos)
    salas = 0
    if alunos:
        salas = sessao.scalar(select(func.count()).select_from(ProgressoModulo)
                              .where(ProgressoModulo.aluno_id.in_(alunos))) or 0
    estagio = min(salas // n, ESTAGIO_ECLOSAO) if n else 0
    proximo = (estagio + 1) * n if estagio < ESTAGIO_ECLOSAO else None
    votos = {}
    for aluno in sessao.scalars(select(Usuario).where(Usuario.id.in_(alunos))):
        dados = tracos(sessao, aluno.id)
        if aluno.criatura or dados["feitos"] >= MINIMO_EXERCICIOS:
            especie = aluno.criatura or especie_dominante(dados["valores"])
            votos[especie] = votos.get(especie, 0) + 1
    especie = max(ORDEM, key=lambda e: (votos.get(e, 0), -ORDEM.index(e))) if votos else None
    return {"alunos": n, "salas": salas, "estagio": estagio, "salas_para_proximo": proximo - salas if proximo else 0,
            "especie": especie, "nome_especie": ESPECIES[especie]["nome"] if especie else None,
            "votos": [{"especie": e, "nome": ESPECIES[e]["nome"], "alunos": votos[e]} for e in ORDEM if e in votos]}
