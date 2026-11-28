"""Roda DENTRO do sandbox. Só usa a biblioteca padrão e não conhece as respostas esperadas.

Recebe pela entrada padrão um JSON:
  {"tempo_caso": 2, "casos": [{"codigo": "...", "modo": "stdin" | "funcao", "entrada": "...", "funcao": "nome"}]}
Devolve pela saída padrão um JSON com a saída de cada caso. Cada caso roda num processo Python separado,
com tempo máximo; o código do aluno nunca escreve direto na saída deste programa.
"""
import json
import os
import subprocess
import sys
import tempfile

LIMITE_SAIDA = 64 * 1024

# Usado no modo "funcao": roda o código do aluno com o print desviado e imprime só o valor devolvido.
CHAMADOR = r'''
import ast, contextlib, io, sys
argumentos = ast.literal_eval(sys.stdin.read() or "[]")
nome = sys.argv[2]
codigo = open(sys.argv[1], encoding="utf-8").read()
espaco = {"__name__": "__aluno__"}
with contextlib.redirect_stdout(io.StringIO()):
    exec(compile(codigo, "programa.py", "exec"), espaco)
    if nome not in espaco or not callable(espaco[nome]):
        raise NameError("a função '%s' não foi definida" % nome)
    resultado = espaco[nome](*argumentos)
sys.stdout.write(repr(resultado))
'''


def limitar_recursos():  # pragma: no cover - só existe em Linux/macOS
    try:
        import resource
        resource.setrlimit(resource.RLIMIT_AS, (512 * 1024 * 1024,) * 2)
        resource.setrlimit(resource.RLIMIT_FSIZE, (1024 * 1024,) * 2)
    except (ImportError, ValueError, OSError):
        pass


def rodar_caso(pasta, caso, tempo):
    programa = os.path.join(pasta, "programa.py")
    with open(programa, "w", encoding="utf-8") as arquivo:
        arquivo.write(caso["codigo"])
    if caso.get("modo") == "funcao":
        chamador = os.path.join(pasta, "chamador.py")
        with open(chamador, "w", encoding="utf-8") as arquivo:
            arquivo.write(CHAMADOR)
        comando = [sys.executable, "-I", chamador, programa, caso["funcao"]]
    else:
        comando = [sys.executable, "-I", programa]
    extras = {"preexec_fn": limitar_recursos} if os.name == "posix" else {}
    try:
        processo = subprocess.run(
            comando, input=caso.get("entrada", ""), capture_output=True, text=True,
            timeout=tempo, cwd=pasta, env={"PYTHONIOENCODING": "utf-8"}, **extras,
        )
    except subprocess.TimeoutExpired:
        return {"saida": "", "erro": "", "codigo_saida": None, "tempo_esgotado": True}
    return {
        "saida": processo.stdout[:LIMITE_SAIDA],
        "erro": processo.stderr[-2048:],
        "codigo_saida": processo.returncode,
        "tempo_esgotado": False,
    }


def main():
    pedido = json.loads(sys.stdin.read())
    tempo = float(pedido.get("tempo_caso", 2))
    resultados = []
    with tempfile.TemporaryDirectory() as pasta:
        for caso in pedido["casos"]:
            resultados.append(rodar_caso(pasta, caso, tempo))
    sys.stdout.write(json.dumps({"resultados": resultados}))


if __name__ == "__main__":
    main()
