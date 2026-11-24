/* Blocos de encaixar: mostra o código com um espaço vazio e a bandeja de blocos para arrastar ou tocar. */
window.FC = window.FC || {};

(function () {
  const vista = document.getElementById('codeview');
  const bandeja = document.getElementById('palette');
  let valor = null;
  let ignorarClique = false;

  const esc = t => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  /* Pinta palavras-chave, funções, textos e números. */
  function colorir(t) {
    return esc(t).replace(
      /("[^"]*")|\b(if|elif|else|for|in|while|def|return|and|or|not|True|False)\b|\b(print|range|len)\b|\b(\d+)\b/g,
      (m, texto, kw, fn, num) => texto ? '<span class="str">' + texto + '</span>'
        : kw ? '<span class="kw">' + kw + '</span>'
        : fn ? '<span class="fn">' + fn + '</span>'
        : '<span class="num">' + num + '</span>');
  }

  const espaco = () => document.getElementById('slot');

  function atualizar() {
    const sl = espaco();
    if (!sl) return;
    sl.textContent = valor === null ? '?' : valor;
    sl.classList.toggle('filled', valor !== null);
    Array.prototype.forEach.call(bandeja.children, b => b.classList.toggle('used', b.dataset.v === valor));
  }

  function encaixar(v) { valor = v; atualizar(); }

  function ligarBloco(b) {
    b.addEventListener('pointerdown', e => {
      if (b.classList.contains('used')) return;
      const x0 = e.clientX, y0 = e.clientY;
      let fantasma = null, arrastou = false;
      try { b.setPointerCapture(e.pointerId); } catch (err) { /* sem captura, tudo bem */ }
      const sobreEspaco = (x, y) => { const t = document.elementFromPoint(x, y); return t && t.closest ? t.closest('.slot') : null; };

      function mover(ev) {
        if (!arrastou && Math.hypot(ev.clientX - x0, ev.clientY - y0) > 6) {
          arrastou = true;
          fantasma = b.cloneNode(true);
          fantasma.classList.add('ghost');
          document.body.appendChild(fantasma);
        }
        if (arrastou) {
          fantasma.style.left = ev.clientX + 'px';
          fantasma.style.top = ev.clientY + 'px';
          const sl = espaco();
          if (sl) sl.classList.toggle('over', sobreEspaco(ev.clientX, ev.clientY) === sl);
        }
      }
      function soltar(ev) {
        b.removeEventListener('pointermove', mover);
        b.removeEventListener('pointerup', soltar);
        b.removeEventListener('pointercancel', soltar);
        const sl = espaco();
        if (sl) sl.classList.remove('over');
        if (arrastou) {
          fantasma.remove();
          ignorarClique = true;
          if (ev.type === 'pointerup' && sl && sobreEspaco(ev.clientX, ev.clientY) === sl) encaixar(b.dataset.v);
          setTimeout(() => { ignorarClique = false; }, 0);
        }
      }
      b.addEventListener('pointermove', mover);
      b.addEventListener('pointerup', soltar);
      b.addEventListener('pointercancel', soltar);
    });
    b.addEventListener('click', () => { if (!ignorarClique) encaixar(b.dataset.v); });
  }

  FC.blocos = {
    /* Monta a vista do código e a bandeja para um desafio. */
    montar(desafio) {
      valor = null;
      bandeja.innerHTML = '';
      vista.innerHTML = '';
      desafio.codigo.replace(/\n+$/, '').split('\n').forEach(linha => {
        const ln = document.createElement('span');
        ln.className = 'ln';
        const partes = linha.split('___');
        let html = colorir(partes[0]);
        if (partes.length > 1) html += '<button type="button" class="slot" id="slot" aria-label="Espaço vazio"></button>' + colorir(partes[1]);
        ln.innerHTML = html || ' ';
        vista.appendChild(ln);
      });
      espaco().addEventListener('click', () => this.limpar());
      desafio.blocos.forEach(v => {
        const b = document.createElement('button');
        b.type = 'button'; b.className = 'blk'; b.textContent = v; b.dataset.v = v;
        ligarBloco(b);
        bandeja.appendChild(b);
      });
      atualizar();
    },

    valor() { return valor; },
    limpar() { valor = null; atualizar(); },
    codigoFinal(desafio) { return desafio.codigo.replace('___', valor === null ? '___' : valor); }
  };
})();
