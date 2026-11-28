"""Lê os YAML de conteúdo e confere a estrutura antes de qualquer coisa ir para o banco."""
from pathlib import Path

import yaml

from app.config import PASTA_BACKEND
from app.modelos.conteudo import DIFICULDADES, MODOS_TESTE, TIPOS

PASTA_CONTEUDO = PASTA_BACKEND / "conteudo"
XP_PADRAO = {"facil": 10, "intermediario": 20, "avancado": 35}


class ConteudoInvalido(ValueError):
    pass


def _conferir_exercicio(ex: dict, onde: str) -> None:
    def exigir(condicao, mensagem):
        if not condicao:
            raise ConteudoInvalido(f"{onde} ({ex.get('id', '?')}): {mensagem}")

    for campo in ("id", "dificuldade", "tipo", "titulo", "enunciado"):
        exigir(ex.get(campo), f"falta o campo '{campo}'")
    exigir(ex["dificuldade"] in DIFICULDADES, f"dificuldade deve ser uma de {DIFICULDADES}")
    exigir(ex["tipo"] in TIPOS, f"tipo deve ser um de {TIPOS}")
    exigir(ex.get("dicas"), "todo exercício precisa de pelo menos uma dica")
    if ex["tipo"] == "multipla_escolha":
        alternativas = ex.get("alternativas") or []
        exigir(len(alternativas) >= 2, "múltipla escolha precisa de pelo menos 2 alternativas")
        exigir(sum(bool(a.get("correta")) for a in alternativas) == 1, "precisa de exatamente 1 alternativa correta")
        exigir(all(a.get("explicacao") for a in alternativas), "toda alternativa precisa de explicação")
        return
    exigir(ex.get("solucao"), "falta a solução de referência")
    exigir(ex.get("casos"), "faltam casos de teste")
    exigir(any(c.get("visivel") for c in ex["casos"]), "pelo menos um caso precisa ser visível (exemplo)")
    exigir(any(not c.get("visivel") for c in ex["casos"]), "pelo menos um caso precisa ser escondido")
    modo = ex.get("modo_teste", "stdin")
    exigir(modo in MODOS_TESTE, f"modo_teste deve ser um de {MODOS_TESTE}")
    if modo == "funcao":
        exigir(ex.get("funcao"), "modo funcao precisa do campo 'funcao'")
    if modo == "variavel":
        exigir(ex.get("variavel"), "modo variavel precisa do campo 'variavel'")
    if ex["tipo"] == "montar":
        # As peças são as linhas da solução (com o recuo) mais as peças falsas, que não servem.
        linhas = [l.rstrip() for l in ex["solucao"].splitlines() if l.strip()]
        exigir(len(linhas) >= 3, "montar precisa de uma solução com pelo menos 3 linhas")
        exigir(not ex.get("blocos"), "no tipo montar as peças saem da solução; use 'distratores' para peças extras")
        distratores = [str(d).rstrip() for d in ex.get("distratores") or []]
        exigir(not set(distratores) & set(linhas), "um distrator não pode ser igual a uma linha da solução")
        ex["blocos"] = linhas + distratores
    if ex["tipo"] == "completar":
        exigir(ex.get("codigo_inicial", "").count("___") == 1, "o código precisa ter exatamente uma lacuna ___")


def ler_modulos(pasta: Path = PASTA_CONTEUDO) -> list[dict]:
    modulos, ids = [], set()
    for arquivo in sorted(pasta.glob("*.yaml")):
        dados = yaml.safe_load(arquivo.read_text(encoding="utf-8"))
        for campo in ("id", "ordem", "titulo", "descricao"):
            if not dados.get(campo):
                raise ConteudoInvalido(f"{arquivo.name}: falta o campo '{campo}'")
        exercicios = dados.get("exercicios") or []
        finais = 0
        contagem = {d: 0 for d in DIFICULDADES}
        for ex in exercicios:
            _conferir_exercicio(ex, arquivo.name)
            if ex["id"] in ids:
                raise ConteudoInvalido(f"{arquivo.name}: id repetido {ex['id']}")
            ids.add(ex["id"])
            contagem[ex["dificuldade"]] += 1
            ex["ordem"] = contagem[ex["dificuldade"]]
            ex.setdefault("xp_base", XP_PADRAO[ex["dificuldade"]])
            finais += bool(ex.get("desafio_final"))
            if ex.get("desafio_final") and ex["dificuldade"] != "avancado":
                raise ConteudoInvalido(f"{arquivo.name}: o desafio final precisa ser avançado")
        if exercicios and finais != 1:
            raise ConteudoInvalido(f"{arquivo.name}: um módulo com exercícios precisa de exatamente 1 desafio final")
        dados["exercicios"] = exercicios
        modulos.append(dados)
    return modulos
