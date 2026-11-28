"""Corrige uma resposta: monta o programa, manda para o sandbox e compara com o esperado AQUI no servidor.
Nunca compara o código do aluno com uma resposta pronta: só o comportamento nos casos de teste."""
import ast
import re
from collections import Counter
from dataclasses import dataclass, field

from app.correcao import sandbox
from app.correcao.erros import explicar

TAMANHO_MAXIMO = 20_000
LACUNA = "___"


class RespostaInvalida(ValueError):
    """A resposta nem chegou a ser corrigida (vazia, grande demais, alternativa inexistente)."""


@dataclass
class ResultadoCaso:
    ordem: int
    visivel: bool
    passou: bool
    entrada: str = ""
    esperado: str = ""
    obtido: str = ""
    erro: str = ""


@dataclass
class Resultado:
    correto: bool
    passados: int
    total: int
    tipo_erro: str | None = None
    mensagem: str = ""
    casos: list[ResultadoCaso] = field(default_factory=list)
    alternativa_explicacao: str = ""


def normalizar_saida(texto: str) -> str:
    linhas = texto.replace("\r\n", "\n").replace("\r", "\n").split("\n")
    return "\n".join(l.rstrip() for l in linhas).strip("\n")


def saidas_iguais(modo: str, esperado: str, obtido: str) -> bool:
    if modo == "funcao":
        try:
            return ast.literal_eval(esperado) == ast.literal_eval(obtido)
        except (ValueError, SyntaxError):
            return esperado.strip() == obtido.strip()
    return normalizar_saida(esperado) == normalizar_saida(obtido)


def montar_programa(exercicio, resposta: str) -> str:
    if exercicio.tipo == "montar":
        # Só valem as peças entregues, cada uma no máximo uma vez. A ordem quem julga são os testes.
        sobrando = Counter(exercicio.blocos)
        for linha in (l.rstrip() for l in resposta.splitlines() if l.strip()):
            if sobrando[linha] <= 0:
                raise RespostaInvalida("Monte o programa só com as peças disponíveis.")
            sobrando[linha] -= 1
        return resposta
    if exercicio.tipo == "completar":
        if "\n" in resposta.strip():
            raise RespostaInvalida("A lacuna aceita só uma linha.")
        return exercicio.codigo_inicial.replace(LACUNA, resposta.strip(), 1)
    return resposta


def trocar_variavel(codigo: str, variavel: str, valor: str) -> str:
    padrao = re.compile(r"^[ \t]*" + re.escape(variavel) + r"[ \t]*=.*$", re.M)
    if not padrao.search(codigo):
        raise RespostaInvalida(f'Mantenha a linha "{variavel} = ..." no código: os testes trocam o valor dela.')
    return padrao.sub(lambda _: f"{variavel} = {valor}", codigo, count=1)


def corrigir_multipla_escolha(alternativas, resposta: str) -> Resultado:
    escolhida = next((a for a in alternativas if str(a.id) == str(resposta)), None)
    if escolhida is None:
        raise RespostaInvalida("Escolha uma das alternativas.")
    return Resultado(
        correto=escolhida.correta, passados=int(escolhida.correta), total=1,
        tipo_erro=None if escolhida.correta else "alternativa_errada",
        alternativa_explicacao=escolhida.explicacao,
    )


def corrigir_codigo(exercicio, casos, resposta: str) -> Resultado:
    if not resposta.strip():
        raise RespostaInvalida("A resposta está vazia.")
    if len(resposta) > TAMANHO_MAXIMO:
        raise RespostaInvalida("O código passou do tamanho máximo (20 mil caracteres).")

    programa = montar_programa(exercicio, resposta)
    modo = exercicio.modo_teste or "stdin"
    pedidos = []
    for caso in casos:
        if modo == "variavel":
            pedidos.append({"codigo": trocar_variavel(programa, exercicio.variavel, caso.entrada), "modo": "stdin", "entrada": ""})
        elif modo == "funcao":
            pedidos.append({"codigo": programa, "modo": "funcao", "funcao": exercicio.funcao, "entrada": caso.entrada})
        else:
            pedidos.append({"codigo": programa, "modo": "stdin", "entrada": caso.entrada})

    saidas = sandbox.executar(pedidos)

    resultado = Resultado(correto=True, passados=0, total=len(casos))
    for caso, saida in zip(casos, saidas):
        erro_texto, tipo = "", None
        if saida["tempo_esgotado"]:
            tipo, erro_texto = "tempo_esgotado", "O programa passou do tempo limite. Algum laço nunca termina?"
            passou = False
        elif saida["codigo_saida"] != 0:
            tipo, erro_texto = explicar(saida["erro"])
            tipo = tipo or "erro_execucao"
            passou = False
        else:
            passou = saidas_iguais(modo, caso.saida_esperada, saida["saida"])
            tipo = None if passou else "saida_errada"
        resultado.passados += int(passou)
        if not passou and resultado.correto:
            resultado.correto = False
            resultado.tipo_erro = tipo
            resultado.mensagem = erro_texto or "A saída não foi a esperada em pelo menos um caso de teste."
        visivel = caso.visivel
        resultado.casos.append(ResultadoCaso(
            ordem=caso.ordem, visivel=visivel, passou=passou,
            entrada=caso.entrada if visivel else "",
            esperado=caso.saida_esperada if visivel else "",
            obtido=saida["saida"][:2048] if visivel else "",
            erro=erro_texto if visivel else ("" if passou else (tipo or "")),
        ))
    return resultado


def corrigir(exercicio, casos, alternativas, resposta: str) -> Resultado:
    if exercicio.tipo == "multipla_escolha":
        return corrigir_multipla_escolha(alternativas, resposta)
    return corrigir_codigo(exercicio, casos, resposta)
