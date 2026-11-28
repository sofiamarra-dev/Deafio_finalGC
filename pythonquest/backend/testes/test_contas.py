def test_cadastro_entra_automaticamente_e_eu_responde(aluno):
    eu = aluno.get("/api/contas/eu").json()
    assert eu["nome"] == "Bia" and eu["papel"] == "aluno"
    assert "senha" not in str(eu).lower()


def test_cadastro_com_codigo_de_turma_matricula(cliente):
    r = cliente.post("/api/contas/cadastro", json={"nome": "Caio", "email": "caio@x.com", "senha": "12345678",
                                                   "codigo_turma": "abc234"})
    assert r.status_code == 201
    assert r.json()["turmas"] == ["Turma A"]


def test_codigo_de_turma_inexistente(cliente):
    r = cliente.post("/api/contas/cadastro", json={"nome": "Caio", "email": "caio@x.com", "senha": "12345678",
                                                   "codigo_turma": "NAOEXISTE"})
    assert r.status_code == 404


def test_email_repetido(aluno):
    r = aluno.post("/api/contas/cadastro", json={"nome": "Outra", "email": "BIA@x.com", "senha": "12345678"})
    assert r.status_code == 409


def test_senha_curta_recusada(cliente):
    r = cliente.post("/api/contas/cadastro", json={"nome": "Bia", "email": "b@x.com", "senha": "123"})
    assert r.status_code == 422


def test_login_logout(aluno):
    aluno.post("/api/contas/sair")
    assert aluno.get("/api/contas/eu").status_code == 401
    assert aluno.post("/api/contas/entrar", json={"email": "bia@x.com", "senha": "errada!!"}).status_code == 401
    assert aluno.post("/api/contas/entrar", json={"email": "bia@x.com", "senha": "12345678"}).status_code == 200
    assert aluno.get("/api/contas/eu").status_code == 200


def test_muitas_tentativas_de_login_bloqueiam(cliente):
    for _ in range(8):
        cliente.post("/api/contas/entrar", json={"email": "x@x.com", "senha": "errada!!"})
    assert cliente.post("/api/contas/entrar", json={"email": "x@x.com", "senha": "errada!!"}).status_code == 429


def test_cookie_de_sessao_e_httponly(cliente):
    r = cliente.post("/api/contas/cadastro", json={"nome": "Bia", "email": "bia@x.com", "senha": "12345678"})
    cabecalho = r.headers["set-cookie"].lower()
    assert "httponly" in cabecalho and "samesite=lax" in cabecalho
