"""Regras de progressão da trilha. Ficam aqui, num lugar só, e valem para a tela e para a API.

- O primeiro módulo começa liberado; cada módulo seguinte abre quando o anterior é concluído.
- Dentro do módulo, os exercícios Fácil abrem em ordem, um após o outro.
- Os Intermediário abrem (também em ordem) depois de todos os Fácil.
- Os Avançado abrem todos juntos depois de todos os Intermediário.
- Módulo concluído = todos os Fácil + todos os Intermediário + o desafio final.
- O ovo evolui um estágio por módulo concluído.
"""
from dataclasses import dataclass, field

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.modelos import Exercicio, Modulo, ProgressoExercicio, ProgressoModulo
from app.modelos.conteudo import DIFICULDADES

ORDEM_DIFICULDADE = {d: i for i, d in enumerate(DIFICULDADES)}


@dataclass
class EstadoExercicio:
    exercicio: Exercicio
    estado: str  # concluido | liberado | bloqueado


@dataclass
class EstadoModulo:
    modulo: Modulo
    estado: str  # concluido | liberado | bloqueado | em_producao
    exercicios: list[EstadoExercicio] = field(default_factory=list)

    @property
    def concluidos(self) -> int:
        return sum(e.estado == "concluido" for e in self.exercicios)


def ordenar(exercicios):
    return sorted(exercicios, key=lambda e: (ORDEM_DIFICULDADE[e.dificuldade], e.ordem))


def _estados_no_modulo(exercicios: list[Exercicio], feitos: set[str]) -> list[EstadoExercicio]:
    resultado = []
    for dificuldade in DIFICULDADES:
        anteriores_completos = all(
            e.id in feitos for e in exercicios if ORDEM_DIFICULDADE[e.dificuldade] < ORDEM_DIFICULDADE[dificuldade]
        )
        anterior_feito = True
        for ex in [e for e in exercicios if e.dificuldade == dificuldade]:
            if ex.id in feitos:
                estado = "concluido"
            elif anteriores_completos and (dificuldade == "avancado" or anterior_feito):
                estado = "liberado"
            else:
                estado = "bloqueado"
            resultado.append(EstadoExercicio(ex, estado))
            anterior_feito = ex.id in feitos
    return resultado


def modulo_completo(exercicios: list[Exercicio], feitos: set[str]) -> bool:
    obrigatorios = [e for e in exercicios if e.dificuldade != "avancado" or e.eh_desafio_final]
    return bool(obrigatorios) and all(e.id in feitos for e in obrigatorios)


def exercicios_concluidos(sessao: Session, aluno_id: int) -> set[str]:
    return set(sessao.scalars(select(ProgressoExercicio.exercicio_id).where(
        ProgressoExercicio.aluno_id == aluno_id, ProgressoExercicio.concluido_em.is_not(None))))


def estado_da_trilha(sessao: Session, aluno_id: int) -> list[EstadoModulo]:
    feitos = exercicios_concluidos(sessao, aluno_id)
    modulos_feitos = set(sessao.scalars(select(ProgressoModulo.modulo_id).where(ProgressoModulo.aluno_id == aluno_id)))
    todos = sessao.scalars(select(Exercicio)).all()
    por_modulo: dict[str, list[Exercicio]] = {}
    for ex in todos:
        por_modulo.setdefault(ex.modulo_id, []).append(ex)

    trilha, anterior_concluido = [], True
    for modulo in sessao.scalars(select(Modulo).order_by(Modulo.ordem)):
        exercicios = ordenar(por_modulo.get(modulo.id, []))
        if not exercicios:
            trilha.append(EstadoModulo(modulo, "em_producao"))
            anterior_concluido = False
            continue
        if modulo.id in modulos_feitos:
            estado = "concluido"
        elif anterior_concluido:
            estado = "liberado"
        else:
            estado = "bloqueado"
        if estado == "bloqueado":
            estados = [EstadoExercicio(e, "bloqueado") for e in exercicios]
        else:
            estados = _estados_no_modulo(exercicios, feitos)
        trilha.append(EstadoModulo(modulo, estado, estados))
        anterior_concluido = estado == "concluido"
    return trilha


def estado_do_exercicio(sessao: Session, aluno_id: int, exercicio_id: str) -> str | None:
    for modulo in estado_da_trilha(sessao, aluno_id):
        for item in modulo.exercicios:
            if item.exercicio.id == exercicio_id:
                return item.estado
    return None


def proximo_exercicio(sessao: Session, aluno_id: int) -> str | None:
    """O primeiro exercício liberado e ainda não concluído, na ordem da trilha.
    Avançados opcionais de módulos já concluídos só são sugeridos quando não sobra mais nada obrigatório."""
    trilha = estado_da_trilha(sessao, aluno_id)
    opcional = None
    for modulo in trilha:
        for item in modulo.exercicios:
            if item.estado != "liberado":
                continue
            if modulo.estado == "concluido":
                opcional = opcional or item.exercicio.id
            else:
                return item.exercicio.id
    return opcional


def estagio_do_ovo(sessao: Session, aluno_id: int) -> int:
    return sessao.scalar(select(func.count()).select_from(ProgressoModulo)
                         .where(ProgressoModulo.aluno_id == aluno_id)) or 0


def registrar_conclusao_do_modulo(sessao: Session, aluno_id: int, modulo_id: str) -> bool:
    """Marca o módulo como concluído se as regras forem cumpridas. Devolve True se acabou de concluir."""
    ja = sessao.scalar(select(ProgressoModulo).where(ProgressoModulo.aluno_id == aluno_id,
                                                      ProgressoModulo.modulo_id == modulo_id))
    if ja:
        return False
    exercicios = sessao.scalars(select(Exercicio).where(Exercicio.modulo_id == modulo_id)).all()
    if modulo_completo(exercicios, exercicios_concluidos(sessao, aluno_id)):
        sessao.add(ProgressoModulo(aluno_id=aluno_id, modulo_id=modulo_id))
        return True
    return False
