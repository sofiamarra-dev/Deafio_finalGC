/* Ambiente das salas: sombras, textura e móveis extras que dão vida ao cenário, além de poeira e brilho animados.
   Cada sala pode ter "extras" (móveis que bloqueiam o caminho e detalhes só de enfeite). Para uma sala nova, basta
   adicionar uma entrada em EXTRAS com o id da sala. */
window.FC = window.FC || {};

(function () {
  const R = FC.desenho.R, E = FC.desenho.E, T = FC.CONFIG.T;

  /* Números "aleatórios" sempre iguais: a sala tem o mesmo desenho toda vez. */
  function semente(n) { let a = n; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

  const sombra = (g, o) => { R(g, o.x - 1, o.y + o.h, o.w + 2, 4, 'rgba(0,0,0,.20)'); R(g, o.x + 1, o.y + o.h + 4, o.w - 2, 3, 'rgba(0,0,0,.09)'); };

  /* Móveis ---------------------------------------------------------------------------------------------------- */
  const moveis = {
    prateleiraPanelas(g, x, y) {          // 40x48
      R(g, x, y + 46, 40, 2, 'rgba(0,0,0,.25)'); R(g, x, y, 40, 46, '#5e432b'); R(g, x + 2, y + 2, 36, 42, '#46301f');
      [14, 29, 44].forEach(dy => { R(g, x, y + dy, 40, 3, '#b88a55'); R(g, x, y + dy, 40, 1, '#d7b37c'); });
      R(g, x + 4, y + 4, 8, 10, '#c9ced9'); R(g, x + 4, y + 4, 8, 2, '#e8edf5'); R(g, x + 15, y + 6, 7, 8, '#d9544f'); R(g, x + 25, y + 3, 10, 11, '#e8b04a');
      R(g, x + 5, y + 19, 6, 10, '#6fa86a'); R(g, x + 14, y + 21, 6, 8, '#f6d35c'); R(g, x + 23, y + 18, 5, 11, '#c9ced9'); R(g, x + 30, y + 21, 6, 8, '#a87443');
      R(g, x + 4, y + 34, 14, 10, '#8a5a33'); R(g, x + 22, y + 34, 14, 10, '#8a5a33'); R(g, x + 9, y + 38, 4, 2, '#f2d27a'); R(g, x + 27, y + 38, 4, 2, '#f2d27a');
    },
    sacoFarinha(g, x, y) {                // 32x40
      R(g, x, y + 38, 32, 2, 'rgba(0,0,0,.25)');
      R(g, x + 2, y + 16, 28, 22, '#d9c9a0'); R(g, x + 4, y + 8, 24, 10, '#cdbb8e'); R(g, x + 8, y + 4, 16, 6, '#d9c9a0'); R(g, x + 6, y + 14, 20, 3, '#a8946a');
      R(g, x + 8, y + 22, 16, 10, '#f4efe4'); R(g, x + 11, y + 25, 10, 2, '#b3402f'); R(g, x + 11, y + 29, 7, 1, '#8a7a5a');
      R(g, x + 2, y + 16, 2, 22, '#b9a77a');
    },
    estanteVinho(g, x, y) {               // 40x56
      R(g, x, y + 54, 40, 2, 'rgba(0,0,0,.3)'); R(g, x, y, 40, 54, '#4a3220'); R(g, x + 2, y + 2, 36, 50, '#2f2016');
      for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) {
        const cx = x + 8 + c * 12, cy = y + 8 + r * 12;
        E(g, cx, cy, 5, 5, '#6b4a2c'); E(g, cx, cy, 3, 3, ((r + c) % 3 === 0) ? '#7a1f2a' : ((r + c) % 3 === 1) ? '#2d5a3a' : '#a8742a');
      }
      R(g, x, y, 40, 2, '#6b4a2c');
    },
    sacos(g, x, y) {                      // 36x60
      R(g, x, y + 58, 36, 2, 'rgba(0,0,0,.3)');
      [[2, 36, 30, 22], [4, 18, 28, 20], [8, 2, 22, 18]].forEach(([dx, dy, w, h], i) => {
        R(g, x + dx, y + dy, w, h, i % 2 ? '#c4a76e' : '#b8995c'); R(g, x + dx, y + dy, w, 3, '#d7bc84'); R(g, x + dx + 4, y + dy + 8, w - 8, 6, '#e6d3a4'); R(g, x + dx, y + dy + h - 2, w, 2, '#8d7442');
      });
    },
    plantaAlta(g, x, y) {                 // 32x50
      R(g, x, y + 48, 32, 2, 'rgba(0,0,0,.25)');
      R(g, x + 6, y + 34, 20, 14, '#b8643f'); R(g, x + 4, y + 32, 24, 4, '#cf7a50'); R(g, x + 8, y + 36, 3, 10, '#d98f66');
      R(g, x + 14, y + 8, 4, 26, '#3f9a6a'); R(g, x + 6, y + 14, 8, 6, '#4fb37c'); R(g, x + 2, y + 20, 8, 8, '#3f9a6a'); R(g, x + 18, y + 10, 10, 7, '#4fb37c'); R(g, x + 20, y + 20, 10, 8, '#3f9a6a'); R(g, x + 10, y + 2, 10, 8, '#5fc58c');
    },
    carrinhoSobremesa(g, x, y) {          // 32x40
      R(g, x, y + 38, 32, 2, 'rgba(0,0,0,.25)');
      R(g, x + 2, y + 26, 28, 3, '#c9ced9'); R(g, x + 2, y + 14, 28, 3, '#c9ced9'); R(g, x + 2, y + 6, 2, 30, '#8a8fa5'); R(g, x + 28, y + 6, 2, 30, '#8a8fa5');
      E(g, x + 9, y + 11, 5, 3, '#f4efe4'); R(g, x + 5, y + 6, 8, 5, '#f4a3b5'); R(g, x + 8, y + 4, 3, 3, '#d9544f');
      R(g, x + 17, y + 7, 9, 7, '#8a5a33'); R(g, x + 17, y + 7, 9, 2, '#f4efe4');
      R(g, x + 6, y + 19, 8, 7, '#f6d35c'); R(g, x + 18, y + 20, 8, 6, '#e8b04a');
      E(g, x + 6, y + 37, 3, 3, '#3a3f4a'); E(g, x + 26, y + 37, 3, 3, '#3a3f4a');
    },
    armarioAco(g, x, y) {                 // 40x48
      R(g, x, y + 46, 40, 2, 'rgba(0,0,0,.3)'); R(g, x, y, 40, 46, '#6f7a86'); R(g, x, y, 40, 3, '#98a3af'); R(g, x + 19, y + 3, 2, 43, '#4d5660');
      R(g, x + 3, y + 8, 14, 3, '#4d5660'); R(g, x + 23, y + 8, 14, 3, '#4d5660'); R(g, x + 15, y + 22, 3, 6, '#c9d1d9'); R(g, x + 22, y + 22, 3, 6, '#c9d1d9');
      R(g, x + 4, y + 34, 10, 6, '#8d97a3'); R(g, x + 26, y + 34, 10, 6, '#8d97a3');
    },
    bancoMetal(g, x, y) {                 // 32x40 (visto de frente, com balde)
      R(g, x, y + 38, 32, 2, 'rgba(0,0,0,.3)');
      R(g, x + 2, y + 18, 28, 5, '#8d97a3'); R(g, x + 2, y + 18, 28, 1, '#b4bdc7'); R(g, x + 4, y + 23, 3, 15, '#5f6670'); R(g, x + 25, y + 23, 3, 15, '#5f6670');
      R(g, x + 8, y + 8, 16, 10, '#7a6a52'); R(g, x + 8, y + 8, 16, 2, '#9a8868'); R(g, x + 11, y + 11, 10, 4, '#4a3f2e');
    },
    pesos(g, x, y) {                      // 32x50
      R(g, x, y + 48, 32, 2, 'rgba(0,0,0,.3)');
      R(g, x + 2, y + 6, 28, 3, '#5a3a24'); R(g, x + 2, y + 24, 28, 3, '#5a3a24'); R(g, x + 4, y + 6, 3, 42, '#5a3a24'); R(g, x + 25, y + 6, 3, 42, '#5a3a24');
      [[6, 9], [18, 9]].forEach(([dx, dy]) => { R(g, x + dx, y + dy, 8, 8, '#3a3f4a'); R(g, x + dx - 2, y + dy + 2, 12, 4, '#4d5660'); R(g, x + dx + 1, y + dy, 6, 1, '#6a727c'); });
      [[8, 28], [20, 28]].forEach(([dx, dy]) => { R(g, x + dx, y + dy, 6, 14, '#3a3f4a'); R(g, x + dx + 1, y + dy, 2, 14, '#5f6670'); });
    },
    latas(g, x, y) {                      // 32x40
      R(g, x, y + 38, 32, 2, 'rgba(0,0,0,.3)');
      [[2, 14, 14, 24], [16, 20, 14, 18]].forEach(([dx, dy, w, h]) => { R(g, x + dx, y + dy, w, h, '#6b5a4a'); R(g, x + dx, y + dy, w, 3, '#8d7a64'); R(g, x + dx + 2, y + dy + 7, w - 4, 3, '#a8946a'); R(g, x + dx + 2, y + dy + h - 5, w - 4, 2, '#4a3d30'); });
      R(g, x + 6, y + 6, 22, 9, '#7a6a52'); R(g, x + 6, y + 6, 22, 2, '#9a8868'); R(g, x + 10, y + 9, 14, 2, '#4a3f2e');
    },
    carrinhoMina(g, x, y) {               // 40x56
      R(g, x, y + 54, 40, 2, 'rgba(0,0,0,.35)');
      R(g, x + 2, y + 22, 36, 24, '#6a4a2e'); R(g, x + 2, y + 22, 36, 4, '#8a6240'); R(g, x + 4, y + 30, 32, 2, '#4a3220');
      R(g, x + 6, y + 14, 28, 9, '#5a4636'); R(g, x + 10, y + 10, 8, 6, '#6b5744'); R(g, x + 22, y + 12, 8, 5, '#6b5744');
      E(g, x + 10, y + 49, 5, 5, '#2a2d38'); E(g, x + 30, y + 49, 5, 5, '#2a2d38'); R(g, x + 9, y + 48, 3, 2, '#6a727c'); R(g, x + 29, y + 48, 3, 2, '#6a727c');
    },
    pedras(g, x, y) {                     // 36x60
      R(g, x, y + 58, 36, 2, 'rgba(0,0,0,.3)');
      [[4, 36, 28, 22, '#5a4a3a'], [10, 20, 20, 20, '#6b5846'], [2, 28, 14, 18, '#4a3b2d'], [14, 6, 14, 18, '#5a4a3a']].forEach(([dx, dy, w, h, c]) => { R(g, x + dx, y + dy, w, h, c); R(g, x + dx, y + dy, w, 3, 'rgba(255,255,255,.12)'); R(g, x + dx + w - 3, y + dy, 3, h, 'rgba(0,0,0,.22)'); });
      R(g, x + 6, y + 50, 6, 3, '#8a7050'); R(g, x + 24, y + 46, 5, 3, '#8a7050');
    }
  };

  /* Detalhes só de enfeite (não bloqueiam o caminho) --------------------------------------------------------- */
  const detalhes = {
    farinha(g, x, y) { E(g, x, y, 14, 6, 'rgba(244,239,228,.35)'); E(g, x + 4, y - 1, 8, 4, 'rgba(244,239,228,.5)'); R(g, x - 10, y + 2, 3, 2, 'rgba(244,239,228,.4)'); R(g, x + 11, y - 4, 2, 2, 'rgba(244,239,228,.4)'); },
    mancha(g, x, y, cor) { E(g, x, y, 9, 5, cor); E(g, x + 6, y + 2, 5, 3, cor); R(g, x - 12, y - 1, 2, 2, cor); },
    rachadura(g, x, y) { g.fillStyle = 'rgba(0,0,0,.35)'; [[0, 0, 6, 1], [6, 1, 5, 1], [9, 2, 2, 5], [11, 7, 6, 1], [4, -1, 1, 5]].forEach(([dx, dy, w, h]) => g.fillRect(x + dx, y + dy, w, h)); },
    caixa(g, x, y) { R(g, x, y + 8, 18, 2, 'rgba(0,0,0,.25)'); R(g, x, y, 18, 9, '#b08850'); R(g, x, y, 18, 2, '#cfa86c'); R(g, x + 8, y, 2, 9, '#8a6a3c'); },
    cartaz(g, x, y, cor, linhas) { R(g, x, y, 22, 20, '#2a2218'); R(g, x + 1, y + 1, 20, 18, cor); linhas.forEach((c, i) => R(g, x + 4, y + 4 + i * 4, 14 - (i % 2) * 4, 2, c)); },
    quadro(g, x, y) { R(g, x, y, 20, 16, '#5a3a24'); R(g, x + 2, y + 2, 16, 12, '#e8d9b0'); R(g, x + 4, y + 9, 12, 3, '#6fa86a'); E(g, x + 13, y + 6, 3, 3, '#e8b04a'); },
    lampada(g, x, y) { R(g, x + 3, 0, 1, y, '#2a2218'); R(g, x - 1, y, 9, 4, '#2a2218'); R(g, x, y + 4, 7, 5, '#ffd66b'); },
    tubo(g, x, w) { R(g, x, 14, w, 4, '#59626e'); R(g, x, 14, w, 1, '#8590a0'); for (let i = x + 8; i < x + w; i += 24) R(g, i, 12, 3, 8, '#3d444e'); },
    grade(g, x, y) { R(g, x, y, 26, 18, '#14161e'); for (let i = 0; i < 5; i++) R(g, x + 3 + i * 5, y, 2, 18, '#7a8490'); R(g, x, y, 26, 2, '#98a3af'); },
    poca(g, x, y) { E(g, x, y, 16, 5, 'rgba(120,160,200,.35)'); E(g, x - 3, y - 1, 8, 2, 'rgba(210,230,250,.35)'); },
    pegadas(g, x, y, cor) { for (let i = 0; i < 5; i++) { R(g, x + i * 9, y + (i % 2) * 5, 4, 5, cor); } },
    raiz(g, x, y) { R(g, x, y, 14, 3, '#4a3320'); R(g, x + 10, y - 4, 3, 8, '#4a3320'); R(g, x + 2, y + 3, 3, 4, '#3a2918'); },
    tapete(g, x, y, w, h, c1, c2) { R(g, x, y, w, h, c1); R(g, x + 2, y + 2, w - 4, h - 4, c2); R(g, x + 5, y + 5, w - 10, h - 10, c1); for (let i = 0; i < w; i += 4) { R(g, x + i, y - 3, 2, 3, c2); R(g, x + i, y + h, 2, 3, c2); } }
  };

  /* O que cada sala recebe. "moveis" bloqueiam o caminho (são somados aos obstáculos da sala);
     "pintar" desenha o enfeite por cima do piso, antes dos móveis. */
  const EXTRAS = {
    cozinha: {
      moveis: [['prateleiraPanelas', 424, 128, 40, 48], ['sacoFarinha', 12, 150, 32, 40]],
      pintar(g) { detalhes.farinha(g, 218, 150); detalhes.mancha(g, 300, 214, 'rgba(180,50,40,.28)'); detalhes.rachadura(g, 360, 268); detalhes.rachadura(g, 120, 190); detalhes.cartaz(g, 176, 5, '#d9c9a0', ['#8a6a3c', '#b3402f', '#8a6a3c']); }
    },
    despensa: {
      moveis: [['estanteVinho', 424, 96, 40, 56], ['sacos', 12, 120, 36, 60]],
      pintar(g) { detalhes.caixa(g, 300, 268); detalhes.caixa(g, 322, 274); detalhes.rachadura(g, 250, 238); detalhes.mancha(g, 160, 228, 'rgba(0,0,0,.25)'); detalhes.quadro(g, 196, 6); }
    },
    salao: {
      moveis: [['plantaAlta', 432, 110, 32, 50], ['carrinhoSobremesa', 12, 100, 32, 40]],
      pintar(g) { detalhes.tapete(g, 160, 262, 56, 18, '#7a1f2a', '#c9a24a'); detalhes.mancha(g, 270, 220, 'rgba(0,0,0,.12)'); detalhes.quadro(g, 292, 6); }
    },
    cela: {
      moveis: [['armarioAco', 424, 128, 40, 48], ['bancoMetal', 12, 150, 32, 40]],
      pintar(g) { detalhes.poca(g, 216, 160); detalhes.rachadura(g, 360, 268); detalhes.rachadura(g, 130, 200); detalhes.mancha(g, 300, 214, 'rgba(0,0,0,.22)'); detalhes.cartaz(g, 180, 5, '#8d97a3', ['#3d444e', '#b3402f', '#3d444e']); detalhes.pegadas(g, 190, 240, 'rgba(0,0,0,.15)'); }
    },
    patio: {
      moveis: [['pesos', 432, 110, 32, 50], ['latas', 12, 100, 32, 40]],
      pintar(g) { detalhes.rachadura(g, 220, 130); detalhes.rachadura(g, 140, 250); detalhes.poca(g, 250, 200); detalhes.mancha(g, 80, 270, 'rgba(0,0,0,.2)'); }
    },
    tunel: {
      moveis: [['carrinhoMina', 424, 96, 40, 56], ['pedras', 12, 120, 36, 60]],
      pintar(g) { detalhes.raiz(g, 300, 270); detalhes.raiz(g, 70, 190); detalhes.poca(g, 250, 150); detalhes.rachadura(g, 340, 150); detalhes.lampada(g, 60, 12); detalhes.lampada(g, 430, 10); }
    }
  };

  /* Soma os móveis extras aos obstáculos das salas (uma vez só, ao carregar). */
  function registrar() {
    FC.SALAS.forEach(s => {
      const ex = EXTRAS[s.id];
      if (!ex || s.extrasFeitos) return;
      s.extrasFeitos = true;
      (ex.moveis || []).forEach(m => s.obstaculos.push({ x: m[1], y: m[2], w: m[3], h: m[4], enfeite: m[0] }));
    });
  }

  FC.ambiente = {
    registrar: registrar,

    /* Pinta a sala já desenhada: textura, enfeites, móveis extras e sombras. */
    pintar(g, sala) {
      const ex = EXTRAS[sala.id], rnd = semente(sala.id.length * 97 + sala.id.charCodeAt(0));
      // textura do piso: pontinhos claros e escuros
      for (let i = 0; i < 520; i++) {
        const x = 10 + Math.floor(rnd() * 460), y = T + 6 + Math.floor(rnd() * 270);
        g.fillStyle = rnd() < .5 ? 'rgba(255,255,255,.045)' : 'rgba(0,0,0,.07)'; g.fillRect(x, y, 1 + (rnd() < .3 ? 1 : 0), 1);
      }
      if (ex && ex.pintar) ex.pintar(g);
      if (ex) (ex.moveis || []).forEach(m => moveis[m[0]](g, m[1], m[2]));
      // sombra de contato dos móveis e das paredes
      sala.obstaculos.forEach(o => sombra(g, o));
      const gr = g.createLinearGradient(0, T, 0, T + 16); gr.addColorStop(0, 'rgba(0,0,0,.38)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = gr; g.fillRect(8, T, 464, 16);
      const gl = g.createLinearGradient(8, 0, 26, 0); gl.addColorStop(0, 'rgba(0,0,0,.32)'); gl.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = gl; g.fillRect(8, T, 18, 282);
      const gd = g.createLinearGradient(472, 0, 454, 0); gd.addColorStop(0, 'rgba(0,0,0,.32)'); gd.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = gd; g.fillRect(454, T, 18, 282);
      const gb = g.createLinearGradient(0, 314, 0, 296); gb.addColorStop(0, 'rgba(0,0,0,.3)'); gb.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = gb; g.fillRect(8, 296, 464, 18);
    },

    /* Poeira flutuando e um brilho que pulsa. Quente no restaurante, azulada na prisão. */
    animar(ctx, frame, mundoId) {
      const fria = mundoId === 'prisao';
      ctx.save();
      for (let i = 0; i < 18; i++) {
        const x = (i * 83 + frame * (0.12 + (i % 4) * 0.05)) % 480, y = 40 + ((i * 47) % 250) + Math.sin(frame / 60 + i) * 8;
        const a = 0.10 + 0.14 * (0.5 + 0.5 * Math.sin(frame / 40 + i * 2));
        ctx.fillStyle = (fria ? 'rgba(190,215,255,' : 'rgba(255,236,190,') + a + ')';
        ctx.fillRect(Math.round(x), Math.round(y), i % 5 === 0 ? 2 : 1, i % 5 === 0 ? 2 : 1);
      }
      ctx.restore();
    }
  };
})();
