from types import SimpleNamespace

from app.conteudo.validar import validar_tudo
from app.correcao.corretor import corrigir_codigo


def _programa(casos, modo="stdin", funcao=None):
    ex = SimpleNamespace(tipo="programa", codigo_inicial="", modo_teste=modo, funcao=funcao, variavel=None)
    return ex, [SimpleNamespace(ordem=i, entrada=e, saida_esperada=s, visivel=i == 1)
                for i, (e, s) in enumerate(casos, start=1)]


def test_todo_o_conteudo_e_valido():
    assert validar_tudo() == []


def test_solucoes_diferentes_sao_aceitas():
    ex, casos = _programa([("2\n3", "5"), ("10\n-1", "9")])
    for codigo in ("print(int(input()) + int(input()))",
                   "a = int(input())\nb = int(input())\ntotal = sum([a, b])\nprint(total)"):
        assert corrigir_codigo(ex, casos, codigo).correto


def test_laco_infinito_vira_tempo_esgotado():
    ex, casos = _programa([("", "1")])
    r = corrigir_codigo(ex, casos, "while True:\n    pass")
    assert not r.correto and r.tipo_erro == "tempo_esgotado"


def test_erro_de_python_e_traduzido():
    ex, casos = _programa([("", "1")])
    r = corrigir_codigo(ex, casos, "print(x)")
    assert r.tipo_erro == "NameError" and "linha 1" in r.mensagem


def test_modo_funcao_compara_valor_e_ignora_prints():
    ex, casos = _programa([("[2, 3]", "5")], modo="funcao", funcao="soma")
    assert corrigir_codigo(ex, casos, "def soma(a, b):\n    print('oi')\n    return a + b").correto
    assert not corrigir_codigo(ex, casos, "def soma(a, b):\n    print(a + b)").correto
