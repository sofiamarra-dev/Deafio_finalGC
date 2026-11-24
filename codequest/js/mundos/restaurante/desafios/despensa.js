/* Desafios da Despensa.
   Mundo do restaurante: só CONDICIONAIS (if, elif, else, comparações, and, or, not, in).
   Cada desafio tem: nome, conceito, titulo, historia, objetivo (HTML), codigo (com um único ___),
   variavel (trocada em cada teste), blocos (a bandeja), solucao, testes [{valor, saida}], dica, treino. */
window.FC = window.FC || {};

FC.DESAFIOS.prateleira = Object.assign({ nome: "Prateleira", conceito: 'condicional' }, {
  titulo: "Prateleira de temperos",
  historia: "A prateleira separa os temperos. Tanto o sal quanto a pimenta vão para o mesmo pote.",
  objetivo: "A mensagem \"Tempero\" deve aparecer se o sabor for sal <b>ou</b> pimenta. Encaixe a palavra certa entre as duas comparações.",
  codigo: "sabor = \"sal\"\n\nif sabor == \"sal\" ___ sabor == \"pimenta\":\n    print(\"Tempero\")\nelse:\n    print(\"Outro\")\n",
  variavel: "sabor",
  blocos: ["and", "or", "not", "=="],
  solucao: "or",
  testes: [
    { valor: "\"sal\"", saida: "Tempero" },
    { valor: "\"pimenta\"", saida: "Tempero" },
    { valor: "\"arroz\"", saida: "Outro" }
  ],
  dica: "Nenhum sabor é sal e pimenta ao mesmo tempo. Basta uma das duas comparações ser verdadeira."
});
FC.DESAFIOS.prateleira.treino = {
  titulo: "Treino: or",
  historia: "Uma das duas condições basta.",
  objetivo: "Encaixe a palavra para aceitar a cor vermelha <b>ou</b> azul.",
  codigo: "cor = \"azul\"\n\nif cor == \"vermelho\" ___ cor == \"azul\":\n    print(\"Aceita\")\nelse:\n    print(\"Recusa\")\n",
  variavel: "cor",
  blocos: ["or", "and"],
  solucao: "or",
  testes: [
    { valor: "\"azul\"", saida: "Aceita" },
    { valor: "\"vermelho\"", saida: "Aceita" },
    { valor: "\"verde\"", saida: "Recusa" }
  ],
  dica: "or é verdadeiro quando pelo menos um lado for verdadeiro."
};

FC.DESAFIOS.caixote = Object.assign({ nome: "Caixote", conceito: 'condicional' }, {
  titulo: "Caixote de lixo",
  historia: "O caixote só aceita caixas que NÃO estejam lacradas. As lacradas voltam para a prateleira.",
  objetivo: "Encaixe a palavra que <b>inverte</b> o valor de <code>lacrada</code>.",
  codigo: "lacrada = True\n\nif ___ lacrada:\n    print(\"Pode jogar fora\")\nelse:\n    print(\"Guardar\")\n",
  variavel: "lacrada",
  blocos: ["not", "and", "or", "if"],
  solucao: "not",
  testes: [
    { valor: "True", saida: "Guardar" },
    { valor: "False", saida: "Pode jogar fora" }
  ],
  dica: "not troca verdadeiro por falso. A condição precisa ser verdadeira quando a caixa NÃO está lacrada."
});
FC.DESAFIOS.caixote.treino = {
  titulo: "Treino: not",
  historia: "Inverter um verdadeiro ou falso.",
  objetivo: "Encaixe a palavra para a luz acender quando <code>dia</code> for falso.",
  codigo: "dia = False\n\nif ___ dia:\n    print(\"Acender luz\")\nelse:\n    print(\"Apagar luz\")\n",
  variavel: "dia",
  blocos: ["not", "and", "or"],
  solucao: "not",
  testes: [
    { valor: "False", saida: "Acender luz" },
    { valor: "True", saida: "Apagar luz" }
  ],
  dica: "not dia é verdadeiro quando dia é falso."
};

FC.DESAFIOS.balanca = Object.assign({ nome: "Balança", conceito: 'condicional' }, {
  titulo: "Balança da despensa",
  historia: "A balança avisa quando um saco é pesado: dez quilos ou mais.",
  objetivo: "Encaixe o operador para \"Pesado\" aparecer com <b>10 ou mais</b>.",
  codigo: "peso = 12\n\nif peso ___ 10:\n    print(\"Pesado\")\nelse:\n    print(\"Leve\")\n",
  variavel: "peso",
  blocos: [">", ">=", "<", "=="],
  solucao: ">=",
  testes: [
    { valor: "12", saida: "Pesado" },
    { valor: "10", saida: "Pesado" },
    { valor: "7", saida: "Leve" }
  ],
  dica: "\"Ou mais\" inclui o próprio 10. Um símbolo com igual junto resolve."
});
FC.DESAFIOS.balanca.treino = {
  titulo: "Treino: maior ou igual",
  historia: "Mesma ideia, com um limite diferente.",
  objetivo: "Encaixe o operador para o ingresso ser meia-entrada com <b>12 anos ou menos</b>.",
  codigo: "idade = 10\n\nif idade ___ 12:\n    print(\"Meia\")\nelse:\n    print(\"Inteira\")\n",
  variavel: "idade",
  blocos: ["<=", "<", ">="],
  solucao: "<=",
  testes: [
    { valor: "10", saida: "Meia" },
    { valor: "12", saida: "Meia" },
    { valor: "15", saida: "Inteira" }
  ],
  dica: "\"Ou menos\" inclui o limite: <= tem o igual junto."
};

FC.DESAFIOS.saida_despensa = Object.assign({ nome: "Porta de saída", conceito: 'condicional' }, {
  titulo: "Cofre da saída",
  historia: "A porta da despensa tem um cofre que só abre com um número dentro de uma faixa.",
  objetivo: "O número precisa ser <b>maior que 10 e também menor que 50</b>. Encaixe a palavra que exige as duas coisas.",
  codigo: "numero = 42\n\nif numero > 10 ___ numero < 50:\n    print(\"Porta aberta!\")\nelse:\n    print(\"Porta trancada!\")\n",
  variavel: "numero",
  blocos: ["and", "or", "not", "if"],
  solucao: "and",
  testes: [
    { valor: "42", saida: "Porta aberta!" },
    { valor: "5", saida: "Porta trancada!" },
    { valor: "70", saida: "Porta trancada!" }
  ],
  dica: "Com or, qualquer número passaria por uma das duas condições. Você quer que as duas sejam verdadeiras."
});
FC.DESAFIOS.saida_despensa.treino = {
  titulo: "Treino: and",
  historia: "Duas condições ao mesmo tempo.",
  objetivo: "Encaixe a palavra para entrar só se a idade for <b>maior que 12 e menor que 18</b>.",
  codigo: "idade = 15\n\nif idade > 12 ___ idade < 18:\n    print(\"Entra\")\nelse:\n    print(\"Fora\")\n",
  variavel: "idade",
  blocos: ["and", "or"],
  solucao: "and",
  testes: [
    { valor: "15", saida: "Entra" },
    { valor: "10", saida: "Fora" },
    { valor: "20", saida: "Fora" }
  ],
  dica: "and só é verdadeiro quando os dois lados são verdadeiros."
};

