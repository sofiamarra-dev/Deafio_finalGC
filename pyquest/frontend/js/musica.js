/* Música e sons do jogo, gerados pelo próprio navegador (Web Audio): não precisa de arquivo de áudio.
   Três trilhas: "menu" (login e mapa), "restaurante" e "prisao". Mais efeitos: moeda, acerto, erro, vitória.
   Para usar uma música sua, ponha o arquivo em frontend/audio/ e aponte em FC.CONFIG.MUSICA_ARQUIVOS (js/config.js).
   Para uma trilha nova, adicione uma entrada em TRILHAS com o id do mundo. */
window.FC = window.FC || {};

(function () {
  const A = FC.armazenamento;
  const NOTAS = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  /* 'C#4' -> número MIDI; '-' ou '' -> pausa. */
  function midi(n) {
    const m = /^([A-G])([#b]?)(\d)$/.exec(n);
    if (!m) return null;
    return 12 * (+m[3] + 1) + NOTAS[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0);
  }
  const freq = m => 440 * Math.pow(2, (m - 69) / 12);
  const compassos = lista => lista.map(s => s.split(/\s+/).map(midi));   // cada compasso = 8 colcheias (ou 4 semínimas no baixo)

  /* Cada trilha: bpm, melodia (8 colcheias por compasso), baixo e se tem chimbal ("hat") ou caixa ("caixa"). */
  const TRILHAS = {
    menu: {
      bpm: 96, onda: 'triangle', volume: 0.16, baixoOnda: 'triangle', baixoVol: 0.2, baixoPorCompasso: 8,
      melodia: compassos([
        'G4 B4 D5 G5 D5 B4 D5 B4', 'E4 G4 B4 E5 B4 G4 B4 G4', 'C5 E5 G5 C6 G5 E5 G5 E5', 'D5 F#5 A5 D6 A5 F#5 A5 F#5',
        'G4 B4 D5 G5 D5 B4 D5 B4', 'E4 G4 B4 E5 B4 G4 B4 G4', 'C5 E5 G5 E5 C5 E5 G5 B5', 'D5 F#5 A5 F#5 D5 - - -'
      ]),
      baixo: compassos([
        'G2 - - - D3 - - -', 'E2 - - - B2 - - -', 'C3 - - - G3 - - -', 'D3 - - - A3 - - -',
        'G2 - - - D3 - - -', 'E2 - - - B2 - - -', 'C3 - - - G3 - - -', 'D3 - - - A2 - - -'
      ]),
      hat: false
    },
    restaurante: {
      bpm: 128, onda: 'square', volume: 0.075, baixoOnda: 'triangle', baixoVol: 0.26, baixoPorCompasso: 4,
      melodia: compassos([
        'E5 - G5 E5 C5 - E5 G5', 'A4 - C5 E5 A5 - G5 E5', 'A4 C5 F5 - F5 E5 D5 C5', 'D5 - G5 F5 E5 D5 B4 G4',
        'G5 E5 C5 E5 G5 - C6 -', 'E5 C5 A4 C5 E5 - A5 -', 'A5 F5 C5 F5 A5 G5 F5 E5', 'D5 E5 F5 G5 A5 B5 G5 -'
      ]),
      baixo: compassos([
        'C3 G3 C3 G3', 'A2 E3 A2 E3', 'F2 C3 F2 C3', 'G2 D3 G2 D3',
        'C3 G3 C3 G3', 'A2 E3 A2 E3', 'F2 C3 F2 C3', 'G2 D3 G2 B2'
      ]),
      hat: true
    },
    prisao: {
      bpm: 88, onda: 'sawtooth', volume: 0.05, baixoOnda: 'square', baixoVol: 0.11, baixoPorCompasso: 8,
      melodia: compassos([
        'A4 - - C5 - E5 - -', 'F4 - A4 - C5 - - -', 'D5 - - F5 - A4 - -', 'E5 - B4 - G#4 - B4 -',
        'C5 - E5 - A5 - G5 -', 'A5 - F5 - C5 - - -', 'D5 - F5 - A5 - F5 D5', 'E5 - - - - - - -'
      ]),
      baixo: compassos([
        'A2 - A2 A2 - A2 E3 -', 'F2 - F2 F2 - F2 C3 -', 'D2 - D2 D2 - D2 A2 -', 'E2 - E2 E2 - E2 B2 -',
        'A2 - A2 A2 - A2 E3 -', 'F2 - F2 F2 - F2 C3 -', 'D2 - D2 D2 - D2 A2 -', 'E2 - E2 E2 - E2 B2 G#2'
      ]),
      caixa: true
    }
  };

  let ctx = null, mestre = null, ruido = null;
  let ligada = A.ler('musica-ligada', true), volume = A.ler('musica-volume', 50);
  let faixa = null, pedida = null;          // faixa tocando e faixa que a página atual pede
  let passo = 0, proximo = 0, relogio = 0;
  let arquivo = null;                        // <audio> quando houver música própria em FC.CONFIG.MUSICA_ARQUIVOS

  const volumeReal = () => ligada ? Math.pow(volume / 100, 1.6) * 0.9 : 0;

  function preparar() {
    if (ctx) return true;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    try { ctx = new AC(); } catch (err) { return false; }
    mestre = ctx.createGain(); mestre.gain.value = volumeReal();
    const comp = ctx.createDynamicsCompressor(); mestre.connect(comp); comp.connect(ctx.destination);
    const n = ctx.sampleRate * 0.5, buf = ctx.createBuffer(1, n, ctx.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    ruido = buf;
    return true;
  }

  function nota(saida, onda, m, t, dur, vol) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = onda; o.frequency.value = freq(m);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(saida); o.start(t); o.stop(t + dur + 0.03);
  }

  function chiado(saida, t, dur, vol, agudo) {
    const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = ruido; f.type = 'highpass'; f.frequency.value = agudo ? 7000 : 1800;
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(saida); s.start(t); s.stop(t + dur + 0.02);
  }

  /* Toca uma colcheia da trilha. */
  function tocarPasso(f, p) {
    const T = f.def, dur = 60 / T.bpm / 2, t = f.t0 + 0, bar = Math.floor(p / 8) % T.melodia.length, i = p % 8;
    const quando = proximo;
    const m = T.melodia[bar][i];
    if (m !== null && m !== undefined) nota(f.saida, T.onda, m, quando, dur * (T.onda === 'sawtooth' ? 2.4 : 1.7), T.volume);
    const porPasso = T.baixoPorCompasso === 4 ? 2 : 1;
    if (T.baixoPorCompasso === 4 ? i % 2 === 0 : true) {
      const b = T.baixo[bar][T.baixoPorCompasso === 4 ? i / 2 : i];
      if (b !== null && b !== undefined) nota(f.saida, T.baixoOnda, b, quando, dur * (T.baixoPorCompasso === 4 ? 1.8 : 0.9), T.baixoVol);
    }
    if (T.hat && i % 2 === 1) chiado(f.saida, quando, 0.04, 0.05, true);
    if (T.caixa && (i === 2 || i === 6)) chiado(f.saida, quando, 0.12, 0.07, false);
    void t; void porPasso;
  }

  function agendar() {
    if (!ctx || !faixa || ctx.state !== 'running') return;
    const dur = 60 / faixa.def.bpm / 2;
    if (proximo < ctx.currentTime) proximo = ctx.currentTime + 0.05;
    while (proximo < ctx.currentTime + 0.3) {
      tocarPasso(faixa, passo);
      passo = (passo + 1) % (faixa.def.melodia.length * 8);
      proximo += dur;
    }
  }

  /* Troca de trilha com um fade curto. */
  function trocarFaixa(id) {
    if (faixa && faixa.id === id) return;
    if (faixa) { const velha = faixa; velha.saida.gain.cancelScheduledValues(ctx.currentTime); velha.saida.gain.setTargetAtTime(0, ctx.currentTime, 0.18); setTimeout(() => { try { velha.saida.disconnect(); } catch (e) { /* já solto */ } }, 1200); }
    const def = TRILHAS[id] || TRILHAS.menu;
    const saida = ctx.createGain(); saida.gain.value = 0; saida.connect(mestre);
    saida.gain.setTargetAtTime(1, ctx.currentTime + 0.05, 0.25);
    faixa = { id: id, def: def, saida: saida, t0: 0 };
    passo = 0; proximo = ctx.currentTime + 0.1;
  }

  /* Música própria (arquivo): toca em laço, com o volume do botão. */
  function tocarArquivo(url) {
    if (!arquivo || arquivo.dataset.url !== url) {
      if (arquivo) arquivo.pause();
      arquivo = new Audio(url); arquivo.loop = true; arquivo.dataset.url = url;
    }
    arquivo.volume = volumeReal();
    if (ligada) arquivo.play().catch(() => { /* o navegador pode pedir um clique antes */ });
  }

  function aplicar() {
    if (!pedida) return;
    const url = (FC.CONFIG.MUSICA_ARQUIVOS || {})[pedida];
    if (url) { if (faixa) { faixa.saida.gain.value = 0; faixa = null; } tocarArquivo(url); return; }
    if (arquivo) { arquivo.pause(); arquivo = null; }
    if (!preparar()) return;
    if (ctx.state === 'suspended' && ligada) ctx.resume();
    trocarFaixa(pedida);
    if (!relogio) relogio = setInterval(agendar, 60);
  }

  function atualizarBotao() {
    const b = document.getElementById('somBtn'), r = document.getElementById('somVol');
    if (!b) return;
    b.setAttribute('aria-pressed', ligada ? 'true' : 'false');
    b.setAttribute('aria-label', ligada ? 'Desligar a música e os sons' : 'Ligar a música e os sons');
    b.title = b.getAttribute('aria-label');
    b.classList.toggle('mudo', !ligada);
    r.value = volume; r.disabled = !ligada;
  }

  function mudouVolume() {
    if (mestre) mestre.gain.setTargetAtTime(volumeReal(), ctx.currentTime, 0.05);
    if (arquivo) { arquivo.volume = volumeReal(); if (!ligada) arquivo.pause(); else arquivo.play().catch(() => {}); }
    A.gravar('musica-ligada', ligada); A.gravar('musica-volume', volume);
    atualizarBotao();
  }

  /* Efeitos curtos (usam o mesmo volume e o mesmo botão de silenciar). */
  const EFEITOS = {
    moeda(t) { nota(mestre, 'square', midi('B5'), t, 0.09, 0.12); nota(mestre, 'square', midi('E6'), t + 0.07, 0.22, 0.12); },
    acerto(t) { ['C5', 'E5', 'G5', 'C6'].forEach((n, i) => nota(mestre, 'square', midi(n), t + i * 0.07, 0.16, 0.1)); },
    erro(t) { nota(mestre, 'sawtooth', midi('E3'), t, 0.18, 0.12); nota(mestre, 'sawtooth', midi('Bb2'), t + 0.12, 0.3, 0.12); },
    porta(t) { ['G4', 'C5', 'E5', 'G5', 'C6'].forEach((n, i) => nota(mestre, 'triangle', midi(n), t + i * 0.06, 0.2, 0.18)); },
    vitoria(t) { ['C5', 'E5', 'G5', 'C6', 'G5', 'C6', 'E6'].forEach((n, i) => nota(mestre, 'square', midi(n), t + i * 0.11, i === 6 ? 0.6 : 0.2, 0.1)); },
    passo(t) { chiado(mestre, t, 0.03, 0.03, false); }
  };

  FC.musica = {
    /* Pede uma trilha ("menu", "restaurante", "prisao"). Só começa a soar depois do primeiro clique ou tecla na página. */
    tocar(id) { pedida = id; if (ctx || interagiu) aplicar(); },
    efeito(nome) {
      if (!ligada || !ctx || ctx.state !== 'running' || !EFEITOS[nome]) return;
      EFEITOS[nome](ctx.currentTime + 0.01);
    },
    alternar() { ligada = !ligada; if (ligada && ctx && ctx.state === 'suspended') ctx.resume(); if (ligada) aplicar(); mudouVolume(); },
    estado() { return { ligada: ligada, volume: volume, faixa: faixa ? faixa.id : (arquivo ? 'arquivo' : null), contexto: ctx ? ctx.state : 'sem' }; }
  };

  let interagiu = false;
  function primeiraInteracao() {
    if (interagiu) return;
    interagiu = true;
    ['pointerdown', 'keydown', 'touchstart'].forEach(n => window.removeEventListener(n, primeiraInteracao, true));
    aplicar();
  }
  ['pointerdown', 'keydown', 'touchstart'].forEach(n => window.addEventListener(n, primeiraInteracao, true));

  document.addEventListener('visibilitychange', () => {   // aba escondida: silêncio
    if (!ctx) return;
    if (document.hidden) ctx.suspend(); else if (ligada) ctx.resume();
    if (arquivo) { if (document.hidden) arquivo.pause(); else if (ligada) arquivo.play().catch(() => {}); }
  });

  /* Cada página pede a sua trilha. */
  /* O controle de som fica no menu do topo de cada página (na de entrada, que não tem menu, flutua no canto). */
  function acomodar(pag) {
    const som = document.getElementById('som'), menu = document.querySelector('#pag-' + pag + ' .abas');
    if (!som) return;
    if (menu) { som.classList.remove('flutuante'); menu.insertBefore(som, menu.firstChild); }
    else { som.classList.add('flutuante'); document.body.appendChild(som); }
  }
  FC.paginas.aoEntrar('entrar', () => { acomodar('entrar'); FC.musica.tocar('menu'); });
  FC.paginas.aoEntrar('mundos', () => { acomodar('mundos'); FC.musica.tocar('menu'); });
  FC.paginas.aoEntrar('jogo', () => { acomodar('jogo'); FC.musica.tocar(FC.jogo && FC.jogo.estado.mundo ? FC.jogo.estado.mundo.id : 'menu'); });

  document.addEventListener('DOMContentLoaded', () => {
    const b = document.getElementById('somBtn'), r = document.getElementById('somVol');
    if (!b) return;
    b.addEventListener('click', () => FC.musica.alternar());
    r.addEventListener('input', () => { volume = +r.value; if (!ligada && volume > 0) { ligada = true; if (ctx) ctx.resume(); aplicar(); } mudouVolume(); });
    atualizarBotao();
  });
  if (document.readyState !== 'loading') { const b = document.getElementById('somBtn'); if (b) { b.addEventListener('click', () => FC.musica.alternar()); document.getElementById('somVol').addEventListener('input', ev => { volume = +ev.target.value; mudouVolume(); }); atualizarBotao(); } }
})();
