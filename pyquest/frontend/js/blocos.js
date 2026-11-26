/* Quebra-cabeças de código. Cada desafio tem um "tipo":
   "lacuna" (padrão): um espaço ___ no código e blocos para encaixar;
   "duplo":   dois (ou mais) espaços ___ para preencher com blocos diferentes;
   "ordenar": as linhas do programa vêm embaralhadas e o aluno coloca na ordem certa;
   "prever":  o código está pronto e o aluno escolhe o que ele mostra na tela (o jogo roda o código de verdade para conferir). */
window.FC = window.FC || {};

(function () {
  const vista = document.getElementById('codeview');
  const bandeja = document.getElementById('palette');
  const ajuda = document.getElementById('chAjuda');
  let d = null, tipo = 'lacuna', valores = [], ativo = 0, ignorarClique = false, lista = null;

  const esc = t => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  /* Pinta palavras-chave, funções, textos e números. */
  function colorir(t) {
    return esc(t).replace(
      /("[^"]*")|\b(if|elif|else|for|in|while|def|return|and|or|not|True|False|break|continue)\b|\b(print|range|len)\b|\b(\d+)\b/g,
      (m, texto, kw, fn, num) => texto ? '<span class="str">' + texto + '</span>'
        : kw ? '<span class="kw">' + kw + '</span>'
        : fn ? '<span class="fn">' + fn + '</span>'
        : '<span class="num">' + num + '</span>');
  }

  const espacos = () => Array.prototype.slice.call(vista.querySelectorAll('.slot'));

  function atualizar() {
    espacos().forEach((sl, i) => {
      const v = valores[i];
      sl.textContent = v === null || v === undefined ? '?' : v;
      sl.classList.toggle('filled', v !== null && v !== undefined);
      sl.classList.toggle('longo', typeof v === 'string' && v.indexOf('\n') !== -1);
    });
    Array.prototype.forEach.call(bandeja.children, b => b.classList.toggle('used', valores.indexOf(b.dataset.v) !== -1));
  }

  function encaixar(v, i) {
    if (i === undefined) { i = valores.indexOf(null); if (i < 0) i = ativo; }
    valores[i] = v; ativo = i; atualizar();
  }

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
          const alvo = sobreEspaco(ev.clientX, ev.clientY);
          espacos().forEach(sl => sl.classList.toggle('over', sl === alvo));
        }
      }
      function soltar(ev) {
        b.removeEventListener('pointermove', mover);
        b.removeEventListener('pointerup', soltar);
        b.removeEventListener('pointercancel', soltar);
        espacos().forEach(sl => sl.classList.remove('over'));
        if (arrastou) {
          fantasma.remove();
          ignorarClique = true;
          const alvo = ev.type === 'pointerup' ? sobreEspaco(ev.clientX, ev.clientY) : null;
          if (alvo) encaixar(b.dataset.v, +alvo.dataset.i);
          setTimeout(() => { ignorarClique = false; }, 0);
        }
      }
      b.addEventListener('pointermove', mover);
      b.addEventListener('pointerup', soltar);
      b.addEventListener('pointercancel', soltar);
    });
    b.addEventListener('click', () => { if (!ignorarClique) encaixar(b.dataset.v); });
  }

  /* ---- tipo "ordenar": linhas que se arrastam (ou sobem e descem pelos botões) ---- */
  function linhaOrdenavel(texto) {
    const li = document.createElement('li');
    li.className = 'ord'; li.dataset.t = texto;
    li.innerHTML = '<span class="alca" aria-hidden="true">⠿</span><code class="cod"></code><span class="setas"><button type="button" class="sobe" aria-label="Subir linha">▲</button><button type="button" class="desce" aria-label="Descer linha">▼</button></span>';
    li.querySelector('.cod').innerHTML = colorir(texto);
    li.querySelector('.sobe').addEventListener('click', () => { const a = li.previousElementSibling; if (a) lista.insertBefore(li, a); });
    li.querySelector('.desce').addEventListener('click', () => { const p = li.nextElementSibling; if (p) lista.insertBefore(p, li); });
    li.addEventListener('pointerdown', e => {
      if (e.target.closest('button')) return;
      e.preventDefault();
      li.classList.add('arrastando');   // os eventos ficam na janela: mover o item no DOM soltaria uma captura de ponteiro
      const mover = ev => {
        const irmaos = Array.prototype.slice.call(lista.children).filter(x => x !== li);
        const alvo = irmaos.find(x => { const r = x.getBoundingClientRect(); return ev.clientY < r.top + r.height / 2; });
        if (alvo) { if (li.nextElementSibling !== alvo) lista.insertBefore(li, alvo); } else lista.appendChild(li);
      };
      const soltar = () => { li.classList.remove('arrastando'); window.removeEventListener('pointermove', mover); window.removeEventListener('pointerup', soltar); window.removeEventListener('pointercancel', soltar); };
      window.addEventListener('pointermove', mover); window.addEventListener('pointerup', soltar); window.addEventListener('pointercancel', soltar);
    });
    return li;
  }

  const ordemAtual = () => lista ? Array.prototype.map.call(lista.children, li => li.dataset.t) : [];

  FC.blocos = {
    /* Monta a vista do código e a bandeja para um desafio. */
    montar(desafio) {
      d = desafio; tipo = desafio.tipo || 'lacuna'; ativo = 0; lista = null;
      bandeja.innerHTML = ''; vista.innerHTML = '';
      bandeja.hidden = tipo === 'ordenar';
      const total = tipo === 'prever' ? 1 : (desafio.codigo.match(/___/g) || []).length;
      valores = []; for (let i = 0; i < total; i++) valores.push(null);

      if (tipo === 'ordenar') {
        (desafio.prefixo || '').replace(/\n+$/, '').split('\n').filter(Boolean).forEach(linha => {
          const ln = document.createElement('span'); ln.className = 'ln fixa'; ln.innerHTML = colorir(linha); vista.appendChild(ln);
        });
        lista = document.createElement('ol'); lista.className = 'ordem'; lista.setAttribute('aria-label', 'Linhas do programa, na ordem atual');
        desafio.blocos.forEach(l => lista.appendChild(linhaOrdenavel(l)));
        vista.appendChild(lista);
        ajuda.textContent = 'Arraste as linhas (ou use as setas ▲ ▼) até o programa ficar na ordem certa. A indentação já está pronta.';
        return;
      }

      let n = 0;
      desafio.codigo.replace(/\n+$/, '').split('\n').forEach(linha => {
        const ln = document.createElement('span');
        ln.className = 'ln';
        const partes = linha.split('___');
        let html = colorir(partes[0]);
        for (let k = 1; k < partes.length; k++) html += '<button type="button" class="slot" data-i="' + (n++) + '" aria-label="Espaço vazio ' + n + '"></button>' + colorir(partes[k]);
        ln.innerHTML = html || ' ';
        vista.appendChild(ln);
      });
      if (tipo === 'prever') {
        const saida = document.createElement('span');
        saida.className = 'ln saida-prev';
        saida.innerHTML = '<span class="rot">O programa mostra:</span> <button type="button" class="slot" data-i="0" aria-label="Sua resposta"></button>';
        vista.appendChild(saida);
      }
      espacos().forEach(sl => sl.addEventListener('click', () => { valores[+sl.dataset.i] = null; ativo = +sl.dataset.i; atualizar(); }));
      desafio.blocos.forEach(v => {
        const b = document.createElement('button');
        b.type = 'button'; b.className = 'blk' + (v.indexOf('\n') !== -1 ? ' multi' : ''); b.textContent = v; b.dataset.v = v;
        ligarBloco(b);
        bandeja.appendChild(b);
      });
      ajuda.textContent = tipo === 'prever'
        ? 'Leia o código com calma, pense no que ele mostra na tela e toque na resposta (ou arraste até o espaço tracejado).'
        : total > 1
          ? 'Arraste cada bloco até um espaço tracejado, ou toque no bloco para encaixar no próximo espaço livre. Toque no espaço preenchido para tirar.'
          : 'Arraste um bloco até o espaço tracejado, ou toque no bloco para encaixar. Toque no bloco encaixado para tirar.';
      atualizar();
    },

    /* Todos os espaços preenchidos? (no tipo "ordenar" sempre vale: a ordem atual já é uma resposta) */
    completo() { return tipo === 'ordenar' || valores.every(v => v !== null); },
    mensagemIncompleta() {
      return tipo === 'prever' ? 'Escolha o que você acha que o programa mostra.'
        : valores.length > 1 ? 'Ainda há espaços vazios. Preencha todos com blocos.' : 'O espaço vazio ainda está sem bloco. Arraste ou toque em um bloco.';
    },
    limpar() {
      if (tipo === 'ordenar') { lista.innerHTML = ''; d.blocos.forEach(l => lista.appendChild(linhaOrdenavel(l))); return; }
      valores = valores.map(() => null); ativo = 0; atualizar();
    },

    /* O que o aluno montou, em uma frase curta (para o registro e para a IA). */
    resumo() {
      if (tipo === 'ordenar') return 'ordem: ' + ordemAtual().map(l => l.trim()).join(' / ');
      return valores.map(v => v === null ? '___' : String(v).replace(/\n/g, ' / ')).join(' | ');
    },

    /* Código completo que será executado (no tipo "prever", o próprio código do desafio). */
    codigoFinal(desafio) {
      desafio = desafio || d;
      const t = desafio.tipo || 'lacuna';
      if (t === 'ordenar') return (desafio.prefixo || '') + ordemAtual().join('\n') + '\n';
      if (t === 'prever') return desafio.codigo;
      let i = 0;
      return desafio.codigo.replace(/___/g, () => { const v = valores[i++]; return v === null || v === undefined ? '___' : v; });
    },

    /* O código como o aluno vê no começo (sem entregar a resposta), para a IA. */
    codigoMostrado(desafio) {
      return (desafio.tipo || 'lacuna') === 'ordenar' ? (desafio.prefixo || '') + desafio.blocos.join('\n') + '\n' : desafio.codigo;
    },

    /* Roda tudo e devolve { linhas: [texto], acertos, total, primeiroErro } */
    verificar(desafio) {
      const t = desafio.tipo || 'lacuna';
      if (t === 'prever') {
        const resposta = valores[0];
        return FC.python.rodar(desafio.codigo).then(r => {
          const real = r.saida.replace(/\r/g, '').trim(), ok = resposta === real;
          return {
            // errou: não mostra o que o código imprime de verdade (seria entregar a resposta)
            linhas: (ok ? ['O código mostra: ' + (real ? real.replace(/\n/g, ' / ') : '(nada)')] : []).concat(['Sua resposta: ' + String(resposta).replace(/\n/g, ' / ') + '  ' + (ok ? '✔' : '✘')]),
            acertos: ok ? 1 : 0, total: 1,
            primeiroErro: ok ? null : 'o aluno respondeu ' + JSON.stringify(String(resposta).replace(/\n/g, ' / ')) + ' e errou'
          };
        });
      }
      const resumo = s => s.replace(/\n/g, ' / ');
      return FC.python.executarTestes(desafio, this.codigoFinal(desafio)).then(res => {
        const falha = res.find(r => !r.ok);
        return {
          linhas: res.map(r => desafio.variavel + ' = ' + r.valor + ' → ' + (r.obtido ? resumo(r.obtido) : '(sem saída)') + '  ' + (r.ok ? '✔' : '✘ esperado: ' + resumo(r.esperado))),
          acertos: res.filter(r => r.ok).length, total: res.length,
          primeiroErro: falha ? desafio.variavel + ' = ' + falha.valor + ', esperado "' + resumo(falha.esperado) + '", obtido "' + (falha.obtido ? resumo(falha.obtido) : '(sem saída)') + '"' : null
        };
      });
    }
  };
})();
