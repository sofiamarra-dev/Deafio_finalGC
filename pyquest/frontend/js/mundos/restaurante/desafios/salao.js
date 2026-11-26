/* Desafios do Salão.
   Mundo do restaurante: só CONDICIONAIS (if, elif, else, comparações, and, or, not, in).
   Cada desafio tem: nome, conceito, titulo, historia, objetivo (HTML), codigo (com um único ___),
   variavel (trocada em cada teste), blocos (a bandeja), solucao, testes [{valor, saida}], dica, treino. */
window.FC = window.FC || {};

FC.DESAFIOS.registradora = Object.assign({ nome: "Caixa", topico: "Diferente (!=)", conceito: 'condicional' }, {
  titulo: "Caixa registradora",
  historia: "O caixa mostra o saldo da conta de cada mesa. Positivo é crédito, negativo é dívida. Só zero está quitado.",
  objetivo: "Encaixe o operador para avisar \"Pendente\" quando o saldo for <b>diferente de 0</b>.",
  codigo: "saldo = 25\n\nif saldo ___ 0:\n    print(\"Pendente\")\nelse:\n    print(\"Quitado\")\n",
  variavel: "saldo",
  blocos: ["==", "!=", ">", "<"],
  solucao: "!=",
  testes: [
    { valor: "25", saida: "Pendente" },
    { valor: "-10", saida: "Pendente" },
    { valor: "0", saida: "Quitado" }
  ],
  dica: "\"Diferente\" é !=. Cuidado: saldo negativo também é pendente."
});
FC.DESAFIOS.registradora.treino = {
  titulo: "Treino: diferente de",
  historia: "Conferir se algo é diferente.",
  objetivo: "Encaixe o operador para avisar quando a cor for <b>diferente</b> de \"branco\".",
  codigo: "cor = \"preto\"\n\nif cor ___ \"branco\":\n    print(\"Colorido\")\nelse:\n    print(\"Branco\")\n",
  variavel: "cor",
  blocos: ["!=", "=="],
  solucao: "!=",
  testes: [
    { valor: "\"preto\"", saida: "Colorido" },
    { valor: "\"branco\"", saida: "Branco" },
    { valor: "\"azul\"", saida: "Colorido" }
  ],
  dica: "!= é verdadeiro quando os dois lados são diferentes."
};

FC.DESAFIOS.cardapio = Object.assign({ nome: "Cardápio", topico: "in e not in", conceito: "condicional" }, {
  tipo: "prever",
  titulo: "Cardápio do dia",
  historia: "O cardápio lista os pratos do dia. O garçom confere cada pedido antes de anotar.",
  objetivo: "Leia o programa e escolha <b>o que ele mostra</b> na tela.",
  codigo: "cardapio = [\"sopa\", \"bife\", \"torta\"]\npedido = \"bife\"\n\nif pedido not in cardapio:\n    print(\"Esgotado\")\nelse:\n    print(\"Temos\", pedido)\n",
  blocos: ["Esgotado", "Temos bife", "Temos", "Temos pedido"],
  solucao: "Temos bife",
  dica: "\"not in\" é verdadeiro quando o pedido NÃO está na lista. E print com vírgula mostra os dois valores separados por espaço."
});
FC.DESAFIOS.cardapio.treino = {
  titulo: "Treino: in",
  historia: "Conferir se algo está numa lista.",
  objetivo: "Encaixe o operador para ver se a letra é uma <b>vogal da lista</b>.",
  codigo: "letra = \"a\"\n\nif letra ___ [\"a\", \"e\", \"i\"]:\n    print(\"Vogal\")\nelse:\n    print(\"Outra\")\n",
  variavel: "letra",
  blocos: ["in", "not in", "=="],
  solucao: "in",
  testes: [
    { valor: "\"a\"", saida: "Vogal" },
    { valor: "\"i\"", saida: "Vogal" },
    { valor: "\"z\"", saida: "Outra" }
  ],
  dica: "in é verdadeiro quando o valor aparece na lista."
};

