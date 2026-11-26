# PyQuest

Jogo educativo de Python com **mundos**. Cada mundo tem um personagem, um tema e **um único assunto**:

| Mundo | Personagem | Assunto | Falha do tempo |
| --- | --- | --- | --- |
| O Restaurante | rato cozinheiro | condicionais (`if`, `elif`, `else`, comparações, `and`, `or`, `not`, `in`) | a sala explode |
| A Prisão | preso de macacão laranja | repetição (`for`, `range`, `while`, listas, `break`, laços dentro de laços) | o alarme dispara |

Cada mundo tem 3 áreas com 4 desafios (12 por mundo). Para abrir cada porta, o aluno encaixa blocos de código. O jogo roda o Python de verdade e confere a saída com testes. O jogo tem três páginas: **entrar** (login), **mundos** (escolha do mundo) e **jogo**. Quem abre o link cai no login, depois escolhe o mundo e só então joga. O segundo mundo só abre depois de concluir o primeiro (o progresso fica salvo no navegador).

O nome do site fica em `NOME_DO_SITE`, em `js/config.js`. Cada mundo tem o seu próprio nome ("O Restaurante", "A Prisão"), definido no `mundo.js` dele.

## Como abrir no VS Code

1. Abra a pasta `pyquest`, que é a raiz do projeto, com `frontend/` e `backend/` (veja o README da raiz).
2. Instale as extensões recomendadas quando o VS Code oferecer (principalmente **Live Server**).
3. Clique com o botão direito em `frontend/index.html` > **Open with Live Server**.

Também funciona dando duplo clique em `index.html`. Não precisa instalar nada além do navegador. O Python roda no navegador por meio do Skulpt, que já está na pasta `lib/`.

## Organização das pastas

```
pyquest/
├── index.html              a página (só a estrutura; o resto vem dos arquivos abaixo)
├── css/estilo.css          cores, fontes e layout (variáveis no topo)
├── js/
│   ├── config.js           tempo, velocidade, atalhos de teste e listas compartilhadas
│   ├── mundos.js           registro de mundos (FC.registrarMundo, FC.salasDoMundo)
│   ├── armazenamento.js    único lugar que guarda dados (hoje localStorage; ponto de troca para um servidor)
│   ├── avatares.js         os 12 avatares de 12×12 (hacker, doutora, ninja...) (escolhidos no login, aparecem no ranking)
│   ├── jogador.js          "login": quem está jogando (nome e turma, sem senha)
│   ├── pontos.js           regras de pontuação
│   ├── ranking.js          ranking por mundo e a janela do ranking
│   ├── progresso.js        quais mundos cada jogador já concluiu
│   ├── ia.js               pede a dica da IA ao servidor (backend/) e esconde o botão se não houver servidor
│   ├── paginas.js          as três páginas (#entrar, #mundos, #jogo), botão voltar e regras de acesso
│   ├── mapa.js             página de mundos: cartões com bloqueio, e a vitrine da página de entrada
│   ├── jogo.js             o jogo: movimento, relógio, troca de salas, falha, fim de mundo
│   ├── principal.js        liga tudo (último a carregar)
│   ├── python.js           roda o Python (Skulpt) e confere os testes
│   ├── painel.js           janela do desafio (história, blocos, resultado)
│   ├── blocos.js           blocos de encaixar (arrastar e tocar)
│   ├── interface.js        relógio, avisos, lista de painéis e registro de tentativas
│   ├── desenho/            tudo que é desenhado e serve a todos os mundos
│   │   ├── util.js, rato.js, balao.js, bancada.js, luz.js
│   │   ├── porta.js        portas de madeira, vidro e metal (grade)
│   │   └── efeitos.js      confete, explosão e alarme
│   └── mundos/
│       ├── restaurante/    mundo.js, desafios/ (cozinha, despensa, salao), salas/ (idem)
│       └── prisao/         mundo.js, personagem.js (preso), desafios/ (cela, patio, tunel), salas/ (idem)
├── referencia/             imagens do rato e do preso com grade (para desenhar outros)
├── lib/skulpt/             interpretador de Python (MIT), para funcionar sem internet
├── tools/
│   ├── testar-desafios.js  confere todos os desafios, salas e a regra de um assunto por mundo
│   └── empacotar.js        junta tudo em um único .html
(o .vscode, o .gitignore e o servidor ficam na pasta de cima)
```

A ordem de carregamento dos scripts fica no fim do `index.html`. Se criar um arquivo novo, registre ali.

## O que cada desafio ensina

