# PythonQuest

Plataforma gamificada para aprender Python: uma trilha de 6 módulos com exercícios em três níveis,
XP, ranking, sequência de estudos, conquistas, um ovo que evolui com o progresso e um painel para professores.

É uma versão nova e separada do CodeQuest (pasta `../codequest/`), que continua como está.
A proposta completa de arquitetura (páginas, banco, correção segura, regras de progressão, métricas e etapas)
foi aprovada antes do início do desenvolvimento.

## Estado atual: etapas 1 a 4 de 8

Já funciona:

- **Contas**: cadastro de aluno (com código de turma opcional), login, logout, sessão em cookie seguro,
  senha com hash (scrypt), limite de tentativas de login. Professores são criados por comando.
- **Trilha 2D**: 6 módulos em sequência, nós clicáveis em zigue-zague com animações, desbloqueio pelas regras
  da proposta (conferidas no servidor), botão "Guia" com o resumo de cada módulo e o ovo que evolui a cada módulo concluído.
- **Exercícios** dos módulos 1 (Fundamentos) e 2 (Condicionais), 8 em cada: múltipla escolha, completar código,
  encontrar o erro e escrever programa. Dicas uma por vez, "Executar" no navegador com os exemplos e
  "Verificar" com correção oficial no servidor, feedback de acerto ou erro e explicação a partir do 2º erro.
- **Correção segura**: o código roda num contêiner Docker descartável (sem internet, sem gravar no disco,
  com limite de memória, processos e tempo) contra casos visíveis e escondidos. A comparação acontece no servidor.
- **Registro de tudo**: cada envio, resultado por teste, dica aberta, tempo até acertar e conclusão de módulo
  ficam no banco. Isso é a base das métricas das próximas etapas.

Os módulos 3 a 6 aparecem na trilha como "Conteúdo em produção" até ganharem exercícios.

Próximas etapas: XP, níveis, sequência e conquistas; ranking e perfil; Minha evolução e painel do professor;
resto do conteúdo e acabamento.

## Como rodar no seu computador

Precisa de Python 3.12 ou mais novo e do **Docker Desktop aberto** (é ele que roda o código dos alunos com segurança).

```bash
cd pythonquest/backend
python -m venv .venv
# Windows: .venv\Scripts\activate    macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
cp .env.exemplo .env          # no Windows: copy .env.exemplo .env
alembic upgrade head          # cria as tabelas
python -m app.conteudo.importar   # carrega os módulos e exercícios
docker pull python:3.12-alpine    # imagem usada pelo corretor (só na primeira vez)
uvicorn app.main:app --reload
```

Abra http://127.0.0.1:8000, clique em "Começar agora" e crie uma conta de aluno.

Para criar um professor e uma turma (o código de convite aparece no terminal):

```bash
python -m app.criar_professor --nome "Seu Nome" --email voce@escola.br --turma "Turma A"
```

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