FC.DESAFIOS.sino = Object.assign({ nome: "Sino", topico: "Resto (%) e ordem dos testes", conceito: "condicional" }, {
  tipo: "ordenar",
  narrador: {"quem": "cuca", "fala": "O sino das mesas tem uma pegadinha de ordem. Responda primeiro, e as linhas são suas.", "pergunta": "Em if / elif, por que o caso mais específico precisa vir antes do mais geral?", "opcoes": ["O Python para no primeiro caso verdadeiro; se o geral viesse antes, o específico nunca seria testado", "O Python lê o programa de baixo para cima", "O elif só funciona com números", "Não faz diferença nenhuma"], "certa": 0, "explicacao": "O Python testa de cima para baixo e para no primeiro caso verdadeiro. Um caso geral antes do específico \"rouba\" a vez dele."},
  titulo: "Sino das mesas",
  historia: "O garçom toca o sino pelo fundo nas mesas pares acima de 6, pela direita nas outras pares e pela esquerda nas ímpares.",
  objetivo: "Coloque as linhas <b>em ordem</b>. O caso mais específico (par e maior que 6) precisa ser testado antes do mais geral.",
  prefixo: "mesa = 4\n\n",
  codigo: "mesa = 4\n\nif mesa % 2 == 0 and mesa > 6:\n    print(\"Fundo\")\nelif mesa % 2 == 0:\n    print(\"Direita\")\nelse:\n    print(\"Esquerda\")\n",
  variavel: "mesa",
  blocos: ["    print(\"Direita\")", "else:", "if mesa % 2 == 0 and mesa > 6:", "    print(\"Esquerda\")", "elif mesa % 2 == 0:", "    print(\"Fundo\")"],
  solucao: ["if mesa % 2 == 0 and mesa > 6:", "    print(\"Fundo\")", "elif mesa % 2 == 0:", "    print(\"Direita\")", "else:", "    print(\"Esquerda\")"],
  testes: [
    { valor: "8", saida: "Fundo" },
    { valor: "4", saida: "Direita" },
    { valor: "7", saida: "Esquerda" },
    { valor: "10", saida: "Fundo" }
  ],
  dica: "Se a pergunta geral (par) viesse primeiro, as mesas 8 e 10 nunca chegariam na pergunta específica."
});
FC.DESAFIOS.sino.treino = {
  titulo: "Treino: resto",
  historia: "Par ou ímpar com o resto da divisão.",
  objetivo: "Encaixe o operador para mostrar \"Par\" quando o resto for <b>0</b>.",
  codigo: "n = 6\n\nif n % 2 ___ 0:\n    print(\"Par\")\nelse:\n    print(\"Ímpar\")\n",
  variavel: "n",
  blocos: ["==", "!="],
  solucao: "==",
  testes: [
    { valor: "6", saida: "Par" },
    { valor: "3", saida: "Ímpar" },
    { valor: "8", saida: "Par" }
  ],
  dica: "% devolve o resto. Resto 0 significa par."
};

FC.DESAFIOS.saida_salao = Object.assign({ nome: "Porta de saída", topico: "Menor ou igual (<=)", conceito: 'condicional' }, {
  titulo: "Fechadura do salão",
  historia: "A última porta tem um limite de convidados. Até 20 pessoas, ela abre.",
  objetivo: "Encaixe o operador para abrir com <b>20 convidados ou menos</b>.",
  codigo: "convidados = 18\n\nif convidados ___ 20:\n    print(\"Porta aberta!\")\nelse:\n    print(\"Porta trancada!\")\n",
  variavel: "convidados",
  blocos: ["<", "<=", ">", ">="],
  solucao: "<=",
  testes: [
    { valor: "18", saida: "Porta aberta!" },
    { valor: "20", saida: "Porta aberta!" },
    { valor: "25", saida: "Porta trancada!" }
  ],
  dica: "\"Até 20\" inclui o 20. Um símbolo com igual junto faz isso."
});
FC.DESAFIOS.saida_salao.treino = {
  titulo: "Treino: menor ou igual",
  historia: "Um limite que inclui o próprio valor.",
  objetivo: "Encaixe o operador para a mochila aceitar <b>até 5 kg</b>.",
  codigo: "peso = 5\n\nif peso ___ 5:\n    print(\"Cabe\")\nelse:\n    print(\"Pesada\")\n",
  variavel: "peso",
  blocos: ["<=", "<", ">"],
  solucao: "<=",
  testes: [
    { valor: "5", saida: "Cabe" },
    { valor: "3", saida: "Cabe" },
    { valor: "8", saida: "Pesada" }
  ],
  dica: "\"Até\" inclui o limite: <= tem o igual junto."
};