| Mundo / área | Desafios |
| --- | --- |
| Restaurante, Cozinha | `<`, `elif`, `==`, `>` |
| Restaurante, Despensa | `or`, `not`, `>=`, `and` com faixa |
| Restaurante, Salão | `!=`, `in`, `%` com `==`, `<=` |
| Prisão, Cela | `for` com `range`, `while`, `for` em lista, somar no laço |
| Prisão, Pátio | `range` com passo, `while` com contador, `break`, `"#" * n` em laço |
| Prisão, Túnel | `range(1, n + 1)`, `while` com limite, contar com `if` no laço, laço dentro de laço |

## Login, pontos e ranking

**Páginas.** Cada uma tem seu endereço (`index.html#entrar`, `#mundos`, `#jogo`) e o botão voltar do navegador funciona. Só abre `#mundos` quem já se identificou, e só abre `#jogo` quem escolheu um mundo; senão o jogo leva para a página certa. Com a página do jogo escondida, o relógio da sala para.

**Login.** A primeira página pergunta "Quem vai jogar?". O aluno digita o nome (e a turma, se quiser) ou escolhe um jogador já salvo, o que ajuda quando vários alunos dividem o mesmo computador. Também dá para jogar sem ranking. **Não tem senha**: o nome só identifica o aluno neste navegador. Cada jogador tem o seu próprio progresso entre mundos. O botão com o nome, no topo do jogo, e o "Trocar de jogador", na página de mundos, voltam ao login. Trocar de jogador encerra a partida em andamento.

**Pontos** (valores em `FC.CONFIG.PONTOS`, `js/config.js`):

| Evento | Pontos |
| --- | --- |
| Desafio resolvido | 100, menos 20 por erro antes do acerto (mínimo 40) |
| Sair da sala | até 60 de bônus, proporcional ao tempo que sobrou |
| Terminar o mundo | 200 |

Os erros e os acertos do treino não contam pontos. Se a sala explodir (ou o alarme disparar), os pontos daquela sala voltam a zero, e quem refaz a sala ganha de novo. O tempo com o mapa, o ranking ou o login abertos não corre no relógio.

**Ranking.** Cada mundo tem o seu. Vale a melhor pontuação de cada jogador (desempate pelo menor tempo). A janela do ranking mostra os 10 primeiros, a posição do jogador atual e um filtro "só a turma".

**Ranking entre computadores.** Hoje tudo fica no navegador (`localStorage`), então o ranking é por computador. Para um ranking compartilhado pela escola, é preciso um servidor: troque `ler` e `gravar` em `js/armazenamento.js` por chamadas à sua API. O login sem senha serve para uma sala de aula, mas não impede que alguém jogue com o nome de outra pessoa. Se o ranking valer nota, será preciso autenticação de verdade no servidor.

## O jogo se adapta ao aluno

**Bancada de treino.** Quando o aluno erra o **mesmo desafio 3 vezes seguidas**, aparece uma bancada de treino na sala (com plaquinha "TREINO" e balão azul). Ela tem uma versão mais fácil daquele desafio. O treino é opcional, não conta para abrir a porta e os erros dele não entram na regra. Acertar uma vez zera a contagem de erros seguidos. Se o aluno travar em outro desafio, a bancada passa a oferecer o treino desse.

- Quantos erros disparam o treino: `ERROS_PARA_TREINO` em `js/config.js`.
- Cada desafio tem o campo `treino` (mesmo formato do desafio). Sem ele, a bancada não aparece para aquele desafio, e o teste automático avisa.
- O jogo guarda cada tentativa em `FC.jogo.estado.historico` (sala, desafio, acertou ou não, horário). No fim, mostra qual desafio deu mais erros.

**Apagão.** Uma sala pode começar no escuro com `apagao: { escuridao: 0.62, luzes: [...] }` (veja `js/mundos/restaurante/salas/despensa.js`). Cada painel resolvido deixa a sala mais clara e acende uma luz perto dele. O rato, a porta de saída e as luzes fixas (como o lampião) sempre têm luz. Para a cozinha ou o salão ficarem no escuro, copie essa linha para o arquivo da sala.

## Mudar o tempo e testar uma área

O tempo de cada sala fica em `js/config.js` (`TEMPO_SEGUNDOS`, hoje 360 = 6 minutos por sala). Para testar sem editar nada, use a URL:

- `index.html?mundo=prisao&sala=2&tempo=120` abre o pátio da prisão com 2 minutos.
- `index.html?sala=2` abre a despensa (sem `mundo`, vale o restaurante).
- `index.html?livre` libera todos os mundos no mapa.
- Com `mundo=` ou `sala=` na URL o jogo pula o login e o mapa (para testes).
- Também aceita no formato `index.html#mundo-prisao-sala-3-tempo-90`.

