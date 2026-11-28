"""Importa o conteúdo dos YAML para o banco: python -m app.conteudo.importar

Pode rodar quantas vezes quiser: atualiza o que mudou e mantém os ids, então o histórico dos alunos continua valendo.
Antes de importar, valida tudo (python -m app.conteudo.validar faz só a validação)."""
from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from app.conteudo.leitor import ler_modulos
from app.modelos import Alternativa, CasoTeste, Exercicio, Modulo

CAMPOS_EXERCICIO = ("dificuldade", "ordem", "tipo", "titulo", "enunciado", "codigo_inicial", "blocos", "dicas",
                    "explicacao", "assuntos", "xp_base", "modo_teste", "funcao", "variavel", "solucao",
                    "respostas_erradas")


def importar(sessao: Session, modulos: list[dict] | None = None) -> int:
    modulos = modulos if modulos is not None else ler_modulos()
    total = 0
    for dados in modulos:
        modulo = sessao.get(Modulo, dados["id"]) or Modulo(id=dados["id"])
        modulo.ordem, modulo.titulo = dados["ordem"], dados["titulo"]
        modulo.descricao, modulo.guia = dados["descricao"], dados.get("guia", "")
        sessao.add(modulo)
        sessao.flush()
        for ex in dados["exercicios"]:
            exercicio = sessao.get(Exercicio, ex["id"]) or Exercicio(id=ex["id"])
            exercicio.modulo_id = modulo.id
            for campo in CAMPOS_EXERCICIO:
                padrao = [] if campo in ("blocos", "dicas", "assuntos", "respostas_erradas") else None
                valor = ex.get(campo, padrao)
                if campo in ("codigo_inicial", "explicacao", "solucao") and valor is None:
                    valor = ""
                setattr(exercicio, campo, valor)
            if exercicio.tipo != "multipla_escolha" and not exercicio.modo_teste:
                exercicio.modo_teste = "stdin"
            exercicio.eh_desafio_final = bool(ex.get("desafio_final"))
            sessao.add(exercicio)
            sessao.flush()
            sessao.execute(delete(CasoTeste).where(CasoTeste.exercicio_id == exercicio.id))
            for i, caso in enumerate(ex.get("casos") or [], start=1):
                sessao.add(CasoTeste(exercicio_id=exercicio.id, ordem=i, entrada=str(caso.get("entrada", "")),
                                     saida_esperada=str(caso["saida"]), visivel=bool(caso.get("visivel"))))
            _sincronizar_alternativas(sessao, exercicio.id, ex.get("alternativas") or [])
            total += 1
    sessao.commit()
    return total


def _sincronizar_alternativas(sessao: Session, exercicio_id: str, alternativas: list[dict]) -> None:
    """Atualiza no lugar (mantém os ids, que ficam gravados nos envios dos alunos)."""
    existentes = sessao.scalars(select(Alternativa).where(Alternativa.exercicio_id == exercicio_id)
                                .order_by(Alternativa.ordem)).all()
    for i, alt in enumerate(alternativas, start=1):
        registro = existentes[i - 1] if i <= len(existentes) else Alternativa(exercicio_id=exercicio_id)
        registro.ordem, registro.texto = i, str(alt["texto"])
        registro.correta, registro.explicacao = bool(alt.get("correta")), alt.get("explicacao", "")
        sessao.add(registro)
    for sobra in existentes[len(alternativas):]:
        sessao.delete(sobra)


if __name__ == "__main__":
    from app.conteudo.validar import validar_tudo
    from app.db import FabricaSessao

    problemas = validar_tudo()
    if problemas:
        raise SystemExit("Conteúdo com problemas, nada foi importado:\n- " + "\n- ".join(problemas))
    with FabricaSessao() as s:
        print(f"{importar(s)} exercícios importados.")
