/* Desafios do Túnel.
   Mundo da prisão: só REPETIÇÃO (for, range, while, percorrer listas, break, laços dentro de laços).
   Mesmo formato dos desafios do restaurante: o código tem um único ___ e só a solução passa nos testes. */
window.FC = window.FC || {};

FC.DESAFIOS.lanterna = Object.assign({ nome: "Lanterna", topico: "range (início e fim)", conceito: 'repeticao' }, {
  titulo: "Passos no escuro",
  historia: "Você conta os passos no túnel, do 1 até o último, com a lanterna.",
  objetivo: "Encaixe o fim do <code>range</code> para escrever <b>de 1 até passos</b>, inclusive.",
  codigo: "passos = 3\n\nfor i in range(1, ___):\n    print(i)\n",
  variavel: "passos",
  blocos: ["passos", "passos + 1", "passos - 1", "1"],
  solucao: "passos + 1",
  testes: [
    { valor: "3", saida: "1\n2\n3" },
    { valor: "2", saida: "1\n2" },
    { valor: "4", saida: "1\n2\n3\n4" }
  ],
  dica: "O fim do range nunca entra. Para incluir \"passos\", o fim precisa ser um a mais."
});
FC.DESAFIOS.lanterna.treino = {
  titulo: "Treino: contar até n",
  historia: "O fim do range não entra na contagem.",
  objetivo: "Encaixe o fim para escrever <b>de 1 até n</b>, inclusive.",
  codigo: "n = 3\n\nfor i in range(1, ___):\n    print(i)\n",
  variavel: "n",
  blocos: ["n + 1", "n", "4"],
  solucao: "n + 1",
  testes: [
    { valor: "3", saida: "1\n2\n3" },
    { valor: "2", saida: "1\n2" },
    { valor: "4", saida: "1\n2\n3\n4" }
  ],
  dica: "Para chegar até n, o fim precisa ser n + 1."
};

FC.DESAFIOS.pa = Object.assign({ nome: "Pá", topico: "while com passo", conceito: "repeticao" }, {
  tipo: "duplo",
  narrador: {"quem": "tiao", "fala": "Cavar sem pensar não leva a lugar nenhum. Mostre que entende o laço e a pá é sua.", "pergunta": "Para que serve a linha \"fundo = fundo + 2\" dentro desse while?", "opcoes": ["Fazer a condição mudar até o laço poder parar", "Imprimir o valor na tela", "Reiniciar o laço do começo", "Comparar dois números"], "certa": 0, "explicacao": "Ela faz o fundo crescer a cada volta. Sem isso, a condição nunca ficaria falsa e o laço não terminaria."},
  titulo: "Cavar o túnel",
  historia: "Cada pá de terra cava 2 metros. Você cava enquanto o buraco for menor que a profundidade do alvo.",
  objetivo: "Preencha <b>os dois espaços</b>: a comparação do <code>while</code> e a operação que faz o buraco <b>crescer</b>.",
  codigo: "alvo = 6\nfundo = 0\n\nwhile fundo ___ alvo:\n    fundo = fundo ___ 2\n    print(fundo)\n",
  variavel: "alvo",
  blocos: ["<", "+", "<=", "-"],
  solucao: ["<", "+"],
  testes: [
    { valor: "6", saida: "2\n4\n6" },
    { valor: "5", saida: "2\n4\n6" },
    { valor: "2", saida: "2" }
  ],
  dica: "Pare quando o fundo chegar ou passar do alvo, e lembre que cavar aumenta a profundidade."
});
FC.DESAFIOS.pa.treino = {
  titulo: "Treino: while com contador",
  historia: "Repetir até alcançar um valor.",
  objetivo: "Encaixe o operador para <b>repetir enquanto fundo for menor que alvo</b>.",
  codigo: "alvo = 3\nfundo = 0\n\nwhile fundo ___ alvo:\n    fundo = fundo + 1\n    print(fundo)\n",
  variavel: "alvo",
  blocos: ["<", "<=", ">"],
  solucao: "<",
  testes: [
    { valor: "3", saida: "1\n2\n3" },
    { valor: "1", saida: "1" },
    { valor: "2", saida: "1\n2" }
  ],
  dica: "Com \"menor ou igual\" haveria uma volta a mais."
};

