from app.modelos import Exercicio


def test_sem_login_nao_ve_trilha(cliente):
    assert cliente.get("/api/trilha").status_code == 401
    assert cliente.get("/api/exercicios/fundamentos-f1").status_code == 401


def test_professor_nao_usa_rotas_de_aluno(cliente):
    cliente.post("/api/contas/entrar", json={"email": "prof@escola.br", "senha": "senha-prof"})
    assert cliente.get("/api/trilha").status_code == 403


def test_trilha_inicial(aluno):
    trilha = aluno.get("/api/trilha").json()
    m1, m2 = trilha["modulos"][0], trilha["modulos"][1]
    assert m1["estado"] == "liberado" and m2["estado"] == "bloqueado"
    estados = [e["estado"] for e in m1["exercicios"]]
    assert estados[0] == "liberado" and set(estados[1:]) == {"bloqueado"}
    assert trilha["modulos"][2]["estado"] == "em_producao"
    assert trilha["ovo"]["estagio"] == 0
    assert trilha["proximo_exercicio"] == "fundamentos-f1"


def test_exercicio_bloqueado_nao_abre_nem_aceita_envio(aluno):
    assert aluno.get("/api/exercicios/fundamentos-f2").status_code == 403
    assert aluno.post("/api/exercicios/fundamentos-f2/envios", json={"resposta": "+"}).status_code == 403
    assert aluno.post("/api/exercicios/fundamentos-f2/dicas").status_code == 403


def test_exercicio_nao_vaza_gabarito_nem_casos_escondidos(aluno, fabrica):
    mc = aluno.get("/api/exercicios/fundamentos-f1").json()
    assert all(set(a) == {"id", "texto"} for a in mc["alternativas"])
    assert "solucao" not in mc and "respostas_erradas" not in mc
    with fabrica() as s:
        s.get(Exercicio, "fundamentos-f1")
    _resolver(aluno, "fundamentos-f1", mc)
    codigo = aluno.get("/api/exercicios/fundamentos-f2").json()
    assert len(codigo["exemplos"]) == 2 and codigo["casos_escondidos"] == 1
    assert "Carlos Eduardo" not in str(codigo)


def test_dicas_aparecem_uma_por_vez(aluno):
    primeira = aluno.post("/api/exercicios/fundamentos-f1/dicas")
    assert primeira.status_code == 200 and primeira.json()["restantes"] == 0
    assert aluno.post("/api/exercicios/fundamentos-f1/dicas").status_code == 409
    assert aluno.get("/api/exercicios/fundamentos-f1").json()["dicas"] == [primeira.json()["texto"]]


def _resolver(cliente, exercicio_id, dados=None):
    """Envia a resposta certa (lida do gabarito no banco de teste)."""
    from app.conteudo.leitor import ler_modulos
    ex = next(e for m in ler_modulos() for e in m["exercicios"] if e["id"] == exercicio_id)
    if ex["tipo"] == "multipla_escolha":
        dados = dados or cliente.get(f"/api/exercicios/{exercicio_id}").json()
        certa = next(i for i, a in enumerate(ex["alternativas"]) if a.get("correta"))
        resposta = str(dados["alternativas"][certa]["id"])
    else:
        resposta = ex["solucao"]
    r = cliente.post(f"/api/exercicios/{exercicio_id}/envios", json={"resposta": resposta})
    assert r.status_code == 200, r.text
    assert r.json()["correto"], r.json()
    return r.json()


def test_erro_registra_tentativa_e_explica_no_segundo_erro(aluno):
    dados = aluno.get("/api/exercicios/fundamentos-f1").json()
    errada = str(dados["alternativas"][1]["id"])
    r = aluno.post("/api/exercicios/fundamentos-f1/envios", json={"resposta": errada}).json()
    assert r["correto"] is False and r["explicacao"]  # múltipla escolha explica a alternativa na hora
    _resolver(aluno, "fundamentos-f1")
    aluno.get("/api/exercicios/fundamentos-f2")
    r1 = aluno.post("/api/exercicios/fundamentos-f2/envios", json={"resposta": ","}).json()
    assert r1["correto"] is False and r1["explicacao"] == "" and r1["explicacao_em"] == 1
    r2 = aluno.post("/api/exercicios/fundamentos-f2/envios", json={"resposta": "-"}).json()
    assert r2["explicacao"]
    assert any(not c["visivel"] for c in r2["casos"])
    assert all(c["entrada"] == "" for c in r2["casos"] if not c["visivel"])


OBRIGATORIOS_MODULO_1 = ["fundamentos-f1", "fundamentos-f2", "fundamentos-f3", "fundamentos-f4", "fundamentos-i1",
                         "fundamentos-i2", "fundamentos-i3", "fundamentos-a2"]


def test_concluir_modulo_1_choca_o_ovo_e_libera_o_modulo_2(aluno):
    obrigatorios = OBRIGATORIOS_MODULO_1
    for exercicio_id in obrigatorios[:-1]:
        r = _resolver(aluno, exercicio_id)
        assert r["modulo_concluido"] is False
    final = _resolver(aluno, "fundamentos-a2")
    assert final["modulo_concluido"] is True
    assert 0 < final["ovo"]["de"] < 6 and final["ovo"]["para"] == 6  # rachou durante a sala e chocou no fim
    assert final["criatura"]["situacao"] == "nasceu" and final["criatura"]["forma"] == 1
    trilha = aluno.get("/api/trilha").json()
    assert trilha["modulos"][0]["estado"] == "concluido"
    assert trilha["modulos"][1]["estado"] == "liberado"
    # o próximo sugerido é o módulo 2, não o avançado opcional do módulo 1
    assert trilha["proximo_exercicio"] == "condicionais-f1"
    # o avançado opcional continua disponível
    assert next(e for e in trilha["modulos"][0]["exercicios"] if e["id"] == "fundamentos-a1")["estado"] == "liberado"
    # refazer um exercício concluído não conclui de novo
    assert _resolver(aluno, "fundamentos-f1")["primeira_conclusao"] is False


def test_professor_ve_so_as_proprias_turmas(cliente, aluno):
    assert aluno.get("/api/professor/turmas").status_code == 403
    aluno.post("/api/contas/sair")
    cliente.post("/api/contas/entrar", json={"email": "prof@escola.br", "senha": "senha-prof"})
    turmas = cliente.get("/api/professor/turmas").json()
    assert len(turmas) == 1
    assert {k: turmas[0][k] for k in ("nome", "codigo_convite", "alunos")} == {"nome": "Turma A", "codigo_convite": "ABC234", "alunos": 0}
    assert turmas[0]["ovo"]["estagio"] == 0
