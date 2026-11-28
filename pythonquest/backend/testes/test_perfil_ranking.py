from testes.test_trilha_e_permissoes import _resolver


def _cadastrar(cliente, nome, email, turma=None):
    dados = {"nome": nome, "email": email, "senha": "12345678"}
    if turma:
        dados["codigo_turma"] = turma
    assert cliente.post("/api/contas/cadastro", json=dados).status_code == 201


def test_perfil_editavel_e_sem_email_no_publico(aluno):
    p = aluno.get("/api/perfil").json()
    assert p["nome_exibido"] == "Bia" and p["cor"] == "verde" and p["jogador"]["xp"] == 0
    assert aluno.patch("/api/perfil", json={"apelido": "Bia Coder", "cor": "roxo"}).json()["nome_exibido"] == "Bia Coder"
    assert aluno.patch("/api/perfil", json={"cor": "dourado-falso"}).status_code == 422
    publico = aluno.get(f"/api/perfil/{p['id']}").json()
    assert "email" not in publico and publico["cor"] == "roxo"


def test_conquista_primeiro_passo(aluno):
    assert not aluno.get("/api/perfil").json()["conquistas"][0]["ganhou"]
    _resolver(aluno, "fundamentos-f1")
    assert aluno.get("/api/perfil").json()["conquistas"][0]["ganhou"]


def test_ranking_geral_semana_e_turma(cliente, fabrica):
    from fastapi.testclient import TestClient
    from app.main import app
    ana, caio = TestClient(app), TestClient(app)
    _cadastrar(ana, "Ana Souza", "ana@x.com", turma="ABC234")
    _cadastrar(caio, "Caio Lima", "caio@x.com")
    _resolver(ana, "fundamentos-f1")
    geral = ana.get("/api/ranking").json()
    assert [l["nome"] for l in geral["linhas"]] == ["Ana S."]  # Caio ainda tem 0 XP
    assert [l["nome"] for l in caio.get("/api/ranking").json()["linhas"]] == ["Ana S.", "Caio L."]
    assert geral["eu"]["posicao"] == 1 and geral["linhas"][0]["xp"] == 15
    semana = caio.get("/api/ranking?escopo=semana").json()
    assert [l["nome"] for l in semana["linhas"]] == ["Ana S.", "Caio L."]  # Caio aparece porque é ele quem vê
    assert caio.get("/api/ranking?escopo=turma").json()["sem_turma"] is True
    turma = ana.get("/api/ranking?escopo=turma").json()
    assert [l["nome"] for l in turma["linhas"]] == ["Ana S."]
    assert ana.get("/api/ranking?escopo=outro").status_code == 422


def test_professor_nao_entra_no_ranking(cliente):
    cliente.post("/api/contas/entrar", json={"email": "prof@escola.br", "senha": "senha-prof"})
    assert cliente.get("/api/ranking").status_code == 403
