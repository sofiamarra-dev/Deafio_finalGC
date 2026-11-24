/* Sala 2: Despensa. Tijolos, tábuas de madeira, prateleira de potes, caixotes, balança e barris. */
(function () {
  const T = FC.CONFIG.T, H = FC.CONFIG.LINHAS;
  const R = FC.desenho.R, E = FC.desenho.E;

  function caixote(g, x, y, w, h) {
    R(g, x, y, w, h, '#a8793f');
    R(g, x, y, w, 3, '#c28f4f'); R(g, x, y + h - 3, w, 3, '#7e5a2c');
    R(g, x, y, 3, h, '#7e5a2c'); R(g, x + w - 3, y, 3, h, '#7e5a2c');
    R(g, x + 3, y + Math.floor(h / 2), w - 6, 2, '#7e5a2c');
  }

  function pintar(g) {
    // parede de tijolos
    R(g, 0, 0, 480, T, '#3d2a21');
    for (let r = 0; r < 2; r++) {
      for (let c = -1; c < 15; c++) R(g, c * 32 + (r ? 16 : 0) + 1, r * 16 + 1, 30, 14, (c + r) % 2 ? '#5b4032' : '#634638');
    }
    R(g, 0, 24, 480, 8, '#2a1b14'); R(g, 0, 24, 480, 1, '#6d4d3c');

    // piso de tábuas
    for (let r = 1; r < H; r++) {
      R(g, 0, r * T, 480, T, r % 2 ? '#5c4432' : '#54402f');
      R(g, 0, r * T, 480, 1, '#3b2b1f');
      for (let x = (r * 23) % 60; x < 480; x += 60) R(g, x, r * T, 1, T, '#3b2b1f');
    }
    R(g, 0, T, 8, 288, '#1d1410'); R(g, 472, T, 8, 288, '#1d1410'); R(g, 0, 314, 480, 6, '#1d1410');

    // lampião pendurado
    R(g, 236, 0, 2, 12, '#1a1410'); R(g, 231, 10, 12, 4, '#2a211b'); E(g, 237, 17, 10, 6, '#ffcf7a');

    // prateleira de potes e sacos (esquerda)
    R(g, T, T, 4 * T, T, '#6b4a2e');
    R(g, T, T + 14, 4 * T, 3, '#a07c50'); R(g, T, T + 29, 4 * T, 3, '#a07c50');
    R(g, T, T, 4, T, '#8a6a45'); R(g, 5 * T - 4, T, 4, T, '#8a6a45');
    const potes = ['#e5a24a', '#9fc98a', '#d9544f', '#f2e9c9', '#c78bd1'];
    for (let i = 0; i < 7; i++) { R(g, T + 8 + i * 17, T + 3, 10, 11, potes[i % 5]); R(g, T + 9 + i * 17, T + 1, 8, 3, '#7a5a3a'); }
    for (let i = 0; i < 5; i++) { R(g, T + 6 + i * 24, T + 18, 18, 11, '#d8c49a'); R(g, T + 12 + i * 24, T + 16, 6, 3, '#8a6a45'); }

    // barris (direita)
    R(g, 13 * T, T, 48, 40, '#7a5230');
    R(g, 13 * T, T + 7, 48, 3, '#4a4f5c'); R(g, 13 * T, T + 27, 48, 3, '#4a4f5c');
    R(g, 13 * T + 4, T, 3, 40, '#8a6038'); R(g, 13 * T + 22, T, 3, 40, '#8a6038'); R(g, 13 * T + 40, T, 3, 40, '#8a6038');
    E(g, 13 * T + 24, T + 2, 24, 5, '#a07c50');

    // pilha de caixotes (centro)
    R(g, 195, 176, 80, 4, 'rgba(0,0,0,.25)');
    caixote(g, 192, 144, 48, 32); caixote(g, 240, 152, 32, 24); caixote(g, 204, 128, 36, 16);

    // balança (direita)
    R(g, 387, 224, 64, 4, 'rgba(0,0,0,.25)');
    R(g, 384, 200, 64, 24, '#7a5230'); R(g, 384, 200, 64, 3, '#9a6b3e');
    R(g, 396, 206, 40, 6, '#9aa3b5'); R(g, 413, 184, 6, 22, '#6d7686');
    E(g, 416, 182, 12, 12, '#6d7686'); E(g, 416, 182, 10, 10, '#f1eee6');
    g.strokeStyle = '#d9544f'; g.lineWidth = 2; g.beginPath(); g.moveTo(416, 182); g.lineTo(421, 177); g.stroke(); g.lineWidth = 1;
    R(g, 408, 186, 2, 2, '#444'); R(g, 422, 186, 2, 2, '#444');

    // sacos de farinha (canto de baixo)
    R(g, T + 2, 7 * T + 4, 24, 26, '#d8c49a'); R(g, T + 10, 7 * T + 1, 8, 4, '#8a6a45');
    R(g, T + 30, 7 * T + 8, 28, 24, '#cdb88a'); R(g, T + 40, 7 * T + 5, 8, 4, '#8a6a45');
  }

  function animar(ctx, frame) {
    const a = 0.07 + 0.02 * Math.sin(frame / 9);
    ctx.fillStyle = 'rgba(255,200,120,' + a + ')'; ctx.beginPath(); ctx.ellipse(237, 100, 120, 85, 0, 0, 6.3); ctx.fill();
    ctx.fillStyle = 'rgba(255,230,170,' + (a * 2) + ')'; ctx.beginPath(); ctx.arc(237, 17, 22, 0, 6.3); ctx.fill();
  }

  FC.SALAS.push({
    mundo: 'restaurante',
    id: 'despensa',
    nome: 'Despensa',
    introducao: 'A cozinha ficou para trás. Resolva os painéis da despensa antes que tudo pegue fogo.',
    falha: { titulo: 'A despensa explodiu!', texto: 'O tempo acabou e os barris pegaram fogo.' },
    inicio: { x: 7 * T + 9, y: 8 * T },
    porta: { x: 11 * T, estilo: 'madeira', cor: '#5a3a22', painel: '#6b4a2e' },
    obstaculos: [
      { x: T, y: T, w: 4 * T, h: T },              // prateleira
      { x: 13 * T, y: T, w: 48, h: 40 },           // barris
      { x: 192, y: 128, w: 80, h: 48 },            // caixotes
      { x: 12 * T, y: 6 * T, w: 2 * T, h: T },     // balança
      { x: T, y: 7 * T, w: 2 * T, h: T }           // sacos
    ],
    estacoes: [
      { id: 'prateleira', rotulo: 'Prateleira', x: 3 * T, y: 2 * T + 10, raio: 46, balao: { x: 3 * T, y: 10 } },
      { id: 'caixote', rotulo: 'Caixote', x: 232, y: 186, raio: 40, balao: { x: 232, y: 116 } },
      { id: 'balanca', rotulo: 'Balança', x: 416, y: 234, raio: 40, balao: { x: 416, y: 176 } },
      FC.estacaoSaida('saida_despensa', 11 * T)
    ],
    bancada: { x: 112, y: 268, w: 64, h: 28 },
    // apagão: começa escuro e acende conforme os painéis são resolvidos
    apagao: { escuridao: 0.62, luzes: [{ x: 237, y: 30, r: 70 }] },
    pintar: pintar,
    animar: animar
  });
})();
