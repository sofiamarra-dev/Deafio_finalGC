# Conteúdo do PythonQuest

Um arquivo YAML por módulo, em ordem (`01-...yaml`, `02-...yaml`). Depois de editar:

```bash
python -m app.conteudo.validar    # confere tudo (a solução passa, as respostas erradas falham)
python -m app.conteudo.importar   # valida e grava no banco
```

## Módulo

| Campo | O que é |
| --- | --- |
| `id` | identificador fixo (não mude depois de publicado) |
| `ordem` | posição na trilha |
| `titulo`, `descricao` | aparecem no cartão do módulo |
| `guia` | resumo do conteúdo, aberto pelo botão "Guia" |
| `exercicios` | lista de exercícios; vazia = módulo "em produção", aparece bloqueado |

## Exercício

| Campo | Obrigatório | O que é |
| --- | --- | --- |
| `id` | sim | identificador fixo, único no projeto todo |
| `dificuldade` | sim | `facil`, `intermediario` ou `avancado` (a ordem na lista é a ordem na trilha) |
| `tipo` | sim | `multipla_escolha`, `completar`, `achar_erro` ou `programa` |
| `titulo`, `enunciado` | sim | no enunciado, código vai entre linhas com ``` |
| `dicas` | sim | lista; o aluno abre uma por vez |
| `explicacao` | não | aparece quando o aluno erra pela 2ª vez (e quando acerta) |
| `assuntos` | não | etiquetas (`for`, `elif`...) usadas nas métricas |
| `desafio_final` | um por módulo | o exercício avançado obrigatório para concluir o módulo |
| `alternativas` | múltipla escolha | `texto`, `correta` (exatamente uma) e `explicacao` (todas) |
| `codigo_inicial` | não | o que já vem no editor; no tipo `completar`, tem uma lacuna `___` |
| `blocos` | não | sugestões para a lacuna (tipo `completar`) |
| `solucao` | código | resposta de referência (nunca é mostrada ao aluno) |
| `respostas_erradas` | não | respostas que precisam FALHAR; o validador confere |
| `modo_teste` | código | `stdin` (entrada digitada), `funcao` (chama a função) ou `variavel` (troca o valor de uma variável) |
| `funcao` / `variavel` | conforme o modo | nome da função ou da variável |
| `casos` | código | `entrada`, `saida` e `visivel` (os visíveis viram exemplos; precisa de pelo menos um escondido) |

No modo `funcao`, `entrada` é a lista de argumentos (`"[1, 5, 3]"`) e `saida` é o valor devolvido, escrito como em Python (`"5"`, `"'texto'"`, `"[1, 2]"`).