FC.DESAFIOS.tijolos = Object.assign({ nome: "Parede de tijolos", topico: "Percorrer e somar uma lista", conceito: 'repeticao' }, {
  titulo: "Tijolos soltos",
  historia: "Alguns tijolos da parede estão soltos. Você passa por todos e conta só os soltos.",
  objetivo: "Encaixe o operador para <b>somar 1</b> ao contador a cada tijolo solto.",
  codigo: "tijolos = [\"solto\", \"firme\", \"solto\"]\n\ncontador = 0\nfor t in tijolos:\n    if t == \"solto\":\n        contador = contador ___ 1\nprint(contador)\n",
  variavel: "tijolos",
  blocos: ["+", "-", "*", "="],
  solucao: "+",
  testes: [
    { valor: "[\"solto\", \"firme\", \"solto\"]", saida: "2" },
    { valor: "[\"firme\"]", saida: "0" },
    { valor: "[\"solto\", \"solto\", \"solto\", \"firme\"]", saida: "3" }
  ],
  dica: "Contar é ir somando 1. O laço percorre todos e o if escolhe os soltos."
});
FC.DESAFIOS.tijolos.treino = {
  titulo: "Treino: contar no laço",
  historia: "Contar quantas vezes algo aparece.",
  objetivo: "Encaixe o operador para <b>somar 1</b> sempre que o item for \"a\".",
  codigo: "itens = [\"a\", \"b\", \"a\"]\n\ncontador = 0\nfor x in itens:\n    if x == \"a\":\n        contador = contador ___ 1\nprint(contador)\n",
  variavel: "itens",
  blocos: ["+", "-", "="],
  solucao: "+",
  testes: [
    { valor: "[\"a\", \"b\", \"a\"]", saida: "2" },
    { valor: "[\"b\"]", saida: "0" },
    { valor: "[\"a\", \"a\", \"a\"]", saida: "3" }
  ],
  dica: "contador + 1 aumenta em um a cada \"a\" encontrado."
};

FC.DESAFIOS.saida_tunel = Object.assign({ nome: "Saída do túnel", topico: "Laço dentro de laço", conceito: 'repeticao' }, {
  titulo: "Grade de saída",
  historia: "A saída do túnel é uma grade com 2 linhas. Você precisa percorrer cada coluna de cada linha.",
  objetivo: "Encaixe o limite do laço de <b>dentro</b> para percorrer todas as colunas.",
  codigo: "colunas = 2\n\nfor i in range(2):\n    for j in range(___):\n        print(i, j)\n",
  variavel: "colunas",
  blocos: ["colunas", "i", "2", "j"],
  solucao: "colunas",
  testes: [
    { valor: "2", saida: "0 0\n0 1\n1 0\n1 1" },
    { valor: "3", saida: "0 0\n0 1\n0 2\n1 0\n1 1\n1 2" },
    { valor: "1", saida: "0 0\n1 0" }
  ],
  dica: "O laço de dentro roda inteiro a cada volta do de fora. Quantas vezes ele deve rodar?"
});
FC.DESAFIOS.saida_tunel.treino = {
  titulo: "Treino: laço dentro de laço",
  historia: "Dois laços, um dentro do outro.",
  objetivo: "Encaixe o limite do laço de <b>dentro</b> para o \"x\" aparecer <b>linhas × colunas</b> vezes.",
  codigo: "colunas = 2\n\nfor i in range(2):\n    for j in range(___):\n        print(\"x\")\n",
  variavel: "colunas",
  blocos: ["colunas", "i", "2"],
  solucao: "colunas",
  testes: [
    { valor: "2", saida: "x\nx\nx\nx" },
    { valor: "3", saida: "x\nx\nx\nx\nx\nx" },
    { valor: "1", saida: "x\nx" }
  ],
  dica: "São 2 linhas; cada uma repete \"x\" colunas vezes."
};

