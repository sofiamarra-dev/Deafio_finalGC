"""Números para "Minha evolução" (aluno) e para o painel da turma (professor).
Tudo sai dos envios gravados: nada é estimado nem inventado. Sem dados, a resposta diz que não há dados."""
from collections import Counter, defaultdict
from datetime import timedelta

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.modelos import DicaVista, Envio, Exercicio, Matricula, ProgressoExercicio, ProgressoModulo, Usuario
from app.modelos.tempo import agora
from app.servicos.jogador import dia_local, nivel_de, xp_total
from app.servicos.ranking import nome_exibido

NOME_ERRO = {
    "saida_errada": "Saída diferente da esperada", "tempo_esgotado": "Laço que não termina (tempo esgotado)",
    "alternativa_errada": "Alternativa errada", "erro_execucao": "Erro ao rodar o programa",
    "SyntaxError": "Erro de sintaxe (dois-pontos, parênteses, aspas)", "IndentationError": "Indentação (espaços no começo da linha)",
    "TabError": "Mistura de TAB e espaços", "NameError": "Nome usado antes de existir ou escrito diferente",
    "TypeError": "Tipos que não combinam (ex.: texto + número)", "ValueError": "Valor no formato errado (ex.: int('abc'))",
    "IndexError": "Posição que não existe na lista", "KeyError": "Chave que não existe no dicionário",
    "ZeroDivisionError": "Divisão por zero", "AttributeError": "Método ou atributo que não existe",
    "EOFError": "input() a mais", "RecursionError": "Recursão sem fim",
}
NOME_ASSUNTO = {
    "print": "print", "input": "input", "int": "int()", "float": "float()", "str": "textos (str)", "tipos": "tipos de dados",
    "operadores": "operadores", "divisao_inteira": "divisão inteira (//)", "resto": "resto (%)", "logica": "lógica",
    "if": "if", "elif": "elif", "else": "else", "comparacao": "comparações", "and": "and", "or": "or", "funcao": "funções",
}
MINIMO_ENVIOS_ASSUNTO = 2
DIAS_ATIVIDADE = 14
DIAS_SEM_ESTUDAR = 7


def _envios(sessao: Session, alunos: list[int]):
    if not alunos:
        return []
    return sessao.execute(select(Envio.aluno_id, Envio.exercicio_id, Envio.correto, Envio.tipo_erro, Envio.criado_em,
                                 Envio.dicas_vistas).where(Envio.aluno_id.in_(alunos))).all()


def _assuntos(sessao: Session) -> dict[str, list[str]]:
    return {e.id: e.assuntos or [] for e in sessao.scalars(select(Exercicio))}


def por_assunto(envios, assuntos_de) -> list[dict]:
    contagem = defaultdict(lambda: [0, 0])  # assunto -> [envios, acertos]
    for e in envios:
        for assunto in assuntos_de.get(e.exercicio_id, []):
            contagem[assunto][0] += 1
            contagem[assunto][1] += int(e.correto)
    linhas = [{"assunto": a, "nome": NOME_ASSUNTO.get(a, a), "envios": n, "acertos": ok, "taxa": round(100 * ok / n)}
              for a, (n, ok) in contagem.items()]
    return sorted(linhas, key=lambda l: (l["taxa"], -l["envios"]))


def erros_comuns(envios, limite=5) -> list[dict]:
    contagem = Counter(e.tipo_erro for e in envios if not e.correto and e.tipo_erro)
    return [{"tipo": t, "nome": NOME_ERRO.get(t, t), "vezes": n} for t, n in contagem.most_common(limite)]


def atividade(envios, dias=DIAS_ATIVIDADE) -> list[dict]:
    hoje = dia_local(agora())
    por_dia = defaultdict(lambda: [0, 0])
    for e in envios:
        d = dia_local(e.criado_em)
        por_dia[d][0] += 1
        por_dia[d][1] += int(e.correto)
    return [{"dia": (hoje - timedelta(days=i)).isoformat(), "envios": por_dia[hoje - timedelta(days=i)][0],
             "acertos": por_dia[hoje - timedelta(days=i)][1]} for i in range(dias - 1, -1, -1)]


