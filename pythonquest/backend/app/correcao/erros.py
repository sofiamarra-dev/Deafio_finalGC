"""Transforma o erro do Python numa frase que ajude o aluno iniciante."""
import re

MENSAGENS = {
    "SyntaxError": "Erro de sintaxe: o Python não entendeu como o código está escrito. Confira dois-pontos, parênteses e aspas.",
    "IndentationError": "Erro de indentação: os espaços no começo das linhas não estão alinhados. Use 4 espaços por nível.",
    "TabError": "Mistura de TAB e espaços na indentação. Use só espaços.",
    "NameError": "Um nome (variável ou função) foi usado antes de existir, ou está escrito diferente.",
    "TypeError": "Operação com um tipo de valor que não combina (por exemplo, somar texto com número).",
    "ValueError": "Um valor está no formato errado (por exemplo, int('abc')).",
    "IndexError": "A posição pedida não existe na lista ou no texto.",
    "KeyError": "Essa chave não existe no dicionário.",
    "ZeroDivisionError": "Divisão por zero.",
    "AttributeError": "Esse tipo de valor não tem esse método ou atributo.",
    "EOFError": "O programa chamou input() mais vezes do que a quantidade de entradas do teste.",
    "RecursionError": "A função chamou a si mesma vezes demais.",
    "MemoryError": "O programa usou memória demais.",
}


def tipo_do_erro(stderr: str) -> str | None:
    for linha in reversed(stderr.strip().splitlines()):
        achado = re.match(r"^(\w+(?:Error|Exception))\b", linha.strip())
        if achado:
            return achado.group(1)
    return None


def explicar(stderr: str) -> tuple[str | None, str]:
    """Devolve (tipo, mensagem amigável + a última linha do erro original)."""
    tipo = tipo_do_erro(stderr)
    linhas = [l for l in stderr.strip().splitlines() if l.strip()]
    original = linhas[-1].strip() if linhas else ""
    numero_linha = None
    for linha in linhas:
        achado = re.search(r'File "(?:[^"]*[/\\])?programa\.py", line (\d+)', linha)
        if achado:
            numero_linha = achado.group(1)
    amigavel = MENSAGENS.get(tipo or "", "O programa terminou com erro.")
    if numero_linha:
        amigavel += f" (linha {numero_linha})"
    return tipo, f"{amigavel}\nDetalhe: {original}" if original else amigavel
