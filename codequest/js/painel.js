/* Janela do desafio: mostra a história, os blocos, roda os testes e avisa o jogo do resultado. */
window.FC = window.FC || {};

(function () {
  const $ = id => document.getElementById(id);
  const janela = $('modal'), resultado = $('result'), dica = $('chHint'), botaoDica = $('hintBtn'), botaoRodar = $('run');
  let desafioAtual = null, ouvintes = null;

  const mostrarSaida = (texto, classe) => { resultado.className = 'result' + (classe ? ' ' + classe : ''); resultado.textContent = texto; };
  const resumo = s => s.replace(/\n/g, ' / ');

  FC.painel = {
    aberto: false,

    /* ouvintes: { aoTentar(ok, nota, codigo, desafio, semBloco) -> texto opcional para mostrar, aoResolver() } */
    abrir(desafio, cb) {
      desafioAtual = desafio; ouvintes = cb;
      $('chTitle').textContent = desafio.titulo;
      $('chStory').textContent = desafio.historia;
      $('chGoal').innerHTML = desafio.objetivo;
      $('chTests').textContent = 'O jogo testa seu código com ' + desafio.testes.map(t => desafio.variavel + ' = ' + t.valor).join(', ') + '.';
      dica.textContent = desafio.dica; dica.hidden = true; botaoDica.textContent = 'Ver dica';
      FC.blocos.montar(desafio);
      mostrarSaida('A saída do programa aparece aqui.');
      this.aberto = true;
      janela.hidden = false;
    },

    fechar() { this.aberto = false; janela.hidden = true; }
  };

  $('close').addEventListener('click', () => FC.painel.fechar());
  $('reset').addEventListener('click', () => { FC.blocos.limpar(); mostrarSaida('A saída do programa aparece aqui.'); });
  botaoDica.addEventListener('click', () => { dica.hidden = !dica.hidden; botaoDica.textContent = dica.hidden ? 'Ver dica' : 'Esconder dica'; });

  botaoRodar.addEventListener('click', () => {
    const d = desafioAtual;
    if (!d) return;
    if (FC.blocos.valor() === null) {
      mostrarSaida('O espaço vazio ainda está sem bloco. Arraste ou toque em um bloco.', 'bad');
      ouvintes.aoTentar(false, 'sem bloco encaixado', FC.blocos.codigoFinal(d), d, true);
      return;
    }
    const codigo = FC.blocos.codigoFinal(d);
    botaoRodar.disabled = true;
    FC.python.executarTestes(d, codigo).then(res => {
      const linhas = res.map(r => d.variavel + ' = ' + r.valor + ' → ' + (r.obtido ? resumo(r.obtido) : '(sem saída)') + '  ' + (r.ok ? '✔' : '✘ esperado: ' + resumo(r.esperado)));
      const acertos = res.filter(r => r.ok).length;
      if (acertos === res.length) {
        mostrarSaida(linhas.join('\n') + '\n\nDesafio resolvido!', 'ok');
        ouvintes.aoTentar(true, acertos + ' de ' + res.length + ' testes', codigo, d);
        ouvintes.aoResolver();
        setTimeout(() => FC.painel.fechar(), 1100);
      } else {
        const extra = ouvintes.aoTentar(false, acertos + ' de ' + res.length + ' testes', codigo, d);
        mostrarSaida(linhas.join('\n') + '\n\n' + acertos + ' de ' + res.length + ' testes passaram. Tente de novo.' + (extra ? '\n\n' + extra : ''), 'bad');
      }
    }).catch(err => {
      const extra = ouvintes.aoTentar(false, 'erro de execução', codigo, d);
      mostrarSaida(FC.python.traduzirErro(err) + (extra ? '\n\n' + extra : ''), 'bad');
    }).then(() => { botaoRodar.disabled = false; });
  });
})();
