/* Desafios da Cela.
   Mundo da prisão: só REPETIÇÃO (for, range, while, percorrer listas, break, laços dentro de laços).
   Mesmo formato dos desafios do restaurante: o código tem um único ___ e só a solução passa nos testes. */
window.FC = window.FC || {};

FC.DESAFIOS.riscos = Object.assign({ nome: "Parede da cela", topico: "for com range", conceito: 'repeticao' }, {
  titulo: "Riscos na parede",
  historia: "Cada dia preso vira um risco na parede. Você quer marcar todos os dias, não um número fixo.",
  objetivo: "Encaixe o bloco para riscar <b>tantas vezes quanto o valor de dias</b>.",
  codigo: "dias = 3\n\nfor i in range(___):\n    print(\"risco\", i + 1)\n",
  variavel: "dias",
  blocos: ["3", "i", "dias", "4"],
  solucao: "dias",
  testes: [
    { valor: "3", saida: "risco 1\nrisco 2\nrisco 3" },
    { valor: "2", saida: "risco 1\nrisco 2" },
    { valor: "4", saida: "risco 1\nrisco 2\nrisco 3\nrisco 4" }
  ],
  dica: "range(n) repete n vezes. Use a variável, e não um número fixo."
});
FC.DESAFIOS.riscos.treino = {
  titulo: "Treino: for com range",
  historia: "Repetir uma ação várias vezes é trabalho para o for.",
  objetivo: "Encaixe o bloco para escrever \"ponto\" <b>tantas vezes quanto o valor de pontos</b>.",
  codigo: "pontos = 3\n\nfor i in range(___):\n    print(\"ponto\")\n",
  variavel: "pontos",
  blocos: ["pontos", "2", "i"],
  solucao: "pontos",
  testes: [
    { valor: "3", saida: "ponto\nponto\nponto" },
    { valor: "2", saida: "ponto\nponto" },
    { valor: "1", saida: "ponto" }
  ],
  dica: "range(n) repete n vezes. Use o nome da variável."
};

FC.DESAFIOS.flexoes = Object.assign({ nome: "Chão da cela", topico: "while e contador", conceito: "repeticao" }, {
  tipo: "ordenar",
  narrador: {"quem": "tiao", "fala": "Psiu, novato. Eu guardo as peças desse plano de fuga. Só entrego para quem prova que sabe o que está fazendo.", "pergunta": "O que acontece se o contador de um while nunca for atualizado dentro do laço?", "opcoes": ["O laço nunca termina (laço infinito)", "O laço roda uma vez só", "O Python atualiza o contador sozinho", "O laço não roda nenhuma vez"], "certa": 0, "explicacao": "Se a condição do while nunca muda, ela continua verdadeira para sempre e o laço não para. Por isso o contador precisa mudar dentro do laço."},
  titulo: "Flexões",
  historia: "Para ganhar força, você faz flexões enquanto o contador não chegar no limite. O programa está com as linhas fora de ordem.",
  objetivo: "Coloque as linhas <b>em ordem</b>: o contador começa antes do laço, e ele só sobe depois de cada flexão.",
  prefixo: "limite = 3\n",
  codigo: "limite = 3\nn = 0\nwhile n < limite:\n    print(\"flexão\", n + 1)\n    n = n + 1\n",
  variavel: "limite",
  blocos: ["    n = n + 1", "while n < limite:", "n = 0", "    print(\"flexão\", n + 1)"],
  solucao: ["n = 0", "while n < limite:", "    print(\"flexão\", n + 1)", "    n = n + 1"],
  testes: [
    { valor: "3", saida: "flexão 1\nflexão 2\nflexão 3" },
    { valor: "1", saida: "flexão 1" },
    { valor: "4", saida: "flexão 1\nflexão 2\nflexão 3\nflexão 4" }
  ],
  dica: "O n precisa existir antes do while. Dentro do laço, mostre a flexão e só depois aumente o contador."
});
FC.DESAFIOS.flexoes.treino = {
  titulo: "Treino: while",
  historia: "O while repete enquanto a condição valer.",
  objetivo: "Encaixe o operador para repetir <b>enquanto n for menor que voltas</b>.",
  codigo: "voltas = 2\nn = 0\n\nwhile n ___ voltas:\n    print(\"volta\")\n    n = n + 1\n",
  variavel: "voltas",
  blocos: ["<", ">", "=="],
  solucao: "<",
  testes: [
    { valor: "2", saida: "volta\nvolta" },
    { valor: "1", saida: "volta" },
    { valor: "3", saida: "volta\nvolta\nvolta" }
  ],
  dica: "A cada volta o n sobe 1. Pare quando n chegar em voltas."
};

