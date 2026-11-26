/* Janela do desafio: mostra a história, os blocos, roda os testes e avisa o jogo do resultado. */
window.FC = window.FC || {};

(function () {
  const $ = id => document.getElementById(id);
  const janela = $('modal'), resultado = $('result'), dica = $('chHint'), botaoDica = $('hintBtn'), botaoRodar = $('run'),
        botaoIA = $('iaBtn'), dicaIA = $('iaDica');
  let desafioAtual = null, ouvintes = null, tentativasAqui = [];

  const mostrarSaida = (texto, classe) => { resultado.className = 'result' + (classe ? ' ' + classe : ''); resultado.textContent = texto; };

  FC.painel = {
    aberto: false,

    /* ouvintes: { aoTentar(ok, nota, codigo, desafio, semBloco) -> texto opcional para mostrar, aoResolver() } */
    abrir(desafio, cb) {
      desafioAtual = desafio; ouvintes = cb;
      $('chTitle').textContent = desafio.titulo;
      $('chStory').textContent = desafio.historia;
      $('chGoal').innerHTML = desafio.objetivo;
      $('chTests').textContent = desafio.tipo === 'prever'
        ? 'O jogo roda o código de verdade e compara com a sua resposta.'
        : 'O jogo testa seu código com ' + desafio.testes.map(t => desafio.variavel + ' = ' + t.valor).join(', ') + '.';
      $('chTipo').textContent = { lacuna: 'Complete o código', duplo: 'Complete os dois espaços', ordenar: 'Coloque em ordem', prever: 'Preveja a saída' }[desafio.tipo || 'lacuna'];
      dica.textContent = desafio.dica; dica.hidden = true; botaoDica.textContent = 'Ver dica';
      tentativasAqui = [];
      dicaIA.hidden = true; dicaIA.textContent = '';
      botaoIA.hidden = !FC.ia.disponivel; botaoIA.disabled = true; botaoIA.title = 'Tente uma vez antes de pedir ajuda';
      FC.blocos.montar(desafio);
      mostrarSaida('A saída do programa aparece aqui.');
      FC.narrador.abrir(cb.id, desafio, {
        aoResponder(ok, primeira) { if (cb.aoConceito) cb.aoConceito(ok, primeira); },
        aoLiberar() { const p = $('palette'); p.classList.remove('chegou'); void p.offsetWidth; p.classList.add('chegou'); }
      });
      this.aberto = true;
      janela.hidden = false;
    },

    fechar() { this.aberto = false; janela.hidden = true; FC.narrador.esconder(); }
  };

  $('close').addEventListener('click', () => FC.painel.fechar());
  $('reset').addEventListener('click', () => { FC.blocos.limpar(); mostrarSaida('A saída do programa aparece aqui.'); });
  botaoDica.addEventListener('click', () => { dica.hidden = !dica.hidden; botaoDica.textContent = dica.hidden ? 'Ver dica' : 'Esconder dica'; });

  /* Guarda cada tentativa (bloco e resultado) para a IA saber o que o aluno já tentou. */
  function lembrar(bloco, resultado) {
    tentativasAqui.push({ bloco: bloco, resultado: resultado });
    botaoIA.disabled = false; botaoIA.title = '';
  }

  botaoIA.addEventListener('click', () => {
    const d = desafioAtual;
    if (!d || botaoIA.disabled) return;
    botaoIA.disabled = true;
    dicaIA.hidden = false; dicaIA.textContent = 'Pensando…';
    FC.ia.pedirDica({ desafio: d, objetivo: $('chGoal').textContent, tentativas: tentativasAqui }).then(texto => {
      dicaIA.textContent = texto;
      setTimeout(() => { botaoIA.disabled = false; }, 6000);
    }, err => {
      dicaIA.textContent = err.mensagem;
      dica.hidden = false; botaoDica.textContent = 'Esconder dica';   // sem IA, mostra a dica fixa
      setTimeout(() => { botaoIA.disabled = false; }, err.limite ? 15000 : 2000);
    });
  });

  botaoRodar.addEventListener('click', () => {
    const d = desafioAtual;
    if (!d) return;
    if (!FC.blocos.completo()) {
      mostrarSaida(FC.blocos.mensagemIncompleta(), 'bad');
      ouvintes.aoTentar(false, 'sem bloco encaixado', FC.blocos.codigoFinal(d), d, true);
      return;
    }
    const codigo = FC.blocos.codigoFinal(d);
    botaoRodar.disabled = true;
    FC.blocos.verificar(d).then(v => {
      if (v.primeiroErro) lembrar(FC.blocos.resumo(), v.acertos + ' de ' + v.total + ' testes. Primeiro erro: ' + v.primeiroErro);
      if (v.acertos === v.total) {
        mostrarSaida(v.linhas.join('\n') + '\n\nDesafio resolvido!', 'ok');
        ouvintes.aoTentar(true, v.acertos + ' de ' + v.total + ' testes', codigo, d);
        ouvintes.aoResolver();
        setTimeout(() => FC.painel.fechar(), 1100);
      } else {
        const extra = ouvintes.aoTentar(false, v.acertos + ' de ' + v.total + ' testes', codigo, d);
        mostrarSaida(v.linhas.join('\n') + '\n\n' + (d.tipo === 'prever' ? 'Não é isso que o código mostra. Leia de novo, linha por linha.' : v.acertos + ' de ' + v.total + ' testes passaram. Tente de novo.') + (extra ? '\n\n' + extra : ''), 'bad');
      }
    }).catch(err => {
      const traduzido = FC.python.traduzirErro(err);
      lembrar(FC.blocos.resumo(), 'erro ao executar: ' + traduzido);
      const extra = ouvintes.aoTentar(false, 'erro de execução', codigo, d);
      mostrarSaida(traduzido + (extra ? '\n\n' + extra : ''), 'bad');
    }).then(() => { botaoRodar.disabled = false; });
  });
})();
