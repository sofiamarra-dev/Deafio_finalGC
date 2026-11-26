/* Narrador: um personagem aparece à esquerda dos desafios mais difíceis, segurando os blocos de código.
   Para receber os blocos, o jogador responde uma pergunta de conceito (campo `narrador` do desafio).
   Errou: o narrador explica em uma frase e deixa tentar de novo. Acertou: os blocos voam para a bandeja. */
window.FC = window.FC || {};

FC.narrador = (function () {
  const $ = id => document.getElementById(id);
  let liberados = {};      // desafios cujos blocos já foram liberados nesta partida
  let seq = 0;

  const FIGURAS = {
    cuca: {
      nome: 'Cuca, a cozinheira', pal: { w: '#f4efe4', W: '#cfc9bb', h: '#6b3b22', s: '#e8b48a', S: '#c98f66', k: '#1c1420', r: '#c0453f', a: '#f4efe4' },
      linhas: [
        '.....wwwwww.....', '....wwwwwwww....', '...wwwWwwWwww...', '...wwwwwwwwww...', '....WWWWWWWW....',
        '....hhhhhhhh....', '...hhsssssssshh.', '...hssksskssh...', '...hsssssssSh...', '....sssSSsss....',
        '.....ssssss.....', '...rrrrrrrrrr...', '..rrraaaaaarrr..', '..srraaaaaarrs..', '...raaaaaaaar...',
        '...raaaaaaaar...', '...rrrrrrrrrr...', '....SS....SS....', '....kk....kk....'
      ]
    },
    tiao: {
      nome: 'Tião, o veterano', pal: { c: '#3a4f8a', C: '#27365f', s: '#d9a37a', S: '#b3805a', k: '#1c1420', b: '#6b5a4a', w: '#f4efe4', g: '#4a4a58', p: '#3a3a4a' },
      linhas: [
        '....cccccccc....', '...ccccccccCc...', '..CCCCCCCCCCCC..', '...ssssssssss...', '...ssksssskss...',
        '...ssssSSssss...', '...bssssssssb...', '....bbbSSbbb....', '.....bbbbbb.....', '..wwgwwgwwgwwg..',
        '..gwwgwwgwwgww..', '..ssgwwgwwgwss..', '..wwgwwgwwgwwg..', '..gwwgwwgwwgww..', '..wwgwwgwwgwwg..',
        '...pppppppppp...', '...pppp..pppp...', '...pppp..pppp...', '...kkkk..kkkk...'
      ]
    }
  };

  /* Desenha o narrador de corpo inteiro, com os blocos de código na mão (pilha à direita). */
  function figura(quem, k) {
    const f = FIGURAS[quem] || FIGURAS.cuca;
    const c = document.createElement('canvas');
    c.width = 22 * k; c.height = 19 * k; c.className = 'narr-sprite';
    const x = c.getContext('2d');
    f.linhas.forEach((linha, j) => [...linha.padEnd(16, '.')].forEach((ch, i) => {
      if (ch === '.') return;
      x.fillStyle = f.pal[ch]; x.fillRect(i * k, j * k, k, k);
    }));
    // pilha de blocos na mão direita
    [['#e8b04a', '#8a5f12', 11], ['#5ad1e6', '#1f6f80', 13], ['#e8b04a', '#8a5f12', 15]].forEach(b => {
      x.fillStyle = b[1]; x.fillRect(16 * k, b[2] * k, 6 * k, 2 * k);
      x.fillStyle = b[0]; x.fillRect(16 * k, b[2] * k, 6 * k, 2 * k - Math.max(1, k >> 1));
      x.fillStyle = '#14101f'; x.fillRect(17 * k, b[2] * k + k * .5, 3 * k, Math.max(1, k >> 1));
    });
    x.fillStyle = f.pal.s; x.fillRect(15 * k, 12 * k, 2 * k, k);   // a mão segurando a pilha
    return c;
  }

  const embaralhar = a => { const v = a.slice(); for (let i = v.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [v[i], v[j]] = [v[j], v[i]]; } return v; };

  return {
    figura: figura,
    reiniciar() { liberados = {}; },
    liberado(id) { return !!liberados[id]; },
    /* Mostra o narrador para o desafio `d` (id `id`). cb.aoResponder(ok, primeira) a cada resposta; cb.aoLiberar() ao acertar.
       Devolve true se o desafio ficou travado esperando a resposta. */
    abrir(id, d, cb) {
      const n = d.narrador, caixa = $('narrador'), card = $('modal').querySelector('.card');
      if (!n || liberados[id]) { caixa.hidden = true; card.classList.remove('travado'); return false; }
      const minha = ++seq;
      let primeira = true;
      caixa.hidden = false; card.classList.add('travado');
      const fig = $('narrFig'); fig.innerHTML = ''; fig.appendChild(figura(n.quem, 6));
      $('narrNome').textContent = (FIGURAS[n.quem] || FIGURAS.cuca).nome;
      $('narrTexto').textContent = n.fala;
      $('narrPergunta').textContent = n.pergunta;
      const ret = $('narrRetorno'); ret.textContent = ''; ret.className = 'narr-retorno';
      const op = $('narrOpcoes'); op.innerHTML = '';
      embaralhar(n.opcoes.map((t, i) => ({ t: t, ok: i === n.certa }))).forEach(o => {
        const b = document.createElement('button'); b.type = 'button'; b.className = 'narr-op'; b.textContent = o.t;
        b.addEventListener('click', () => {
          if (minha !== seq || b.disabled) return;
          if (o.ok) {
            liberados[id] = true;
            op.querySelectorAll('button').forEach(x => { x.disabled = true; });
            b.classList.add('certa');
            ret.className = 'narr-retorno ok';
            ret.textContent = primeira ? 'Isso mesmo! Aqui estão os blocos.' : 'Agora sim. Aqui estão os blocos.';
            cb.aoResponder(true, primeira);
            fig.classList.add('entrega');
            setTimeout(() => { if (minha !== seq) return; caixa.hidden = true; fig.classList.remove('entrega'); card.classList.remove('travado'); cb.aoLiberar(); }, 950);
          } else {
            b.disabled = true; b.classList.add('errada');
            ret.className = 'narr-retorno ruim';
            ret.textContent = n.explicacao + ' Tente outra resposta.';
            if (primeira) cb.aoResponder(false, true);
            primeira = false;
          }
        });
        op.appendChild(b);
      });
      return true;
    },
    esconder() { seq++; $('narrador').hidden = true; $('modal').querySelector('.card').classList.remove('travado'); }
  };
})();
