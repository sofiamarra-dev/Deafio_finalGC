from fastapi.testclient import TestClient

from app.main import app
from testes.test_trilha_e_permissoes import _resolver


def test_minha_evolucao_mostra_onde_melhorar(aluno):
    vazio = aluno.get("/api/evolucao").json()
    assert vazio["total_envios"] == 0 and vazio["melhorar"] == [] and len(vazio["atividade"]) == 14
    _resolver(aluno, "fundamentos-f1")
    aluno.get("/api/exercicios/fundamentos-f2")
    for errada in (",", "*", "-"):
        aluno.post("/api/exercicios/fundamentos-f2/envios", json={"resposta": errada})
    _resolver(aluno, "fundamentos-f2")
    ev = aluno.get("/api/evolucao").json()
    assert ev["total_envios"] == 5 and ev["acertos"] == 2 and ev["erros"] == 3
    assert [a["assunto"] for a in ev["melhorar"]][:1] in (["input"], ["str"])  # assuntos do f2: 1 acerto em 4
    assert ev["erros_comuns"][0] == {"tipo": "TypeError", "nome": "Tipos que não combinam (ex.: texto + número)", "vezes": 2}
    assert ev["exercicios_dificeis"][0]["id"] == "fundamentos-f2"
    assert ev["atividade"][-1]["envios"] == 5


def test_painel_da_turma_so_para_o_professor_dono(cliente):
    ana = TestClient(app)
    assert ana.post("/api/contas/cadastro", json={"nome": "Ana Souza", "email": "ana@x.com", "senha": "12345678",
                                                  "codigo_turma": "ABC234"}).status_code == 201
    _resolver(ana, "fundamentos-f1")
    assert ana.get("/api/professor/turmas/1/painel").status_code == 403
    cliente.post("/api/contas/entrar", json={"email": "prof@escola.br", "senha": "senha-prof"})
    turma_id = cliente.get("/api/professor/turmas").json()[0]["id"]
    painel = cliente.get(f"/api/professor/turmas/{turma_id}/painel").json()
    assert painel["turma"]["nome"] == "Turma A"
    assert painel["alunos"][0]["nome"] == "Ana Souza" and painel["alunos"][0]["exercicios"] == 1
    assert painel["ativos_7_dias"] == 1 and painel["taxa"] == 100
    assert cliente.get("/api/professor/turmas/999/painel").status_code == 404
