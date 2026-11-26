/* Tudo que mexe nos elementos da página fora do desenho: relógio, avisos, lista de painéis, registro. */
window.FC = window.FC || {};

(function () {
  const $ = id => document.getElementById(id);
  const el = {
    tag: $('salaTag'), intro: $('intro'), toast: $('toast'), chips: $('chips'),
    porta: $('doorState'), tentativas: $('tries'), relogio: $('timer'), barra: $('timefill'),
    aviso: $('prompt'), agir: $('act'), log: $('logList'),
    fim: $('end'), fimTitulo: $('endTitle'), fimTexto: $('endText'), fimBotao: $('again'), fimBotao2: $('again2'), fimBotao3: $('again3'),
    titulo: $('titulo'), canvas: $('game')
  };
  let temporizadorToast = null, ultimoSegundo = -1;

  FC.ui = {
    el: el,

    /* Aviso curto sobre o cenário. Se começar com "+N", mostra a moeda e o valor em destaque. */
    toast(msg) {
      const m = /^\+(\d+) (?:pontos?\.?\s*)?(.*)$/.exec(msg);
      el.toast.textContent = '';
      if (m) {
        const coin = document.createElement('i'); coin.className = 'moeda'; coin.setAttribute('aria-hidden', 'true');
        const n = document.createElement('b'); n.textContent = '+' + m[1];
        const resto = document.createElement('span'); resto.textContent = m[2] || 'pontos';
        el.toast.append(coin, n, resto);
      } else el.toast.textContent = msg;
      el.toast.hidden = false;
      clearTimeout(temporizadorToast);
      temporizadorToast = setTimeout(() => { el.toast.hidden = true; }, 3200);
    },

    formatarTempo(ms) {
      const t = Math.ceil(ms / 1000), m = Math.floor(t / 60), s = t % 60;
      return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
    },

    resetarRelogio() { ultimoSegundo = -1; },

    atualizarRelogio(restanteMs, totalMs) {
      const seg = Math.ceil(restanteMs / 1000);
      if (seg === ultimoSegundo && restanteMs > 0) return;
      ultimoSegundo = seg;
      const fracao = restanteMs / totalMs;
      el.relogio.textContent = this.formatarTempo(restanteMs);
      el.relogio.className = 'timer' + (fracao <= 0.25 ? ' crit' : fracao <= 0.5 ? ' warn' : '');
      el.barra.style.width = (fracao * 100) + '%';
      el.barra.className = fracao <= 0.25 ? 'crit' : fracao <= 0.5 ? 'warn' : '';
    },

    /* Placar de pontos (com a moeda): o número sobe contando e a moeda dá uma volta quando ganha pontos. */
    mostrarPontos(n) {
      const b = document.getElementById('pontos'), caixa = document.getElementById('moedas');
      const antes = parseInt(b.textContent, 10) || 0;
      clearInterval(this._conta);
      if (n > antes && FC.musica) FC.musica.efeito('moeda');
      if (n > antes && !(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) {
        let v = antes; const passo = Math.max(1, Math.ceil((n - antes) / 14));
        this._conta = setInterval(() => { v = Math.min(n, v + passo); b.textContent = v; if (v >= n) clearInterval(this._conta); }, 30);
        caixa.classList.remove('sobe'); void caixa.offsetWidth; caixa.classList.add('sobe');
        const m = caixa.querySelector('.moeda'); m.classList.remove('gira'); void m.offsetWidth; m.classList.add('gira');
      } else b.textContent = n;
    },
    /* Botão do jogador no topo: mostra o nome de quem está jogando, ou "Entrar". */
    mostrarJogador(j) {
      const b = document.getElementById('verJogador');
      b.textContent = '';
      if (j) b.appendChild(FC.avatares.canvas(j.avatar, 24, FC.carteira.equipDe(j.nome)));
      b.appendChild(document.createTextNode(j ? ' ' + j.nome + (j.turma ? ' (' + j.turma + ')' : '') : 'Entrar'));
      b.title = j ? 'Trocar de jogador' : 'Entrar com seu nome para aparecer no ranking';
      const perfil = document.getElementById('hudPerfil');
      perfil.innerHTML = ''; perfil.hidden = !j;
      if (j) {
        perfil.appendChild(FC.avatares.canvas(j.avatar, 48, FC.carteira.equipDe(j.nome)));
        const nome = document.createElement('span'); nome.className = 'perfil-nome'; nome.textContent = j.nome;
        perfil.appendChild(nome); perfil.title = j.nome + (j.turma ? ' (' + j.turma + ')' : '');
      }
      document.getElementById('olaJogador').textContent = j ? 'Jogando como ' + j.nome + (j.turma ? ' (' + j.turma + ')' : '') : 'Jogando sem ranking';
    },

    /* Troca título, cor de destaque e descrição da imagem para o mundo atual. */
    definirMundo(m) {
      el.titulo.textContent = m.nome;
      document.documentElement.style.setProperty('--accent', m.cor);
      el.canvas.setAttribute('aria-label', 'Cenário do mundo "' + m.nome + '" com o personagem e uma porta de saída');
    },

    entrarNaSala(sala, indice, total) {
      el.tag.textContent = sala.nome + ', sala ' + (indice + 1) + ' de ' + total;
      el.intro.textContent = sala.introducao + (sala.apagao ? ' Está escuro: cada painel resolvido acende a sala.' : '');
      el.porta.textContent = 'trancada';
      el.toast.hidden = true;
      el.chips.innerHTML = '';
      sala.estacoes.forEach(e => {
        const li = document.createElement('li');
        li.dataset.id = e.id;
        li.textContent = e.rotulo;
        el.chips.appendChild(li);
      });
    },

    marcarPainel(id) {
      const li = el.chips.querySelector('[data-id="' + id + '"]');
      if (li) li.classList.add('done');
    },

    /* Mostra na lista de painéis que a bancada de treino está disponível (ou já foi feita). */
    chipTreino(texto, feito) {
      let li = el.chips.querySelector('[data-id="treino"]');
      if (!li) { li = document.createElement('li'); li.dataset.id = 'treino'; el.chips.appendChild(li); }
      li.textContent = texto;
      li.className = feito ? 'treino done' : 'treino';
    },

    portaAberta() { el.porta.textContent = 'aberta'; },
    definirIntro(texto) { el.intro.textContent = texto; },
    contarTentativas(n) { el.tentativas.textContent = n; },

    limparRegistro() {
      el.log.innerHTML = '<li class="empty">Nenhuma tentativa ainda.</li>';
    },

    registrar(ok, nota, codigo, desafio) {
      const vazio = el.log.querySelector('.empty');
      if (vazio) vazio.remove();
      const hora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const linhas = desafio.codigo.split('\n');
      const i = linhas.findIndex(l => l.indexOf('___') !== -1);
      const linha = (codigo.split('\n')[i] || '').trim();
      const li = document.createElement('li');
      li.innerHTML = '<span></span><span class="who"></span><span class="tag ' + (ok ? 'ok' : 'bad') + '">' + (ok ? 'acertou' : 'errou') + '</span><span></span>';
      li.children[0].textContent = hora;
      li.children[1].textContent = desafio.nome;
      li.children[3].textContent = (linha ? linha + '  ·  ' : '') + nota;
      el.log.insertBefore(li, el.log.firstChild);
    },

    mostrarFim(op) {
      el.fimTitulo.textContent = op.titulo;
      el.fimTexto.textContent = op.texto;
      const caixa = document.getElementById('endMoedas');
      caixa.hidden = op.pontos === undefined;
      if (op.pontos !== undefined) document.getElementById('endPontos').textContent = op.pontos;
      const car = document.getElementById('endCarteira'); car.hidden = !op.carteira; car.textContent = op.carteira || '';
      const res = document.getElementById('endResumo'); res.hidden = !op.resumo;
      if (op.resumo) {
        const r = op.resumo, lista = document.getElementById('resumoLista'); lista.innerHTML = '';
        document.getElementById('resumoSub').textContent = r.itens.length
          ? r.certos + ' de ' + r.total + ' conceitos sem nenhum erro. Estes foram os que mais deram trabalho:'
          : 'Você acertou todos os ' + r.total + ' conceitos sem errar nenhuma vez. Dá para ir ao próximo mundo com segurança.';
        const max = Math.max(1, ...r.itens.map(t => t.erros));
        r.itens.forEach(t => {
          const li = document.createElement('li');
          li.innerHTML = '<span class="r-nome"></span><span class="r-barra" aria-hidden="true"><i></i></span><span class="r-n"></span><span class="r-dica"></span>';
          li.children[0].textContent = t.topico;
          li.children[1].firstChild.style.width = Math.round(100 * t.erros / max) + '%';
          li.children[2].textContent = t.erros + (t.erros === 1 ? ' erro' : ' erros');
          li.children[3].textContent = 'Para revisar: ' + t.dica;
          lista.appendChild(li);
        });
      }
      el.fimBotao.textContent = op.botao;
      el.fimBotao.onclick = op.aoClicar;
      el.fimBotao2.hidden = !op.botao2;
      if (op.botao2) { el.fimBotao2.textContent = op.botao2; el.fimBotao2.onclick = op.aoClicar2; }
      el.fimBotao3.hidden = !op.botao3;
      if (op.botao3) { el.fimBotao3.textContent = op.botao3; el.fimBotao3.onclick = op.aoClicar3; }
      el.fim.hidden = false;
      el.fimBotao.focus();
    },

    esconderFim() { el.fim.hidden = true; }
  };
})();
