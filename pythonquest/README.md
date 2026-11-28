# PythonQuest

Plataforma gamificada para aprender Python: uma trilha de 6 módulos com exercícios em três níveis,
XP, ranking, sequência de estudos, conquistas, um ovo que evolui com o progresso e um painel para professores.

É uma versão nova e separada do CodeQuest (pasta `../codequest/`), que continua como está.
A proposta completa de arquitetura (páginas, banco, correção segura, regras de progressão, métricas e etapas)
foi aprovada antes do início do desenvolvimento.

## Estado atual: etapa 1 de 8 (base do projeto)

Já funciona:

- servidor FastAPI que entrega o frontend e a API no mesmo endereço;
- banco configurado (SQLite no desenvolvimento) com migrações pelo Alembic;
- `GET /api/saude`, que confere servidor e banco, e documentação da API em `/api/docs`;
- página inicial com o visual 2D, as cores e a logo do Geração Caldeira, e o indicador real de conexão com o servidor.

Próximas etapas: contas e turmas, conteúdo e corretor, trilha e exercícios, gamificação, ranking e perfil,
Minha evolução e painel do professor, resto do conteúdo e acabamento.

## Como rodar no seu computador

Precisa de Python 3.12 ou mais novo. O Docker só vai ser necessário a partir da etapa 3 (corretor).

```bash
cd pythonquest/backend
python -m venv .venv
# Windows: .venv\Scripts\activate    macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
cp .env.exemplo .env          # no Windows: copy .env.exemplo .env
alembic upgrade head
uvicorn app.main:app --reload
```

Abra http://127.0.0.1:8000. O canto superior direito deve mostrar "Servidor conectado".

Para rodar os testes: `pytest` (dentro de `pythonquest/backend`).

## Organização das pastas

```
pythonquest/
├── frontend/                 servido pelo backend; HTML, CSS e JavaScript puro, sem build
│   ├── index.html            casca: topo com a logo, área da página, rodapé
│   ├── css/                  tokens.css (cores e fontes), base.css (casca), um arquivo por página
│   ├── js/
│   │   ├── app.js            registra as rotas e liga tudo
│   │   ├── roteador.js       rotas por #hash
│   │   ├── api.js            único lugar que fala com o servidor
│   │   ├── paginas/          uma página por arquivo
│   │   └── componentes/      peças reutilizáveis (ovo, indicador do servidor...)
│   └── img/marca/            logo do Geração Caldeira
└── backend/
    ├── app/
    │   ├── main.py           cria o app, rotas da API em /api e o frontend no resto
    │   ├── config.py         lê o .env
    │   ├── db.py             conexão com o banco
    │   ├── modelos/          tabelas (chegam na etapa 2)
    │   └── rotas/            rotas da API
    ├── migracoes/            Alembic
    ├── testes/               pytest
    ├── requirements.txt
    └── .env.exemplo          modelo do .env (o .env de verdade nunca vai para o Git)
```

## Regras do projeto

- O servidor decide tudo o que vale: nota, XP, permissões. O navegador só mostra.
- Nenhuma tela mostra número inventado: se não há dado, a tela diz que ainda não há.
- Nenhum botão sem função: cada página só ganha botões quando a funcionalidade existe.
