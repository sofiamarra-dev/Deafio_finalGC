/* Roda o Python do aluno (Skulpt) e confere a saída com os testes de cada desafio. */
window.FC = window.FC || {};

FC.python = {
  disponivel() { return typeof Sk !== 'undefined'; },

  /* Executa um programa e devolve { saida }. Rejeita com o erro do Python se algo der errado. */
  rodar(codigo) {
    if (!this.disponivel()) return Promise.reject('O interpretador de Python não carregou. Recarregue a página e tente de novo.');
    let saida = '';
    Sk.configure({
      output: t => { saida += t; },
      read: nome => {
        if (Sk.builtinFiles === undefined || Sk.builtinFiles.files[nome] === undefined) throw "Arquivo não encontrado: '" + nome + "'";
        return Sk.builtinFiles.files[nome];
      },
      __future__: Sk.python3,
      execLimit: 2000 // evita travar a página com um laço que nunca termina
    });
    return Sk.misceval.asyncToPromise(() => Sk.importMainWithBody('<stdin>', false, codigo, true)).then(() => ({ saida }));
  },

  /* Roda o código do aluno uma vez para cada teste do desafio, trocando o valor da variável.
     Devolve [{ valor, esperado, obtido, ok }]. */
  executarTestes(desafio, codigo) {
    const re = new RegExp('^[ \\t]*' + desafio.variavel + '[ \\t]*=.*$', 'm');
    if (!re.test(codigo)) return Promise.reject('Mantenha a linha "' + desafio.variavel + ' = ..." no começo do código.');
    let cadeia = Promise.resolve([]);
    desafio.testes.forEach(t => {
      cadeia = cadeia.then(acumulado => {
        const teste = codigo.replace(re, () => desafio.variavel + ' = ' + t.valor);
        return this.rodar(teste).then(r => {
          const obtido = r.saida.replace(/\r/g, '').trim();
          acumulado.push({ valor: t.valor, esperado: t.saida, obtido: obtido, ok: obtido === t.saida });
          return acumulado;
        });
      });
    });
    return cadeia;
  },

  /* Transforma o erro do Python em uma frase que ajude o aluno. */
  traduzirErro(err) {
    const m = String(err && err.toString ? err.toString() : err);
    if (/interpretador|Mantenha a linha/.test(m)) return m;
    if (/TimeLimitError/.test(m)) return 'O código demorou demais. Algum laço nunca termina? Tente outro bloco.';
    if (/SyntaxError|ParseError/.test(m)) return 'Esse bloco não encaixa aí (erro de sintaxe). Tente outro. Detalhe: ' + m;
    if (/NameError/.test(m)) return 'Esse bloco usa um nome que não existe no código. Tente outro. Detalhe: ' + m;
    if (/IndexError/.test(m)) return 'Esse bloco aponta para uma posição que não existe na lista. Tente outro. Detalhe: ' + m;
    if (/TypeError|AttributeError/.test(m)) return 'Esse bloco não funciona com esse tipo de valor. Tente outro. Detalhe: ' + m;
    return 'Erro ao executar: ' + m;
  }
};