FC.DESAFIOS.grade = Object.assign({ nome: "Janela com grades", topico: "for em listas", conceito: "repeticao" }, {
  tipo: "prever",
  titulo: "Ferramentas escondidas",
  historia: "Atrás da grade há uma lista de ferramentas. Você passa por cada uma e marca o fim de cada volta.",
  objetivo: "Leia o programa e escolha <b>o que ele mostra</b> na tela.",
  codigo: "ferramentas = [\"colher\", \"lima\", \"corda\"]\n\nfor item in ferramentas:\n    print(item)\n    print(\"---\")\n",
  blocos: ["colher\n---\nlima\n---\ncorda\n---", "colher\nlima\ncorda\n---", "colher\nlima\ncorda", "---"],
  solucao: "colher\n---\nlima\n---\ncorda\n---",
  dica: "Tudo o que está recuado dentro do for roda a cada volta, uma vez para cada item da lista."
});
FC.DESAFIOS.grade.treino = {
  titulo: "Treino: for e listas",
  historia: "Percorrer uma lista item por item.",
  objetivo: "Encaixe a palavra para escrever <b>cada nome</b> da lista.",
  codigo: "nomes = [\"Ana\", \"Leo\"]\n\nfor nome ___ nomes:\n    print(nome)\n",
  variavel: "nomes",
  blocos: ["in", "=", "range"],
  solucao: "in",
  testes: [
    { valor: "[\"Ana\", \"Leo\"]", saida: "Ana\nLeo" },
    { valor: "[\"Bia\"]", saida: "Bia" },
    { valor: "[\"X\", \"Y\", \"Z\"]", saida: "X\nY\nZ" }
  ],
  dica: "for item in lista: o item recebe um elemento de cada vez."
};

FC.DESAFIOS.saida_cela = Object.assign({ nome: "Cadeado da cela", topico: "Somar dentro de um laço", conceito: 'repeticao' }, {
  titulo: "Cadeado de moedas",
  historia: "O cadeado só abre com a soma de todas as moedas escondidas. Você soma uma a uma dentro do laço.",
  objetivo: "Encaixe o operador para <b>acumular</b> cada moeda em <code>total</code>.",
  codigo: "moedas = [2, 3, 5]\n\ntotal = 0\nfor m in moedas:\n    total = total ___ m\nprint(total)\n",
  variavel: "moedas",
  blocos: ["+", "=", "*", "-"],
  solucao: "+",
  testes: [
    { valor: "[2, 3, 5]", saida: "10" },
    { valor: "[1, 1]", saida: "2" },
    { valor: "[4]", saida: "4" }
  ],
  dica: "A cada volta, total precisa crescer com o valor da moeda. Que operador soma?"
});
FC.DESAFIOS.saida_cela.treino = {
  titulo: "Treino: somar no laço",
  historia: "Acumular valores dentro de um laço.",
  objetivo: "Encaixe o operador para <b>somar</b> cada nota em <code>total</code>.",
  codigo: "notas = [1, 2, 3]\n\ntotal = 0\nfor n in notas:\n    total = total ___ n\nprint(total)\n",
  variavel: "notas",
  blocos: ["+", "-", "*"],
  solucao: "+",
  testes: [
    { valor: "[1, 2, 3]", saida: "6" },
    { valor: "[4]", saida: "4" },
    { valor: "[5, 5]", saida: "10" }
  ],
  dica: "total começa em 0 e vai crescendo a cada volta."
};

