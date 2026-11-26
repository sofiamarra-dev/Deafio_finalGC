/* Desafios do Pátio.
   Mundo da prisão: só REPETIÇÃO (for, range, while, percorrer listas, break, laços dentro de laços).
   Mesmo formato dos desafios do restaurante: o código tem um único ___ e só a solução passa nos testes. */
window.FC = window.FC || {};

FC.DESAFIOS.holofote = Object.assign({ nome: "Holofote do pátio", topico: "range com passo", conceito: "repeticao" }, {
  tipo: "duplo",
  narrador: {"quem": "tiao", "fala": "O holofote do pátio segue um padrão. Entenda o padrão e eu te passo os blocos.", "pergunta": "No range(0, 10, 2), o que significa o número 2?", "opcoes": ["O passo: de quanto em quanto os valores sobem", "O número de repetições", "O valor final", "O primeiro valor"], "certa": 0, "explicacao": "range(início, fim, passo): o terceiro valor é o passo. E o fim nunca entra na contagem."},
  titulo: "Holofote de dois em dois",
  historia: "O holofote só passa por cima das posições pares, de 2 em 2, começando na zero e sem chegar ao limite.",
  objetivo: "Preencha <b>o começo e o fim</b> do <code>range</code>. O terceiro valor (2) é o passo.",
  codigo: "limite = 6\n\nfor i in range(___, ___, 2):\n    print(i)\n",
  variavel: "limite",
  blocos: ["0", "limite", "1", "limite + 1"],
  solucao: ["0", "limite"],
  testes: [
    { valor: "6", saida: "0\n2\n4" },
    { valor: "4", saida: "0\n2" },
    { valor: "8", saida: "0\n2\n4\n6" }
  ],
  dica: "range(início, fim, passo) começa no início e para antes do fim."
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

FC.DESAFIOS.bola = Object.assign({ nome: "Cesta de basquete", topico: "while regressivo", conceito: 'repeticao' }, {
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

FC.DESAFIOS.muro = Object.assign({ nome: "Guarita", topico: "break", conceito: "repeticao" }, {
  tipo: "prever",
  titulo: "Hora de sair",
  historia: "Você vigia a ronda hora por hora, mas o guarda manda parar quando chega a hora 3.",
  objetivo: "Leia o programa e escolha <b>o que ele mostra</b> na tela.",
  codigo: "for hora in range(1, 6):\n    print(\"hora\", hora)\n    if hora == 3:\n        break\nprint(\"fim\")\n",
  blocos: ["hora 1\nhora 2\nhora 3\nfim", "hora 1\nhora 2\nhora 3", "hora 1\nhora 2\nfim", "hora 1\nhora 2\nhora 3\nhora 4\nhora 5\nfim"],
  solucao: "hora 1\nhora 2\nhora 3\nfim",
  dica: "break encerra o laço na hora. O que está fora do for (sem recuo) continua rodando depois."
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

FC.DESAFIOS.saida_patio = Object.assign({ nome: "Portão do pátio", topico: "range e i + 1", conceito: 'repeticao' }, {
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

