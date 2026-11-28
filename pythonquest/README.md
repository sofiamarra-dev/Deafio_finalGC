# PythonQuest

Plataforma gamificada para aprender Python: uma trilha de 6 módulos com exercícios em três níveis,
XP, ranking, sequência de estudos, conquistas, um ovo que evolui com o progresso e um painel para professores.

É uma versão nova e separada do CodeQuest (pasta `../codequest/`), que continua como está.
A proposta completa de arquitetura (páginas, banco, correção segura, regras de progressão, métricas e etapas)
foi aprovada antes do início do desenvolvimento.

## Estado atual

Já funciona:

- **Contas**: cadastro de aluno (com código de turma opcional) e de professor (com o código de professor),
  login, logout, sessão em cookie seguro, senha com hash (scrypt), limite de tentativas.
  O professor cria turmas no site e recebe o código de convite de cada uma.
- **Trilha 2D**: 6 módulos em sequência, nós clicáveis em zigue-zague com animações, desbloqueio pelas regras
  da proposta (conferidas no servidor), botão "Guia" com o resumo de cada módulo e o ovo que evolui a cada módulo concluído.
- **Exercícios** dos módulos 1 (Fundamentos) e 2 (Condicionais), 8 em cada: múltipla escolha, completar código,
  encontrar o erro e escrever programa. Dicas uma por vez, "Executar" no navegador com os exemplos e
  "Verificar" com correção oficial no servidor, feedback de acerto ou erro e explicação a partir do 2º erro.
- **Correção segura**: o código roda num contêiner Docker descartável (sem internet, sem gravar no disco,
  com limite de memória, processos e tempo) contra casos visíveis e escondidos. A comparação acontece no servidor.
- **Registro de tudo**: cada envio, resultado por teste, dica aberta, tempo até acertar e conclusão de módulo
  ficam no banco. Isso é a base das métricas das próximas etapas.

- **Jogo**: XP (só na primeira vez que acerta, com bônus de primeira e desconto por erro e dica), níveis,
  sequência de dias, conquistas, o ovo que anda pela trilha de sala em sala e a criatura que nasce do jeito de estudar.
- **Ranking e perfil**: ranking geral, da semana e da turma; perfil público com apelido e cor do ovo; ovo da turma.
- **Minha evolução** para o aluno e **painel da turma** para o professor (erros mais comuns, assuntos difíceis).
- **Lojinha**: o aluno ganha bytes (metade do XP + 15 por conquista) e compra ninhos, cascas e escudos de
  sequência. A loja não vende XP, dica nem resposta, então o ranking continua medindo estudo.

Os módulos 3 a 6 aparecem na trilha como "Conteúdo em produção" até ganharem exercícios.

Depois de dar `git pull`, rode `python -m alembic upgrade head` dentro de `backend/`: algumas atualizações
criam colunas ou tabelas novas no banco. Se esquecer, a página de saúde (`/api/saude`) avisa.

## Como rodar no seu computador

Precisa de Python 3.12 ou mais novo e do **Docker Desktop aberto** (é ele que roda o código dos alunos com segurança).

**Windows (PowerShell, o terminal padrão do VS Code):**

```powershell
cd pythonquest\backend
python -m venv .venv                     # só na primeira vez
.venv\Scripts\Activate.ps1               # toda vez que abrir um terminal novo
pip install -r requirements.txt
copy .env.exemplo .env                   # só na primeira vez; depois edite o CODIGO_PROFESSOR
python -m alembic upgrade head           # cria/atualiza as tabelas
python -m app.conteudo.importar          # carrega os módulos e exercícios
docker pull python:3.12-alpine           # imagem usada pelo corretor (só na primeira vez)
python -m uvicorn app.main:app --reload
```

Se o PowerShell disser que a execução de scripts está desabilitada, rode uma vez
`Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` e responda `S`.

**macOS / Linux:**

```bash
cd pythonquest/backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.exemplo .env
python -m alembic upgrade head
python -m app.conteudo.importar
docker pull python:3.12-alpine
python -m uvicorn app.main:app --reload
```

Abra http://127.0.0.1:8000, clique em "Começar agora" e crie uma conta de aluno. Não existe conta pronta:
o banco começa vazio.

Se o servidor disser no terminal que faltam tabelas ou exercícios, ele mostra o comando que falta rodar.

**Professores** criam a conta pelo próprio site: em "Criar conta", escolhem "Sou professor" e digitam o
**código de professor**, definido em `CODIGO_PROFESSOR` no `.env`. Passe esse código só para os professores.
Depois de entrar, o professor cria as turmas no site e recebe o código de convite de cada uma para passar aos alunos.
Se `CODIGO_PROFESSOR` estiver vazio, o cadastro de professores pelo site fica desligado. Ainda dá para criar pelo terminal:
`python -m app.criar_professor --nome "Seu Nome" --email voce@escola.br --turma "Turma A"`.

Sem Docker, dá para testar com `CORRETOR=local` no `.env`. Ele roda o código direto no seu computador,
então use só para desenvolver, nunca com alunos de verdade.

Testes: `pytest` dentro de `pythonquest/backend`. Para editar exercícios, veja `backend/conteudo/LEIA-ME.md`.

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
│   │   ├── estado.js         quem está logado (cópia do que o servidor diz)
│   │   ├── python-local.js   botão "Executar": Python no navegador, só com os exemplos
│   │   ├── paginas/          inicio, conta (entrar/cadastro), trilha, exercicio, professor
│   │   ├── componentes/      layout, ovo, ícones, modal, confete, indicador do servidor
│   │   └── exercicios/       um arquivo por tipo de resposta: múltipla escolha, completar, editor
│   ├── lib/skulpt/           Python no navegador (mesma cópia do CodeQuest)
│   └── img/marca/            logo do Geração Caldeira
└── backend/
    ├── app/
    │   ├── main.py           cria o app, rotas da API em /api e o frontend no resto
    │   ├── config.py         lê o .env
    │   ├── db.py             conexão com o banco
    │   ├── modelos/          tabelas: pessoas, conteúdo, progresso
    │   ├── rotas/            contas, trilha, exercícios, professor
    │   ├── servicos/         senhas, autenticação, regras de progressão
    │   ├── correcao/         corretor (compara), sandbox (Docker), executor (roda dentro do sandbox), erros
    │   ├── conteudo/         lê, valida e importa os YAML
    │   └── criar_professor.py
    ├── conteudo/             os módulos e exercícios em YAML (um arquivo por módulo)
    ├── migracoes/            Alembic
    ├── testes/               pytest
    ├── requirements.txt
    └── .env.exemplo          modelo do .env (o .env de verdade nunca vai para o Git)
```

## Regras do projeto

- O servidor decide tudo o que vale: nota, XP, permissões. O navegador só mostra.
- Nenhuma tela mostra número inventado: se não há dado, a tela diz que ainda não há.
- Nenhum botão sem função: cada página só ganha botões quando a funcionalidade existe.
