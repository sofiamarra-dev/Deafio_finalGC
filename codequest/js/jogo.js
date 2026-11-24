/* O jogo em si: estado, movimento, relógio, troca de salas, bancada de treino, apagão e desenho de cada quadro. */
window.FC = window.FC || {};

(function () {
  const C = FC.CONFIG, T = C.T;
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const botaoAgir = document.getElementById('act');
  const aviso = document.getElementById('prompt');

  const fundo = document.createElement('canvas'); // a sala parada é desenhada uma vez aqui e copiada a cada quadro
  fundo.width = C.LARGURA; fundo.height = C.ALTURA;
  const vinheta = ctx.createRadialGradient(240, 170, 120, 240, 170, 310);
  vinheta.addColorStop(0, 'rgba(5,6,18,0)'); vinheta.addColorStop(1, 'rgba(5,6,18,.5)');

  const jogador = { x: 0, y: 0, w: 14, h: 10 };
  const e = {
    partida: false, mundo: null, salas: [], sala: null, indice: 0, ultimoTick: Date.now(),
    pontosBanco: 0, pontosSala: 0, errosSala: {},
    teclas: {}, andando: false, olhando: 1, frame: 0,
    tentativas: 0, resolvidos: {}, tempoGasto: 0,
    inicioSala: 0, restante: 1e9, avisou: false,
    portaAberta: false, fim: false, perto: null, fade: null,
    // adaptação: erros seguidos por desafio, erros no jogo todo, bancada de treino da sala e histórico de tentativas
    falhas: {}, erros: {}, bancada: null, historico: []
  };

  const tempoSala = () => C.TEMPO_SEGUNDOS * 1000;
  const paineis = () => e.sala.estacoes.filter(s => !s.saida);
  const faltam = () => paineis().filter(s => !e.resolvidos[s.id]).length;
  /* O relógio e o movimento esperam quando outra página está aberta ou o ranking está na tela. */
  const janelaAberta = () => FC.ranking.aberto || FC.paginas.atual() !== 'jogo';
  const pontosTotal = () => e.pontosBanco + e.pontosSala;
  const resolvidasNaSala = () => paineis().length - faltam();

  /* ---------- salas ---------- */
  /* Começa um mundo (as áreas dele, o personagem, a cor) na área indicada. */
  function iniciarMundo(id, area) {
    e.mundo = FC.mundo(id);
    e.salas = FC.salasDoMundo(id);
    FC.ui.definirMundo(e.mundo);
    e.tentativas = 0; e.resolvidos = {}; e.tempoGasto = 0; e.erros = {}; e.historico = []; e.pontosBanco = 0;
    e.partida = true;
    FC.ui.contarTentativas(0); FC.ui.limparRegistro();
    iniciarSala(Math.min(area || 0, e.salas.length - 1));
  }

  const irParaMundos = () => FC.paginas.ir('mundos');

  function iniciarSala(i) {
    const s = e.salas[i];
    e.indice = i; e.sala = s;
    s.estacoes.forEach(est => { delete e.resolvidos[est.id]; });
    e.pontosSala = 0; e.errosSala = {};   // se a sala for refeita, os pontos dela recomeçam
    FC.ui.mostrarPontos(pontosTotal());
    e.teclas = {}; e.portaAberta = false; e.fim = false; e.avisou = false; e.perto = null; e.fade = null;
    e.bancada = null; e.falhas = {};
    jogador.x = s.inicio.x; jogador.y = s.inicio.y;
    s.pintar(fundo.getContext('2d'));
    FC.efeitos.reiniciar();
    FC.painel.fechar();
    FC.ui.esconderFim();
    FC.ui.entrarNaSala(s, i, e.salas.length);
    FC.ui.resetarRelogio();
    e.inicioSala = Date.now();
    e.restante = tempoSala();
  }

  function sairDaSala() {
    e.tempoGasto += Date.now() - e.inicioSala;
    const bonus = FC.pontos.bonusTempo(e.restante, tempoSala());
    e.pontosBanco += e.pontosSala + bonus; e.pontosSala = 0;
    FC.ui.mostrarPontos(pontosTotal());
    if (e.indice === e.salas.length - 1) { vitoria(); return; }
    if (bonus > 0) FC.ui.toast('+' + bonus + ' pontos de bônus pelo tempo que sobrou.');
    e.teclas = {};
    e.fade = { fase: 'saindo', t: 0, para: e.indice + 1 };
  }

  function vitoria() {
    e.fim = true; e.teclas = {};
    const m = e.mundo, jaFeito = FC.progresso.concluido(m.id);
    FC.progresso.concluir(m.id);
    FC.efeitos.confete(jogador.x, jogador.y);
    FC.ui.definirIntro(m.vitoriaIntro);
    const seg = Math.round(e.tempoGasto / 1000);
    const pior = Object.keys(e.erros).sort((a, b) => e.erros[b] - e.erros[a])[0];
    const dificil = pior ? ' O que mais deu trabalho: ' + FC.DESAFIOS[pior].nome + ' (' + e.erros[pior] + ' erro' + (e.erros[pior] === 1 ? '' : 's') + ').' : '';
    e.pontosBanco += FC.pontos.bonusMundo();
    FC.ui.mostrarPontos(pontosTotal());
    const rank = FC.ranking.registrar({ mundo: m.id, pontos: pontosTotal(), segundos: seg, tentativas: e.tentativas });
    const pontuacao = ' Pontos: ' + pontosTotal() + (rank
      ? ' (' + rank.posicao + 'º lugar no ranking' + (rank.melhorou ? '' : '; sua melhor pontuação continua valendo') + ').'
      : '. Entre com seu nome para aparecer no ranking.');
    const proximo = FC.MUNDOS[FC.MUNDOS.indexOf(m) + 1];
    const novoMundo = proximo && !jaFeito ? ' Novo mundo liberado: ' + proximo.nome + '.' : '';
    setTimeout(() => FC.ui.mostrarFim({
      titulo: m.vitoriaTitulo,
      texto: 'Você passou pelas ' + e.salas.length + ' áreas com ' + e.tentativas + ' tentativa' + (e.tentativas === 1 ? '' : 's') + ' e ' + seg + ' segundos no total.' + pontuacao + dificil + novoMundo,
      botao: 'Jogar de novo',
      aoClicar: reiniciar,
      botao2: 'Ver ranking',
      aoClicar2: () => FC.ranking.abrir(m.id),
      botao3: 'Mapa de mundos',
      aoClicar3: () => { FC.ui.esconderFim(); irParaMundos(); }
    }), 700);
  }

  function tempoEsgotado() {
    e.fim = true; e.teclas = {};
    FC.painel.fechar();
    if (e.mundo.falha === 'alarme') FC.efeitos.alarmar(); else FC.efeitos.explodir();
    const s = e.sala;
    const certos = s.estacoes.filter(x => e.resolvidos[x.id]).length;
    FC.ui.definirIntro(e.mundo.falhaIntro.replace('{sala}', s.nome));
    setTimeout(() => {
      if (e.sala !== s || !e.fim) return;
      FC.ui.mostrarFim({
        titulo: s.falha.titulo,
        texto: s.falha.texto + ' Você resolveu ' + certos + ' de ' + s.estacoes.length + ' desafios nesta sala. Tente de novo, agora você já conhece os painéis.',
        botao: 'Tentar a sala de novo',
        aoClicar: () => iniciarSala(e.indice),
        botao2: 'Mapa de mundos',
        aoClicar2: () => { FC.ui.esconderFim(); irParaMundos(); }
      });
    }, 2300);
  }

  function reiniciar() { iniciarMundo(e.mundo.id, 0); }

  /* ---------- movimento ---------- */
  function sobrepoe(r, nx, ny) {
    return nx + jogador.w > r.x && nx < r.x + r.w && ny + jogador.h > r.y && ny < r.y + r.h;
  }

  function bloqueado(nx, ny) {
    if (nx < 8 || nx + jogador.w > C.COLUNAS * T - 8 || ny + jogador.h > C.LINHAS * T - 6) return true;
    const p = e.sala.porta;
    if (ny < T && !(e.portaAberta && nx >= p.x && nx + jogador.w <= p.x + T)) return true;
    if (e.bancada && sobrepoe(e.sala.bancada, nx, ny)) return true;
    return e.sala.obstaculos.some(o => sobrepoe(o, nx, ny));
  }

  /* ---------- bancada de treino (adaptação) ---------- */
  function estacaoBancada() {
    const b = e.sala.bancada, cx = b.x + b.w / 2;
    return { id: 'treino', treino: true, rotulo: 'Treino', x: cx, y: b.y - 10, raio: 44, balao: { x: cx, y: b.y - 22 } };
  }

  function nomeDe(s) {
    return s.treino ? 'Treino: ' + FC.DESAFIOS[e.bancada.desafio].nome : FC.DESAFIOS[s.id].nome;
  }

  /* Regra: ERROS_PARA_TREINO erros seguidos no mesmo desafio fazem a bancada aparecer com a versão fácil dele. */
  function registrarResultado(id, ok) {
    e.historico.push({ sala: e.sala.id, desafio: id, ok: ok, quando: Date.now() });
    if (ok) { e.falhas[id] = 0; return null; }
    e.erros[id] = (e.erros[id] || 0) + 1;
    e.errosSala[id] = (e.errosSala[id] || 0) + 1;
    e.falhas[id] = (e.falhas[id] || 0) + 1;
    if (e.falhas[id] >= C.ERROS_PARA_TREINO && e.sala.bancada && FC.DESAFIOS[id].treino) return ativarBancada(id);
    return null;
  }

  function ativarBancada(id) {
    e.falhas[id] = 0;
    if (e.bancada && !e.bancada.feito && e.bancada.desafio === id) return null;
    const b = e.sala.bancada;
    e.bancada = { desafio: id, t: 0, feito: false };
    if (sobrepoe(b, jogador.x, jogador.y)) jogador.y = b.y - jogador.h - 2; // tira o rato de cima da bancada
    const nome = FC.DESAFIOS[id].nome;
    FC.ui.chipTreino('Treino: ' + nome, false);
    FC.ui.toast('Está difícil? A bancada de treino apareceu na sala, com uma versão mais fácil de "' + nome + '".');
    return 'Está difícil? Apareceu uma bancada de treino na sala, com uma versão mais fácil deste desafio. Feche esta janela e vá até ela.';
  }

  /* ---------- desafios ---------- */
  function interagir() {
    const s = e.perto;
    if (!s || FC.painel.aberto || e.fim || e.fade) return;
    if (s.saida && faltam() > 0) { FC.ui.toast('O cadeado está sem energia. Resolva os outros desafios da sala primeiro.'); return; }
    const ehTreino = !!s.treino;
    const desafio = ehTreino ? FC.treinoDe(FC.DESAFIOS[e.bancada.desafio]) : FC.DESAFIOS[s.id];
    FC.painel.abrir(desafio, {
      aoTentar(ok, nota, codigo, d, semBloco) {
        e.tentativas++;
        FC.ui.contarTentativas(e.tentativas);
        FC.ui.registrar(ok, nota, codigo, d);
        if (ehTreino || semBloco) return null; // só tentativas de verdade entram na regra
        return registrarResultado(s.id, ok);
      },
      aoResolver() { ehTreino ? treinoFeito() : resolver(s); }
    });
  }

  function treinoFeito() {
    if (e.fim || !e.bancada) return;
    e.bancada.feito = true;
    const nome = FC.DESAFIOS[e.bancada.desafio].nome;
    FC.ui.chipTreino('Treino: ' + nome, true);
    FC.efeitos.confete(jogador.x, jogador.y - 8);
    FC.ui.toast('Treino feito! Agora volte ao desafio: ' + nome + '.');
  }

  function resolver(s) {
    if (e.fim) return; // o tempo acabou enquanto o teste rodava
    e.resolvidos[s.id] = true;
    const ganho = FC.pontos.desafio(e.errosSala[s.id] || 0);
    e.pontosSala += ganho;
    FC.ui.mostrarPontos(pontosTotal());
    FC.ui.marcarPainel(s.id);
    FC.efeitos.confete(s.x, s.y - 14);
    if (s.saida) {
      e.portaAberta = true;
      FC.ui.portaAberta();
      FC.ui.toast('+' + ganho + ' pontos. A porta abriu! Corra!');
    } else if (faltam() === 0) {
      FC.ui.toast('+' + ganho + ' pontos. Tudo ligado! Vá até a porta de saída.');
    } else {
      FC.ui.toast('+' + ganho + ' pontos. ' + FC.DESAFIOS[s.id].nome + ' destravado (' + resolvidasNaSala() + '/' + paineis().length + ').');
    }
  }

  /* ---------- um quadro ---------- */
  function atualizar() {
    FC.efeitos.atualizar();
    if (e.bancada) e.bancada.t++;
    const agora = Date.now();
    if (janelaAberta()) e.inicioSala += agora - e.ultimoTick;   // janela aberta: o relógio da sala espera
    e.ultimoTick = agora;
    const parado = FC.painel.aberto || janelaAberta() || e.fim || e.fade;
    e.andando = false;
    if (!parado) {
      let dx = 0, dy = 0;
      if (e.teclas.left) dx -= C.VELOCIDADE; if (e.teclas.right) dx += C.VELOCIDADE;
      if (e.teclas.up) dy -= C.VELOCIDADE; if (e.teclas.down) dy += C.VELOCIDADE;
      e.andando = !!(dx || dy);
      if (dx) e.olhando = dx > 0 ? 1 : -1;
      if (dx && !bloqueado(jogador.x + dx, jogador.y)) jogador.x += dx;
      if (dy && !bloqueado(jogador.x, jogador.y + dy)) jogador.y += dy;
      if (e.portaAberta && jogador.y < T - 6) sairDaSala();
    }

    if (e.fade) {
      e.fade.t++;
      if (e.fade.fase === 'saindo' && e.fade.t >= 18) { iniciarSala(e.fade.para); e.fade = { fase: 'entrando', t: 0 }; }
      else if (e.fade.fase === 'entrando' && e.fade.t >= 18) { e.fade = null; e.inicioSala = Date.now(); }
    }

    // móvel mais próximo ainda não resolvido (a bancada conta enquanto o treino não foi feito)
    const cx = jogador.x + jogador.w / 2, cy = jogador.y + jogador.h / 2;
    let melhor = 1e9; e.perto = null;
    const candidatas = e.sala.estacoes.filter(s => !e.resolvidos[s.id]);
    if (e.bancada && !e.bancada.feito) candidatas.push(estacaoBancada());
    candidatas.forEach(s => {
      const d = Math.hypot(cx - s.x, cy - s.y);
      if (d < s.raio && d < melhor) { melhor = d; e.perto = s; }
    });
    aviso.hidden = !(e.perto && !FC.painel.aberto && !e.fim && !e.fade);
    if (e.perto) aviso.textContent = 'E: ' + nomeDe(e.perto);
    botaoAgir.disabled = !e.perto || FC.painel.aberto || e.fim || !!e.fade;
    botaoAgir.textContent = e.perto ? 'Interagir: ' + nomeDe(e.perto) : 'Interagir (E)';

    // relógio
    if (!e.fim && !e.fade && !janelaAberta()) {
      const total = tempoSala();
      e.restante = Math.max(0, total - (Date.now() - e.inicioSala));
      FC.ui.atualizarRelogio(e.restante, total);
      if (!e.avisou && total >= 40000 && e.restante <= total * 0.25) { e.avisou = true; FC.ui.toast(e.mundo.aviso); }
      if (e.restante <= 0) tempoEsgotado();
    }
  }

  /* Apagão: fica mais claro a cada painel resolvido; o rato, o lampião, a porta e os painéis ligados têm luz própria. */
  function desenharApagao() {
    const a = e.sala.apagao, total = paineis().length;
    const alpha = a.escuridao * (faltam() / total);
    const luzes = [{ x: jogador.x + jogador.w / 2, y: jogador.y + jogador.h / 2, r: 85 }, { x: e.sala.porta.x + 16, y: 16, r: 46 }].concat(a.luzes || []);
    paineis().forEach(s => { if (e.resolvidos[s.id]) luzes.push({ x: s.x, y: s.y, r: 100 }); });
    FC.desenharEscuro(ctx, alpha, luzes);
  }

  function desenhar() {
    const fx = FC.efeitos, t = fx.t, s = e.sala;
    ctx.save();
    const boom = fx.explodindo() && fx.modo === 'explosao';
    const tremor = boom ? Math.max(0, 9 * (1 - t / 80)) : fx.explodindo() ? 1.5 : (!e.fim && !e.fade && e.restante <= 10000 ? 1.2 : 0);
    if (tremor > 0) ctx.translate((Math.random() - .5) * 2 * tremor, (Math.random() - .5) * 2 * tremor);
    ctx.drawImage(fundo, 0, 0);
    if (s.animar) s.animar(ctx, e.frame);
    FC.desenharPorta(ctx, s, e.portaAberta, resolvidasNaSala(), paineis().length);
    if (e.bancada) FC.desenharBancada(ctx, s.bancada, e.frame, e.bancada.t, e.bancada.feito);
    if (!boom || t < 8) FC.PERSONAGENS[e.mundo.personagem](ctx, jogador, e.frame, e.andando, e.olhando);
    if (s.apagao && !fx.explodindo()) desenharApagao();
    if (!fx.explodindo()) {
      s.estacoes.forEach(est => FC.desenharBalao(ctx, est, {
        frame: e.frame,
        resolvida: !!e.resolvidos[est.id],
        trancada: !!est.saida && faltam() > 0,
        contagem: resolvidasNaSala() + '/' + paineis().length
      }));
      if (e.bancada && !e.bancada.feito && e.bancada.t > 20) FC.desenharBalao(ctx, estacaoBancada(), { frame: e.frame, resolvida: false, trancada: false, contagem: '' });
    }
    fx.desenharExplosao(ctx);
    fx.desenharParticulas(ctx);
    ctx.restore();

    ctx.fillStyle = vinheta; ctx.fillRect(0, 0, C.LARGURA, C.ALTURA);
    if (!e.fim && !e.fade && !janelaAberta() && e.restante <= 10000) { // pulso vermelho nos últimos 10 segundos
      ctx.fillStyle = 'rgba(229,69,47,' + (0.10 + 0.10 * Math.sin(e.frame / 5)) + ')';
      ctx.fillRect(0, 0, C.LARGURA, C.ALTURA);
    }
    if (e.fade) { // escurece ao trocar de sala
      const a = e.fade.fase === 'saindo' ? e.fade.t / 18 : 1 - e.fade.t / 18;
      ctx.fillStyle = 'rgba(5,6,18,' + Math.min(1, Math.max(0, a)) + ')';
      ctx.fillRect(0, 0, C.LARGURA, C.ALTURA);
    }
  }

  function laco() { e.frame++; atualizar(); desenhar(); requestAnimationFrame(laco); }

  /* ---------- teclado e botões ---------- */
  const mapa = { ArrowLeft: 'left', a: 'left', A: 'left', ArrowRight: 'right', d: 'right', D: 'right', ArrowUp: 'up', w: 'up', W: 'up', ArrowDown: 'down', s: 'down', S: 'down' };

  function ligarControles() {
    window.addEventListener('keydown', ev => {
      if (janelaAberta()) return;
      if (FC.painel.aberto) { if (ev.key === 'Escape') FC.painel.fechar(); return; }
      if (e.fim || e.fade) return;
      if (mapa[ev.key]) { e.teclas[mapa[ev.key]] = true; ev.preventDefault(); }
      if (ev.key === 'e' || ev.key === 'E' || ev.key === 'Enter') interagir();
    });
    window.addEventListener('keyup', ev => { if (mapa[ev.key]) e.teclas[mapa[ev.key]] = false; });
    Array.prototype.forEach.call(document.querySelectorAll('[data-dir]'), b => {
      const d = b.dataset.dir;
      b.addEventListener('pointerdown', ev => { ev.preventDefault(); e.teclas[d] = true; });
      ['pointerup', 'pointerleave', 'pointercancel'].forEach(nome => b.addEventListener(nome, () => { e.teclas[d] = false; }));
    });
    botaoAgir.addEventListener('click', interagir);
  }

  FC.jogo = {
    estado: e,
    jogador: jogador,
    temPartida() { return e.partida; },
    /* Começa o mundo escolhido na página de mundos e abre a página do jogo. */
    jogar(id) { iniciarMundo(id, 0); FC.paginas.ir('jogo'); },
    iniciar() {
      ligarControles();
      document.getElementById('verMapa').addEventListener('click', irParaMundos);
      document.getElementById('verRanking').addEventListener('click', () => { if (!FC.ranking.aberto) FC.ranking.abrir(e.mundo.id); });
      document.getElementById('verJogador').addEventListener('click', () => FC.paginas.ir('entrar'));

      // se outro jogador entrar, a partida em andamento era do anterior: encerra
      let ultimo = FC.jogador.atual() && FC.jogador.atual().nome;
      FC.jogador.aoMudar(j => {
        FC.ui.mostrarJogador(j);
        const nome = j && j.nome;
        if (nome !== ultimo) { ultimo = nome; e.partida = false; FC.ui.esconderFim(); }
      });
      FC.paginas.aoEntrar('jogo', () => { if (e.mundo) FC.ui.definirMundo(e.mundo); });

      // o jogo precisa de um mundo carregado para desenhar, mesmo antes de alguém escolher
      const primeiro = C.MUNDO_INICIAL && FC.mundo(C.MUNDO_INICIAL) ? C.MUNDO_INICIAL : FC.MUNDOS[0].id;
      iniciarMundo(primeiro, C.PULAR_MAPA ? C.SALA_INICIAL : 0);
      e.partida = C.PULAR_MAPA;
      if (C.PULAR_MAPA) {                       // URL de teste (?mundo=…&sala=…): vai direto para o jogo
        if (!FC.jogador.identificado()) FC.jogador.entrarComoVisitante();
        if (!/^#jogo/.test(location.hash)) location.hash = 'jogo';
      }
      FC.paginas.iniciar();
      laco();
    }
  };
})();
