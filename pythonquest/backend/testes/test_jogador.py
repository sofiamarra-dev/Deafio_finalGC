from datetime import date, datetime

from app.servicos.jogador import calcular_xp, nivel_de, xp_para_nivel
from testes.test_trilha_e_permissoes import _resolver


def test_xp_de_primeira_tem_bonus_e_erros_e_dicas_descontam():
    assert calcular_xp(20, tentativas=1, dicas=0, modulo_concluido=False).total == 30
    assert calcular_xp(20, tentativas=2, dicas=0, modulo_concluido=False).total == 18
    assert calcular_xp(20, tentativas=1, dicas=1, modulo_concluido=False).total == 27
    # nunca menos que 40% do exercício
    assert calcular_xp(20, tentativas=30, dicas=5, modulo_concluido=False).total == 8
    assert calcular_xp(20, tentativas=1, dicas=0, modulo_concluido=True).total == 80


def test_niveis():
    assert [xp_para_nivel(n) for n in range(1, 5)] == [0, 60, 180, 360]
    assert nivel_de(0) == 1 and nivel_de(59) == 1 and nivel_de(60) == 2 and nivel_de(400) == 4


def test_xp_so_na_primeira_conclusao(aluno):
    r = _resolver(aluno, "fundamentos-f1")
    assert r["xp"]["ganho"] == 15  # 10 + 50% de primeira
    assert r["jogador"]["xp"] == 15
    de_novo = _resolver(aluno, "fundamentos-f1")
    assert de_novo["xp"]["ganho"] == 0 and de_novo["jogador"]["xp"] == 15
    trilha = aluno.get("/api/trilha").json()
    assert trilha["jogador"]["xp"] == 15
    assert trilha["jogador"]["sequencia"]["dias"] == 1 and trilha["jogador"]["sequencia"]["estudou_hoje"]


def test_erro_antes_de_acertar_tira_o_bonus(aluno):
    _resolver(aluno, "fundamentos-f1")
    aluno.get("/api/exercicios/fundamentos-f2")
    assert aluno.post("/api/exercicios/fundamentos-f2/envios", json={"resposta": ","}).json()["xp"]["ganho"] == 0
    assert _resolver(aluno, "fundamentos-f2")["xp"]["ganho"] == 9  # 10 - 10% por 1 erro


def test_sequencia_de_dias(aluno, fabrica):
    from app.modelos import Envio, Usuario
    from app.servicos.jogador import sequencia
    from sqlalchemy import select
    _resolver(aluno, "fundamentos-f1")
    with fabrica() as s:
        aluno_id = s.scalar(select(Usuario.id).where(Usuario.papel == "aluno"))
        modelo = s.scalars(select(Envio).where(Envio.aluno_id == aluno_id)).first()
        s.query(Envio).filter(Envio.aluno_id == aluno_id).delete()
        # acertos em 10, 11 e 12 de março (meio-dia em Brasília = 15h UTC) e em 1º de março
        for dia in (1, 10, 11, 12):
            s.add(Envio(aluno_id=aluno_id, exercicio_id=modelo.exercicio_id, resposta="x", correto=True,
                        criado_em=datetime(2026, 3, dia, 15)))
        s.commit()
        assert sequencia(s, aluno_id, hoje=date(2026, 3, 12)) == {"dias": 3, "estudou_hoje": True, "melhor": 3}
        assert sequencia(s, aluno_id, hoje=date(2026, 3, 13))["dias"] == 3  # ainda não estudou hoje: mantém
        assert sequencia(s, aluno_id, hoje=date(2026, 3, 14))["dias"] == 0  # pulou um dia: zera
