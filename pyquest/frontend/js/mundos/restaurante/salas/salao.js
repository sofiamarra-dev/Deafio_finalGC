/* Sala 3: Salão do restaurante. Papel de parede vinho, parquet, tapete até a porta da rua, bar e mesas. */
(function () {
  const T = FC.CONFIG.T, H = FC.CONFIG.LINHAS;
  const R = FC.desenho.R, E = FC.desenho.E;

  function mesa(g, cx, cy) {
    // cadeiras por baixo da mesa
    R(g, cx - 44, cy - 10, 14, 18, '#6b2430'); R(g, cx - 46, cy - 14, 4, 24, '#4d1822');
    R(g, cx + 30, cy - 10, 14, 18, '#6b2430'); R(g, cx + 42, cy - 14, 4, 24, '#4d1822');
    // pé e tampo com toalha
    R(g, cx - 3, cy + 15, 6, 12, '#3a2118'); R(g, cx - 12, cy + 25, 24, 3, '#3a2118');
    E(g, cx, cy + 3, 34, 18, '#3a2118'); E(g, cx, cy, 32, 16, '#f4efe4'); E(g, cx, cy, 22, 10, '#e6dfd0');
  }

  function quadro(g, x, cor1, cor2) {
    R(g, x, 4, 34, 18, '#2a1c14'); R(g, x + 2, 6, 30, 14, cor1); R(g, x + 2, 15, 30, 5, cor2);
  }

  function pintar(g) {
    // parede
    R(g, 0, 0, 480, T, '#6b2430');
    for (let x = 0; x < 480; x += 16) { R(g, x, 0, 2, 20, '#7d2e3b'); R(g, x + 8, 4, 2, 8, '#7d2e3b'); }
    R(g, 0, 18, 480, 2, '#c9a56a'); R(g, 0, 20, 480, 12, '#3a2118'); R(g, 0, 20, 480, 1, '#52301f');
    for (let x = 8; x < 480; x += 48) R(g, x, 23, 32, 6, '#4a2b1f');
    quadro(g, 176, '#4a7a8c', '#3a6a4a'); quadro(g, 296, '#c9a56a', '#8c6a3a');

    // piso de parquet
    for (let r = 1; r < H; r++) {
      for (let c = 0; c < 15; c++) {
        R(g, c * T, r * T, T, T, (r + c) % 2 ? '#7a5238' : '#6e4a33');
        R(g, c * T, r * T + 15, T, 1, 'rgba(0,0,0,.18)'); R(g, c * T + 15, r * T, 1, T, 'rgba(0,0,0,.12)');
      }
    }
    R(g, 0, T, 8, 288, '#2a1410'); R(g, 472, T, 8, 288, '#2a1410'); R(g, 0, 314, 480, 6, '#2a1410');

    // tapete até a porta da rua
    R(g, 208, T, 64, 288, '#8c1f2e');
    R(g, 210, T, 2, 288, '#d9b25a'); R(g, 268, T, 2, 288, '#d9b25a');
    R(g, 215, T, 1, 288, '#d9b25a'); R(g, 264, T, 1, 288, '#d9b25a');

    // bar com garrafas e caixa registradora (esquerda)
    const garrafas = ['#2f6b3f', '#8c3a2a', '#c9a02e', '#3a4f8c', '#2f6b3f'];
    for (let i = 0; i < 5; i++) { R(g, T + 8 + i * 11, T - 8, 5, 14, garrafas[i]); R(g, T + 9 + i * 11, T - 12, 3, 5, garrafas[i]); }
    R(g, T, T, 4 * T, 12, '#a07c50'); R(g, T, T, 4 * T, 3, '#c09a68');
    R(g, T, T + 12, 4 * T, 20, '#4a2f22');
    for (let i = 0; i < 4; i++) R(g, T + 4 + i * 32, T + 16, 26, 12, '#5a3a2b');
    R(g, 84, T - 2, 24, 16, '#c9d4dc'); R(g, 87, T, 18, 7, '#6fd1a8'); R(g, 88, T + 10, 4, 2, '#7d8a98'); R(g, 94, T + 10, 4, 2, '#7d8a98'); R(g, 100, T + 10, 4, 2, '#7d8a98');

    // aparador com o quadro do cardápio (direita)
    R(g, 11 * T + 4, 3, 56, 22, '#a07c50'); R(g, 11 * T + 6, 5, 52, 18, '#24332f');
    R(g, 11 * T + 10, 9, 24, 1, '#e8e4f2'); R(g, 11 * T + 10, 13, 34, 1, '#e8e4f2'); R(g, 11 * T + 10, 17, 18, 1, '#e8e4f2');
    E(g, 11 * T + 49, 14, 5, 5, '#f2c94c'); R(g, 11 * T + 47, 12, 2, 2, '#d9544f');
    R(g, 11 * T, T, 64, 12, '#a07c50'); R(g, 11 * T, T, 64, 3, '#c09a68');
    R(g, 11 * T, T + 12, 64, 20, '#4a2f22'); R(g, 11 * T + 31, T + 14, 2, 16, '#2f1c14');
    R(g, 11 * T + 26, T + 20, 3, 4, '#f2d27a'); R(g, 11 * T + 35, T + 20, 3, 4, '#f2d27a');

    // mesa com o sino (esquerda) e mesa com vela (direita)
    mesa(g, 96, 181);
    E(g, 96, 174, 7, 5, '#f2c94c'); R(g, 89, 176, 14, 3, '#c9a02e'); R(g, 95, 167, 2, 3, '#c9a02e');
    mesa(g, 352, 181);
    R(g, 350, 173, 3, 8, '#f6f0e0'); E(g, 351.5, 170, 2, 3, '#ffb62e');

    // vaso de planta
    R(g, 13 * T + 4, 8 * T + 18, 24, 14, '#b8643f'); R(g, 13 * T + 2, 8 * T + 16, 28, 3, '#cf7a50');
    R(g, 13 * T + 8, 8 * T - 2, 5, 18, '#3f9a6a'); R(g, 13 * T + 14, 8 * T - 8, 5, 24, '#4fb37c'); R(g, 13 * T + 20, 8 * T, 5, 16, '#3f9a6a');
  }

  function animar(ctx, frame) {
    const a = 0.05 + 0.015 * Math.sin(frame / 20);
    ctx.fillStyle = 'rgba(255,224,160,' + a + ')'; ctx.beginPath(); ctx.ellipse(240, 170, 170, 115, 0, 0, 6.3); ctx.fill();
    const v = 0.18 + 0.08 * Math.sin(frame / 5);
    ctx.fillStyle = 'rgba(255,190,80,' + v + ')'; ctx.beginPath(); ctx.arc(351.5, 170, 16, 0, 6.3); ctx.fill();
  }

  FC.SALAS.push({
    mundo: 'restaurante',
    id: 'salao',
    nome: 'Salão',
    introducao: 'Última área: o salão do restaurante. A porta da rua está logo ali, mas o tempo está correndo.',
    falha: { titulo: 'O salão explodiu!', texto: 'O tempo acabou e o lustre veio abaixo junto com o resto.' },
    inicio: { x: 7 * T + 9, y: 8 * T + 6 },
    porta: { x: 7 * T, estilo: 'vidro' },
    obstaculos: [
      { x: T, y: T, w: 4 * T, h: T },            // bar
      { x: 11 * T, y: T, w: 2 * T, h: T },       // aparador
      { x: 2 * T, y: 5 * T, w: 2 * T, h: T + 16 }, // mesa do sino
      { x: 10 * T, y: 5 * T, w: 2 * T, h: T + 16 }, // mesa da vela
      { x: 13 * T, y: 8 * T, w: T, h: T }        // vaso
    ],
    estacoes: [
      { id: 'registradora', rotulo: 'Caixa', x: 3 * T, y: 2 * T + 10, raio: 46, balao: { x: 3 * T, y: 10 } },
      { id: 'cardapio', rotulo: 'Cardápio', x: 12 * T, y: 2 * T + 10, raio: 40, balao: { x: 12 * T, y: 10 } },
      { id: 'sino', rotulo: 'Sino', x: 96, y: 218, raio: 40, balao: { x: 96, y: 148 } },
      FC.estacaoSaida('saida_salao', 7 * T)
    ],
    bancada: { x: 304, y: 268, w: 64, h: 28 },
    pintar: pintar,
    animar: animar
  });
})();
