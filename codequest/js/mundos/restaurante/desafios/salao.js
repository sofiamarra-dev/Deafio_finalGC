/* Desafios do Salão.
   Mundo do restaurante: só CONDICIONAIS (if, elif, else, comparações, and, or, not, in).
   Cada desafio tem: nome, conceito, titulo, historia, objetivo (HTML), codigo (com um único ___),
   variavel (trocada em cada teste), blocos (a bandeja), solucao, testes [{valor, saida}], dica, treino. */
window.FC = window.FC || {};

FC.DESAFIOS.registradora = Object.assign({ nome: "Caixa", conceito: 'condicional' }, {
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

FC.DESAFIOS.cardapio = Object.assign({ nome: "Cardápio", conceito: 'condicional' }, {
  titulo: "Cardápio do dia",
  historia: "O cardápio lista os pratos do dia. Qualquer outro prato está esgotado.",
  objetivo: "Encaixe o operador que confere se o prato <b>está na lista</b>.",
  codigo: "prato = \"sopa\"\n\nif prato ___ [\"sopa\", \"bife\", \"torta\"]:\n    print(\"Temos!\")\nelse:\n    print(\"Esgotado\")\n",
  variavel: "prato",
  blocos: ["in", "==", "not in", "is"],
  solucao: "in",
  testes: [
    { valor: "\"sopa\"", saida: "Temos!" },
    { valor: "\"bife\"", saida: "Temos!" },
    { valor: "\"pizza\"", saida: "Esgotado" }
  ],
  dica: "Comparar um texto com uma lista inteira não funciona com ==. Existe uma palavra para \"está dentro de\"."
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

FC.DESAFIOS.sino = Object.assign({ nome: "Sino", conceito: 'condicional' }, {
  titulo: "Sino das mesas",
  historia: "O garçom toca o sino pela direita nas mesas pares e pela esquerda nas ímpares.",
  objetivo: "O resto da divisão por 2 diz se um número é par. Encaixe o operador para \"Direita\" aparecer nas mesas <b>pares</b>.",
  codigo: "mesa = 4\n\nif mesa % 2 ___ 0:\n    print(\"Direita\")\nelse:\n    print(\"Esquerda\")\n",
  variavel: "mesa",
  blocos: ["==", "!=", ">", "="],
  solucao: "==",
  testes: [
    { valor: "4", saida: "Direita" },
    { valor: "7", saida: "Esquerda" },
    { valor: "10", saida: "Direita" }
  ],
  dica: "Número par tem resto 0 ao dividir por 2. Para comparar, são dois sinais de igual."
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

FC.DESAFIOS.saida_salao = Object.assign({ nome: "Porta de saída", conceito: 'condicional' }, {
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