def exercicios_dificeis(sessao: Session, alunos: list[int], limite=5) -> list[dict]:
    """Exercícios em que mais se erra: média de tentativas até acertar e quantos ainda não conseguiram."""
    if not alunos:
        return []
    titulos = {e.id: e.titulo for e in sessao.scalars(select(Exercicio))}
    progresso = sessao.scalars(select(ProgressoExercicio).where(ProgressoExercicio.aluno_id.in_(alunos))).all()
    grupos = defaultdict(list)
    for p in progresso:
        grupos[p.exercicio_id].append(p)
    linhas = []
    for exercicio_id, lista in grupos.items():
        concluidos = [p for p in lista if p.concluido_em]
        travados = len(lista) - len(concluidos)
        media = sum(p.tentativas_ate_acertar for p in concluidos) / len(concluidos) if concluidos else None
        erros = sum(p.tentativas - (1 if p.concluido_em else 0) for p in lista)
        if erros == 0:
            continue
        linhas.append({"id": exercicio_id, "titulo": titulos.get(exercicio_id, exercicio_id), "tentaram": len(lista),
                       "concluiram": len(concluidos), "travados": travados, "erros": erros,
                       "media_tentativas": round(media, 1) if media else None})
    return sorted(linhas, key=lambda l: (-l["travados"], -l["erros"]))[:limite]


def evolucao_do_aluno(sessao: Session, aluno_id: int) -> dict:
    envios = _envios(sessao, [aluno_id])
    assuntos = por_assunto(envios, _assuntos(sessao))
    melhorar = [a for a in assuntos if a["envios"] >= MINIMO_ENVIOS_ASSUNTO and a["taxa"] < 70][:3]
    fortes = sorted([a for a in assuntos if a["envios"] >= MINIMO_ENVIOS_ASSUNTO and a["taxa"] >= 80],
                    key=lambda a: -a["taxa"])[:3]
    acertos = sum(e.correto for e in envios)
    return {
        "total_envios": len(envios), "acertos": acertos, "erros": len(envios) - acertos,
        "dicas": sessao.query(DicaVista).filter(DicaVista.aluno_id == aluno_id).count(),
        "atividade": atividade(envios), "assuntos": assuntos, "melhorar": melhorar, "fortes": fortes,
        "erros_comuns": erros_comuns(envios), "exercicios_dificeis": exercicios_dificeis(sessao, [aluno_id], 3),
        "minimo_envios_assunto": MINIMO_ENVIOS_ASSUNTO,
    }


def painel_da_turma(sessao: Session, turma_id: int) -> dict:
    alunos = sessao.scalars(select(Usuario).join(Matricula, Matricula.aluno_id == Usuario.id)
                            .where(Matricula.turma_id == turma_id).order_by(Usuario.nome)).all()
    ids = [a.id for a in alunos]
    envios = _envios(sessao, ids)
    por_aluno = defaultdict(list)
    for e in envios:
        por_aluno[e.aluno_id].append(e)
    salas = Counter(sessao.scalars(select(ProgressoModulo.aluno_id).where(ProgressoModulo.aluno_id.in_(ids)))) if ids else Counter()
    feitos = Counter(sessao.scalars(select(ProgressoExercicio.aluno_id).where(
        ProgressoExercicio.aluno_id.in_(ids), ProgressoExercicio.concluido_em.is_not(None)))) if ids else Counter()
    limite_inativo = agora() - timedelta(days=DIAS_SEM_ESTUDAR)
    linhas = []
    for a in alunos:
        lista = por_aluno[a.id]
        ultimo = max((e.criado_em for e in lista), default=None)
        acertos = sum(e.correto for e in lista)
        xp = xp_total(sessao, a.id)
        atencao = []
        if ultimo is None:
            atencao.append("ainda não começou")
        elif ultimo < limite_inativo:
            atencao.append(f"sem estudar há mais de {DIAS_SEM_ESTUDAR} dias")
        if len(lista) >= 5 and acertos / len(lista) < 0.4:
            atencao.append("muitos erros")
        linhas.append({"id": a.id, "nome": a.nome, "apelido": nome_exibido(a), "xp": xp, "nivel": nivel_de(xp),
                       "salas": salas[a.id], "exercicios": feitos[a.id], "envios": len(lista), "acertos": acertos,
                       "taxa": round(100 * acertos / len(lista)) if lista else None,
                       "ultimo_envio": ultimo.isoformat() + "Z" if ultimo else None, "atencao": atencao})
    acertos = sum(e.correto for e in envios)
    return {
        "alunos": linhas, "total_envios": len(envios), "taxa": round(100 * acertos / len(envios)) if envios else None,
        "ativos_7_dias": sum(1 for l in linhas if l["ultimo_envio"] and l["ultimo_envio"] >= limite_inativo.isoformat()),
        "assuntos": por_assunto(envios, _assuntos(sessao)), "erros_comuns": erros_comuns(envios),
        "exercicios_dificeis": exercicios_dificeis(sessao, ids), "atividade": atividade(envios),
    }
