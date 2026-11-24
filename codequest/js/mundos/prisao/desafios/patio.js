/* Desafios do Pátio.
   Mundo da prisão: só REPETIÇÃO (for, range, while, percorrer listas, break, laços dentro de laços).
   Mesmo formato dos desafios do restaurante: o código tem um único ___ e só a solução passa nos testes. */
window.FC = window.FC || {};

FC.DESAFIOS.holofote = Object.assign({ nome: "Holofote do pátio", conceito: 'repeticao' }, {
  titulo: "Holofote de dois em dois",
  historia: "O holofote só passa por cima das posições pares, de 2 em 2, sem chegar ao limite.",
  objetivo: "O terceiro valor do <code>range</code> é o passo. Encaixe o fim certo para escrever as posições <b>antes do limite</b>.",
  codigo: "limite = 6\n\nfor i in range(0, ___, 2):\n    print(i)\n",
  variavel: "limite",
  blocos: ["limite", "limite + 1", "2", "0"],
  solucao: "limite",
  testes: [
    { valor: "6", saida: "0\n2\n4" },
    { valor: "4", saida: "0\n2" },
    { valor: "8", saida: "0\n2\n4\n6" }
  ],
  dica: "range(início, fim, passo) não inclui o fim. Aqui o fim é o próprio limite."
});
FC.DESAFIOS.holofote.treino = {
  titulo: "Treino: range simples",
  historia: "Contar de zero até antes de um número.",
  objetivo: "Encaixe o bloco para escrever os números <b>antes de limite</b>.",
  codigo: "limite = 3\n\nfor i in range(___):\n    print(i)\n",
  variavel: "limite",
  blocos: ["limite", "3", "i"],
  solucao: "limite",
  testes: [
    { valor: "3", saida: "0\n1\n2" },
    { valor: "2", saida: "0\n1" },
    { valor: "4", saida: "0\n1\n2\n3" }
  ],
  dica: "range(n) vai de 0 até n - 1."
};

FC.DESAFIOS.bola = Object.assign({ nome: "Cesta de basquete", conceito: 'repeticao' }, {
  titulo: "Arremessos",
  historia: "Você tem arremessos limitados. A cada tentativa, um a menos, até zerar.",
  objetivo: "Encaixe o operador para o contador <b>diminuir</b> a cada volta.",
  codigo: "tentativas = 3\n\nwhile tentativas > 0:\n    print(\"arremesso\")\n    tentativas = tentativas ___ 1\n",
  variavel: "tentativas",
  blocos: ["-", "+", "*", "="],
  solucao: "-",
  testes: [
    { valor: "3", saida: "arremesso\narremesso\narremesso" },
    { valor: "1", saida: "arremesso" },
    { valor: "2", saida: "arremesso\narremesso" }
  ],
  dica: "Se o contador nunca diminui, o while nunca termina. Que operador diminui?"
});
FC.DESAFIOS.bola.treino = {
  titulo: "Treino: contagem regressiva",
  historia: "Um while que precisa terminar.",
  objetivo: "Encaixe o operador para <code>copos</code> <b>diminuir</b> a cada volta.",
  codigo: "copos = 3\n\nwhile copos > 0:\n    print(\"copo\")\n    copos = copos ___ 1\n",
  variavel: "copos",
  blocos: ["-", "+"],
  solucao: "-",
  testes: [
    { valor: "3", saida: "copo\ncopo\ncopo" },
    { valor: "1", saida: "copo" },
    { valor: "2", saida: "copo\ncopo" }
  ],
  dica: "Sem diminuir, copos nunca chega a zero e o laço não acaba."
};

FC.DESAFIOS.muro = Object.assign({ nome: "Guarita", conceito: 'repeticao' }, {
  titulo: "Hora de sair",
  historia: "Você vigia a ronda hora por hora, mas precisa parar de vigiar no instante em que a hora do limite chegar.",
  objetivo: "Encaixe a palavra que <b>interrompe o laço</b> de uma vez.",
  codigo: "limite = 3\n\nfor hora in range(1, 6):\n    print(\"hora\", hora)\n    if hora == limite:\n        ___\n",
  variavel: "limite",
  blocos: ["break", "continue", "pass", "return"],
  solucao: "break",
  testes: [
    { valor: "3", saida: "hora 1\nhora 2\nhora 3" },
    { valor: "1", saida: "hora 1" },
    { valor: "2", saida: "hora 1\nhora 2" }
  ],
  dica: "Uma palavra encerra o laço na hora. A que só pula para a próxima volta não resolve."
});
FC.DESAFIOS.muro.treino = {
  titulo: "Treino: break",
  historia: "Sair do laço antes da hora.",
  objetivo: "Encaixe a palavra que <b>para o laço</b> quando i chegar em fim.",
  codigo: "fim = 2\n\nfor i in range(1, 6):\n    print(i)\n    if i == fim:\n        ___\n",
  variavel: "fim",
  blocos: ["break", "pass", "continue"],
  solucao: "break",
  testes: [
    { valor: "2", saida: "1\n2" },
    { valor: "4", saida: "1\n2\n3\n4" },
    { valor: "1", saida: "1" }
  ],
  dica: "break sai do laço imediatamente."
};

FC.DESAFIOS.saida_patio = Object.assign({ nome: "Portão do pátio", conceito: 'repeticao' }, {
  titulo: "Escada de tijolos",
  historia: "O portão desenha uma escada: a primeira linha tem 1 tijolo, a segunda 2, e assim por diante.",
  objetivo: "Encaixe a expressão com o número de tijolos de <b>cada linha</b> (começando em 1).",
  codigo: "degraus = 3\n\nfor i in range(degraus):\n    print(\"#\" * (___))\n",
  variavel: "degraus",
  blocos: ["i + 1", "i", "degraus", "1"],
  solucao: "i + 1",
  testes: [
    { valor: "3", saida: "#\n##\n###" },
    { valor: "2", saida: "#\n##" },
    { valor: "4", saida: "#\n##\n###\n####" }
  ],
  dica: "i começa em 0, mas a primeira linha precisa de 1 tijolo."
});
FC.DESAFIOS.saida_patio.treino = {
  titulo: "Treino: texto repetido",
  historia: "Repetir um texto com a multiplicação.",
  objetivo: "Encaixe o número para <b>cada linha ter 3 tijolos</b>.",
  codigo: "linhas = 2\n\nfor i in range(linhas):\n    print(\"#\" * ___)\n",
  variavel: "linhas",
  blocos: ["3", "i", "linhas"],
  solucao: "3",
  testes: [
    { valor: "2", saida: "###\n###" },
    { valor: "3", saida: "###\n###\n###" },
    { valor: "1", saida: "###" }
  ],
  dica: "\"#\" * 3 escreve ###."
};

