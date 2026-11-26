/* Desafios da Despensa.
   Mundo do restaurante: só CONDICIONAIS (if, elif, else, comparações, and, or, not, in).
   Cada desafio tem: nome, conceito, titulo, historia, objetivo (HTML), codigo (com um único ___),
   variavel (trocada em cada teste), blocos (a bandeja), solucao, testes [{valor, saida}], dica, treino. */
window.FC = window.FC || {};

FC.DESAFIOS.prateleira = Object.assign({ nome: "Prateleira", topico: "Operador or", conceito: 'condicional' }, {
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

FC.DESAFIOS.caixote = Object.assign({ nome: "Caixote", topico: "Operador not", conceito: "condicional" }, {
  tipo: "prever",
  titulo: "Caixote de lixo",
  historia: "O caixote só aceita caixas que NÃO estejam lacradas. As lacradas voltam para a prateleira e as vazias vão para a reciclagem.",
  objetivo: "Leia o programa e escolha <b>o que ele mostra</b> na tela.",
  codigo: "lacrada = True\nvazia = False\n\nif not lacrada and not vazia:\n    print(\"Jogar fora\")\nelif lacrada:\n    print(\"Guardar\")\nelse:\n    print(\"Reciclar\")\n",
  blocos: ["Jogar fora", "Guardar", "Reciclar", "Guardar\nReciclar"],
  solucao: "Guardar",
  dica: "Troque os valores no código: not lacrada vira False. Só um dos caminhos (if, elif ou else) é executado."
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

FC.DESAFIOS.balanca = Object.assign({ nome: "Balança", topico: "and e maior ou igual", conceito: "condicional" }, {
  tipo: "duplo",
  narrador: {"quem": "cuca", "fala": "Essa balança é exigente, querido. Os blocos só saem da minha bandeja se você souber ligar duas condições.", "pergunta": "Com o operador and, quantas das duas partes precisam ser verdadeiras para o if rodar?", "opcoes": ["As duas", "Pelo menos uma", "Nenhuma", "Só a primeira"], "certa": 0, "explicacao": "O and exige que as duas partes sejam verdadeiras. Quem aceita só uma delas é o or."},
  titulo: "Balança da despensa",
  historia: "A balança só dá o alerta \"Pesado\" para sacos de dez quilos ou mais, mas menos de vinte. Acima disso é outro setor.",
  objetivo: "Preencha <b>os dois espaços</b>: o operador para \"10 ou mais\" e a palavra que exige <b>as duas</b> condições ao mesmo tempo.",
  codigo: "peso = 12\n\nif peso ___ 10 ___ peso < 20:\n    print(\"Pesado\")\nelse:\n    print(\"Fora da faixa\")\n",
  variavel: "peso",
  blocos: [">=", "and", "or", ">"],
  solucao: [">=", "and"],
  testes: [
    { valor: "12", saida: "Pesado" },
    { valor: "10", saida: "Pesado" },
    { valor: "7", saida: "Fora da faixa" },
    { valor: "25", saida: "Fora da faixa" }
  ],
  dica: "\"10 ou mais\" inclui o 10. E o peso precisa estar na faixa inteira: uma condição E a outra."
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

FC.DESAFIOS.saida_despensa = Object.assign({ nome: "Porta de saída", topico: "Operador and", conceito: 'condicional' }, {
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

