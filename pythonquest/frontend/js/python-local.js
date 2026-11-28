/* Roda o Python do aluno no navegador (Skulpt), só com os exemplos visíveis, para ele experimentar.
   Isto NÃO corrige nem conta tentativa: a correção oficial é no servidor, com os casos escondidos. */

function disponivel() { return typeof window.Sk !== 'undefined'; }

function rodar(codigo, entradas = []) {
  if (!disponivel()) return Promise.reject(new Error('O Python do navegador não carregou. Recarregue a página.'));
  let saida = '';
  const fila = [...entradas];
  Sk.configure({
    output: t => { saida += t; },
    read: nome => {
      if (Sk.builtinFiles === undefined || Sk.builtinFiles.files[nome] === undefined) throw new Error(`Arquivo não encontrado: ${nome}`);
      return Sk.builtinFiles.files[nome];
    },
    inputfun: () => {
      if (!fila.length) throw new Sk.builtin.EOFError('o programa pediu mais input() do que o exemplo tem');
      return fila.shift();
    },
    inputfunTakesPrompt: false,
    __future__: Sk.python3,
    execLimit: 3000
  });
  return Sk.misceval.asyncToPromise(() => Sk.importMainWithBody('<stdin>', false, codigo, true)).then(() => saida);
}

function traduzir(erro) {
  const texto = String(erro && erro.toString ? erro.toString() : erro);
  if (/TimeLimitError/.test(texto)) return 'O código demorou demais. Algum laço nunca termina?';
  return texto.replace(/ on line (\d+)/, ' (linha $1)');
}

function trocarVariavel(codigo, variavel, valor) {
  const re = new RegExp('^[ \\t]*' + variavel + '[ \\t]*=.*$', 'm');
  if (!re.test(codigo)) throw new Error(`Mantenha a linha "${variavel} = ..." no código.`);
  return codigo.replace(re, () => `${variavel} = ${valor}`);
}

/* Devolve [{ entrada, esperado, obtido, erro }] para cada exemplo visível. */
export async function executarExemplos(exercicio, programa) {
  const resultados = [];
  for (const exemplo of exercicio.exemplos) {
    try {
      let obtido;
      if (exercicio.modo_teste === 'variavel') {
        obtido = await rodar(trocarVariavel(programa, exercicio.variavel, exemplo.entrada));
      } else if (exercicio.modo_teste === 'funcao') {
        const chamada = `\n__r = ${exercicio.funcao}(*${exemplo.entrada})\nprint(repr(__r))\n`;
        const saida = await rodar(programa + chamada);
        const linhas = saida.trimEnd().split('\n');
        obtido = linhas[linhas.length - 1] || '';
      } else {
        obtido = await rodar(programa, exemplo.entrada.split('\n'));
      }
      resultados.push({ ...exemplo, obtido: obtido.replace(/\r/g, '').trimEnd() });
    } catch (erro) {
      resultados.push({ ...exemplo, obtido: '', erro: traduzir(erro) });
    }
  }
  return resultados;
}
