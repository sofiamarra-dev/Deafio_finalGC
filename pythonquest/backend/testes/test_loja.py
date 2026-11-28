from testes.test_trilha_e_permissoes import _resolver


def test_loja_comeca_com_saldo_zero_e_itens_travados(aluno):
    loja = aluno.get("/api/loja").json()
    assert loja["saldo"] == 0
    assert all(not i["pode_comprar"] for i in loja["itens"])
    assert aluno.post("/api/loja/comprar", json={"item_id": "ninho-palha"}).status_code == 409


def test_bytes_vem_do_xp_e_das_conquistas_e_compras_descontam(aluno):
    _resolver(aluno, "fundamentos-f1")  # 15 XP -> 7 bytes; conquista "Primeiro passo" -> +15
    loja = aluno.get("/api/loja").json()
    assert loja["ganhos"] == {"do_xp": 7, "das_conquistas": 15, "total": 22} and loja["saldo"] == 22
    depois = aluno.post("/api/loja/comprar", json={"item_id": "ninho-palha"}).json()
    assert depois["saldo"] == 2 and depois["equipado"]["ninho"] == "ninho-palha"
    assert aluno.post("/api/loja/comprar", json={"item_id": "ninho-palha"}).json()["detail"] == "Você já tem."
    # refazer o exercício não dá mais bytes
    _resolver(aluno, "fundamentos-f1")
    assert aluno.get("/api/loja").json()["saldo"] == 2


def test_nao_equipa_o_que_nao_tem_e_evolucao_exige_criatura(aluno):
    assert aluno.post("/api/loja/equipar", json={"categoria": "casca", "item_id": "casca-dourada"}).status_code == 409
    itens = {i["id"]: i for i in aluno.get("/api/loja").json()["itens"]}
    assert itens["evolucao-2"]["motivo"] == "Sua criatura ainda não nasceu."
    assert aluno.post("/api/loja/comprar", json={"item_id": "dica-gratis"}).status_code == 409


def test_ovo_choca_na_sala_1_e_a_loja_evolui_a_criatura(aluno):
    from testes.test_trilha_e_permissoes import OBRIGATORIOS_MODULO_1
    for exercicio in OBRIGATORIOS_MODULO_1:
        _resolver(aluno, exercicio)
    trilha = aluno.get("/api/trilha").json()
    assert trilha["ovo"]["estagio"] == 6 and trilha["criatura"]["situacao"] == "nasceu"
    nomes = trilha["criatura"]["formas"]
    assert trilha["criatura"]["nome"] == nomes[0]
    itens = {i["id"]: i for i in aluno.get("/api/loja").json()["itens"]}
    # nasceu, mas a evolução ainda pede nível e bytes (conferidos no servidor)
    assert itens["evolucao-2"]["motivo"] != "Sua criatura ainda não nasceu."
    assert itens["evolucao-3"]["motivo"] in ("Precisa da forma 2 antes.",) or itens["evolucao-3"]["motivo"].startswith("Libera")
