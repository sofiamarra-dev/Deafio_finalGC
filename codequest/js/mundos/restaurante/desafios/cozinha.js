/* Desafios da Cozinha.
   Mundo do restaurante: só CONDICIONAIS (if, elif, else, comparações, and, or, not, in).
   Cada desafio tem: nome, conceito, titulo, historia, objetivo (HTML), codigo (com um único ___),
   variavel (trocada em cada teste), blocos (a bandeja), solucao, testes [{valor, saida}], dica, treino. */
window.FC = window.FC || {};

FC.DESAFIOS.geladeira = Object.assign({ nome: "Geladeira", conceito: 'condicional' }, {
  titulo: "Geladeira com alarme",
  historia: "A geladeira apita quando esquenta demais. Ela só pode ficar \"Gelada\" se a temperatura estiver abaixo de 5 graus.",
  objetivo: "Encaixe o operador para que a mensagem \"Gelada\" apareça só quando a temperatura for <b>menor que 5</b>.",
  codigo: "temperatura = 3\n\nif temperatura ___ 5:\n    print(\"Gelada\")\nelse:\n    print(\"Esquentou!\")\n",
  variavel: "temperatura",
  blocos: [">", "<=", "<", "=="],
  solucao: "<",
  testes: [
    { valor: "3", saida: "Gelada" },
    { valor: "5", saida: "Esquentou!" },
    { valor: "9", saida: "Esquentou!" }
  ],
  dica: "Menor que é um símbolo só, e com exatamente 5 a geladeira já não está abaixo de 5."
});
FC.DESAFIOS.geladeira.treino = {
  titulo: "Treino: menor que",
  historia: "Um aquecimento: decidir pelo tamanho de um número.",
  objetivo: "Encaixe o operador para passar quando a nota for <b>menor que 7</b>.",
  codigo: "nota = 4\n\nif nota ___ 7:\n    print(\"Recuperação\")\nelse:\n    print(\"Aprovado\")\n",
  variavel: "nota",
  blocos: ["<", ">", "=="],
  solucao: "<",
  testes: [
    { valor: "4", saida: "Recuperação" },
    { valor: "7", saida: "Aprovado" },
    { valor: "9", saida: "Aprovado" }
  ],
  dica: "O símbolo < aponta para o lado menor. Com 7, o aluno já está aprovado."
};

FC.DESAFIOS.fogao = Object.assign({ nome: "Fogão", conceito: 'condicional' }, {
  titulo: "Fogão de três potências",
  historia: "O fogão tem três níveis de chama. Cada nível mostra uma mensagem, e só uma delas pode aparecer.",
  objetivo: "Encaixe a palavra que liga uma segunda pergunta à primeira, sem rodar as duas ao mesmo tempo.",
  codigo: "chama = 2\n\nif chama == 3:\n    print(\"Forte\")\n___ chama == 2:\n    print(\"Média\")\nelse:\n    print(\"Fraca\")\n",
  variavel: "chama",
  blocos: ["elif", "if", "else", "for"],
  solucao: "elif",
  testes: [
    { valor: "3", saida: "Forte" },
    { valor: "2", saida: "Média" },
    { valor: "1", saida: "Fraca" }
  ],
  dica: "Um segundo if começa uma pergunta nova. Para continuar a mesma sequência, existe uma palavra que junta \"senão se\"."
});
FC.DESAFIOS.fogao.treino = {
  titulo: "Treino: elif",
  historia: "Duas opções com uma pergunta no meio.",
  objetivo: "Encaixe a palavra que significa \"senão, se\".",
  codigo: "luz = 2\n\nif luz == 1:\n    print(\"Fraca\")\n___ luz == 2:\n    print(\"Média\")\nelse:\n    print(\"Forte\")\n",
  variavel: "luz",
  blocos: ["elif", "if", "else"],
  solucao: "elif",
  testes: [
    { valor: "1", saida: "Fraca" },
    { valor: "2", saida: "Média" },
    { valor: "3", saida: "Forte" }
  ],
  dica: "elif quer dizer \"senão, se\": só é testado quando o if de cima falhou."
};

FC.DESAFIOS.gaveta = Object.assign({ nome: "Gaveta", conceito: 'condicional' }, {
  titulo: "Gaveta com senha",
  historia: "A gaveta guarda a chave da cozinha. Ela só abre quando a senha digitada for igual à senha certa.",
  objetivo: "Encaixe o operador que verifica se dois textos são <b>iguais</b>.",
  codigo: "senha = \"queijo\"\n\nif senha ___ \"queijo\":\n    print(\"Gaveta aberta!\")\nelse:\n    print(\"Senha errada!\")\n",
  variavel: "senha",
  blocos: ["=", "!=", "==", ">"],
  solucao: "==",
  testes: [
    { valor: "\"queijo\"", saida: "Gaveta aberta!" },
    { valor: "\"rato\"", saida: "Senha errada!" },
    { valor: "\"Queijo\"", saida: "Senha errada!" }
  ],
  dica: "Um único = guarda valor numa variável. Para comparar se são iguais, use dois sinais juntos."
});
FC.DESAFIOS.gaveta.treino = {
  titulo: "Treino: comparar textos",
  historia: "Comparar dois textos é o jeito de conferir uma senha.",
  objetivo: "Encaixe o operador que confere se a fruta é <b>igual</b> a \"uva\".",
  codigo: "fruta = \"uva\"\n\nif fruta ___ \"uva\":\n    print(\"Sim\")\nelse:\n    print(\"Não\")\n",
  variavel: "fruta",
  blocos: ["==", "=", "!="],
  solucao: "==",
  testes: [
    { valor: "\"uva\"", saida: "Sim" },
    { valor: "\"pera\"", saida: "Não" },
    { valor: "\"kiwi\"", saida: "Não" }
  ],
  dica: "Dois sinais de igual comparam. Um sinal só guarda um valor."
};

FC.DESAFIOS.saida_cozinha = Object.assign({ nome: "Porta de saída", conceito: 'condicional' }, {
  titulo: "Cadeado eletrônico",
  historia: "Com a energia dos três painéis, o cadeado acorda. Ele só libera a porta se a bateria estiver carregada.",
  objetivo: "O cadeado só libera se a energia for <b>maior que 5</b>. Encaixe o operador certo.",
  codigo: "energia = 7\n\nif energia ___ 5:\n    print(\"Porta aberta!\")\nelse:\n    print(\"Porta trancada!\")\n",
  variavel: "energia",
  blocos: ["<", ">=", ">", "=="],
  solucao: ">",
  testes: [
    { valor: "7", saida: "Porta aberta!" },
    { valor: "5", saida: "Porta trancada!" },
    { valor: "3", saida: "Porta trancada!" }
  ],
  dica: "\"Maior que\" é um símbolo só. Repare que com energia = 5 a porta deve continuar trancada."
});
FC.DESAFIOS.saida_cozinha.treino = {
  titulo: "Treino: maior que",
  historia: "Uma conta de pontos para pegar o jeito do \"maior que\".",
  objetivo: "Encaixe o operador para passar quando os pontos forem <b>maiores que 5</b>.",
  codigo: "pontos = 9\n\nif pontos ___ 5:\n    print(\"Passou\")\nelse:\n    print(\"Não passou\")\n",
  variavel: "pontos",
  blocos: [">", "<", "=="],
  solucao: ">",
  testes: [
    { valor: "9", saida: "Passou" },
    { valor: "5", saida: "Não passou" },
    { valor: "2", saida: "Não passou" }
  ],
  dica: "O símbolo > aponta para o lado maior. Com 5 pontos não passa: 5 não é maior que 5."
};

