"""Valida o conteúdo: python -m app.conteudo.validar

Para cada exercício de código: a solução de referência precisa passar em TODOS os casos, e cada resposta
errada cadastrada precisa falhar em pelo menos um. Assim sabemos que os testes realmente separam certo de errado."""
from types import SimpleNamespace

from app.conteudo.leitor import ler_modulos
from app.correcao.corretor import corrigir_codigo


def _como_objetos(ex: dict):
    exercicio = SimpleNamespace(tipo=ex["tipo"], codigo_inicial=ex.get("codigo_inicial", ""),
                                modo_teste=ex.get("modo_teste", "stdin"), funcao=ex.get("funcao"),
                                variavel=ex.get("variavel"))
    casos = [SimpleNamespace(ordem=i, entrada=str(c.get("entrada", "")), saida_esperada=str(c["saida"]),
                             visivel=bool(c.get("visivel"))) for i, c in enumerate(ex["casos"], start=1)]
    return exercicio, casos


def validar_tudo() -> list[str]:
    problemas = []
    for modulo in ler_modulos():
        for ex in modulo["exercicios"]:
            if ex["tipo"] == "multipla_escolha":
                continue
            exercicio, casos = _como_objetos(ex)
            certo = corrigir_codigo(exercicio, casos, ex["solucao"])
            if not certo.correto:
                problemas.append(f"{ex['id']}: a solução falhou ({certo.passados}/{certo.total}). {certo.mensagem}")
            for i, errada in enumerate(ex.get("respostas_erradas") or [], start=1):
                if corrigir_codigo(exercicio, casos, errada).correto:
                    problemas.append(f"{ex['id']}: a resposta errada nº {i} passou em todos os testes")
    return problemas


if __name__ == "__main__":
    erros = validar_tudo()
    if erros:
        raise SystemExit("Problemas encontrados:\n- " + "\n- ".join(erros))
    print("Conteúdo válido.")
