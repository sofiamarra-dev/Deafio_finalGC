# PyQuest

Jogo educativo de Python com mundos, login, pontos, ranking e dica da IA. A pasta tem duas partes:

```
pyquest/
├── frontend/        o jogo (HTML, CSS e JavaScript; o Python dos desafios roda no navegador)
├── backend/         o servidor (FastAPI): a dica da IA e, de brinde, serve o jogo
├── .vscode/         extensões, atalhos de rodar, depurar e testar
└── .gitignore       deixa de fora .env, .venv, node_modules e dist
```

O jogo funciona sozinho, sem o servidor. O servidor só é necessário para o botão **Pedir dica à IA**, que existe porque a chave da IA não pode ficar no navegador: qualquer aluno a veria no DevTools. Quem guarda a chave é o servidor.

## Abrir no VS Code

Abra a pasta `pyquest` (a raiz) e instale as extensões recomendadas quando o VS Code oferecer.

**Só o jogo, sem IA.** Clique com o botão direito em `frontend/index.html` e escolha **Open with Live Server**. O atalho já aponta para a pasta `frontend`.

**Jogo com a dica da IA.**

1. Crie o ambiente e instale o servidor: `Terminal > Executar tarefa > Instalar o servidor (cria .venv)`. Ou, no terminal: `python -m venv .venv`, ative-o e rode `pip install -r backend/requirements.txt`.
2. Copie `backend/.env.example` para `backend/.env` e preencha `ANTHROPIC_API_KEY` com a chave da API. Para testar sem gastar nada, use `IA_FALSA=1`: o servidor responde dicas prontas, sem chamar a IA.
3. Aperte **F5** e escolha **Servidor (jogo + API)**, ou rode `cd backend && uvicorn app.main:app --reload --port 8000`.
4. Abra http://127.0.0.1:8000. O servidor entrega o jogo e a API no mesmo endereço.

Se preferir usar o Live Server para o jogo e o servidor só para a API, abra `http://127.0.0.1:5500/index.html?api=http://127.0.0.1:8000` ou, de forma fixa, ponha `API_URL: 'http://127.0.0.1:8000'` em `frontend/js/config.js`.

## Como a dica da IA funciona

1. O aluno erra o desafio pelo menos uma vez. Só então o botão **Pedir dica à IA** fica ativo.
2. O jogo envia ao servidor o objetivo, o código com a lacuna e as tentativas (o bloco escolhido e o que o teste esperava e obteve). **Ele não envia a solução**, e o servidor nem a conhece.
3. O servidor monta o pedido para a IA com instruções fixas: dar uma pista curta, em português, **sem escrever o bloco certo nem o código final**. O que vem do aluno entra em tags de dados, para a IA não obedecer instruções escondidas no código. Se mesmo assim a resposta trouxer um bloco de código, o servidor o remove.
4. Há limite por aluno (padrão: 4 pedidos por minuto e 60 por dia, em `.env`), `max_tokens` baixo e tempo máximo de 15 s, para controlar o custo.
5. Se o servidor estiver fora do ar, sem chave ou sem resposta, o aluno vê uma mensagem simples e a **dica fixa** do desafio (campo `dica`) abre sozinha.

Segurança: a chave fica só em `backend/.env` (que o `.gitignore` já deixa de fora do git). Os dados enviados são validados e têm tamanho máximo.

## Testes

- **Desafios e salas (frontend):** `node frontend/tools/testar-desafios.js`, ou a tarefa "Testar os desafios".
- **Servidor (backend):** `cd backend && python -m pytest -q`, ou a tarefa "Testar o servidor". Os testes não gastam a IA: ela é simulada.

## Mais detalhes

- O jogo (mundos, desafios, pontos, ranking, sprites): `frontend/README.md`.
- Ranking entre computadores: hoje o ranking e o login ficam no navegador (`frontend/js/armazenamento.js`). Como já existe um servidor, o próximo passo natural é guardar jogadores e pontuações nele, em um banco (SQLite resolve para uma turma).