## Criar um desafio novo

1. Em `js/mundos/<mundo>/desafios/`, copie um desafio existente e mude o nome (`FC.DESAFIOS.meu_desafio = { ... }`). O id precisa ser único no jogo todo.
2. Coloque `conceito:` igual ao do mundo (`'condicional'` ou `'repeticao'`). O teste recusa desafio de outro assunto.
3. O `codigo` precisa ter **um único `___`**, onde o bloco encaixa.
4. `variavel` é a variável que o jogo troca de valor em cada teste. Ela precisa aparecer no código.
5. `blocos` são as peças da bandeja e `solucao` é a certa. Inclua blocos que pareçam certos mas falhem em algum teste.
6. Escreva também o `treino`: `FC.DESAFIOS.meu_desafio.treino = { ... }`, com a mesma estrutura e uma versão mais simples.
7. Rode `npm run testar` (ou `node tools/testar-desafios.js`). O teste exige que só a solução passe.

## Criar uma sala nova

1. Em `js/mundos/<mundo>/salas/`, copie uma sala e mude `id`, `nome`, o cenário (`pintar`), os `obstaculos`, as `estacoes` e a `bancada` (retângulo livre, longe dos móveis e do ponto de partida). O campo `mundo` diz a que mundo ela pertence.
2. Cada estação tem o mesmo `id` de um desafio. A última é sempre a porta: `FC.estacaoSaida('saida_minha_sala', xDaPorta)`. O campo `falha` traz o texto de quando o tempo acaba.
3. Adicione o desafio da saída em `desafios/` e os `<script>` em `index.html`, antes de `jogo.js`. A ordem dos scripts de sala é a ordem do jogo dentro do mundo.
4. Rode `npm run testar`.

## Criar um mundo novo

1. Crie `js/mundos/<id>/` com `mundo.js`, `desafios/` e `salas/`.
2. Em `mundo.js`, chame `FC.registrarMundo({ id, nome, personagem, conceito, assunto, descricao, cor, falha, aviso, falhaIntro, vitoriaTitulo, vitoriaIntro })`. `falha` é `'explosao'` ou `'alarme'`.
3. Desenhe o personagem em `FC.PERSONAGENS.<nome> = function (ctx, jogador, frame, andando, olhando) { ... }` (veja `js/mundos/prisao/personagem.js`).
4. Registre os scripts no `index.html`. A ordem dos mundos no `index.html` é a ordem do mapa, e cada mundo abre quando o anterior for concluído.

## Desenhar um personagem novo

Os personagens são desenhados no código com retângulos (pixel art, sem suavização). As imagens em `referencia/` mostram o rato e o preso em tamanho real (`-1x.png`) e ampliados 12 vezes com grade (`-grade.png`): a moldura azul é a caixa do corpo e a laranja é a área dos pés (a hitbox).

| O quê | Tamanho |
| --- | --- |
| Cenário | 480 × 320 px, ladrilhos de 32 × 32 (15 × 10) |
| Caixa do corpo | **24 × 31 px**, com os pés na base |
| Chapéu ou boné | pode passar da caixa por cima (o chapéu do rato sobe 8 px; o preso cabe em ~30 px de altura) |
| Hitbox (pés) | 14 × 10 px, centrada na horizontal. É o que bate nos móveis |
| Sombra | elipse de ~18 × 5 px na base |
| Referência | o personagem tem ~¾ de ladrilho de largura e ~1 ladrilho de altura, e a porta tem 32 × 32 px |

Dicas:

- Desenhe **voltado para a direita**: o jogo espelha sozinho quando o personagem anda para a esquerda.
- Proporção que funciona bem: cabeça grande (cerca de ⅓ da altura), corpo curto, uns 10 a 14 cores.
- Animação: andar alterna 2 poses a cada 6 quadros; parado "respira" 1 px a cada 40 quadros e pisca. Veja `js/mundos/prisao/personagem.js`.
- Para registrar: `FC.PERSONAGENS.meu_personagem = function (ctx, jogador, frame, andando, olhando) { ... }` e, no `mundo.js`, `personagem: 'meu_personagem'`. O cartão do mundo mostra o personagem automaticamente.

## Gerar um arquivo único

```
node tools/empacotar.js
```

Cria `dist/pyquest.html`, com CSS e JS dentro. Para esse arquivo o Skulpt vem do CDN, então precisa de internet.

## Testes

`node tools/testar-desafios.js` roda os 24 desafios e os 24 treinos contra cada bloco da bandeja (só a solução pode passar) e verifica se as salas estão consistentes (bancada, ponto de partida, mundo existente) e se cada desafio é do assunto do mundo dele. Precisa só do Node.
