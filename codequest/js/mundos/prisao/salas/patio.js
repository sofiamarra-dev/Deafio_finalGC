/* Área 2 da prisão: o pátio. Asfalto, cerca de arame, holofote, cesta, guarita e pneus. */
(function () {
  const T = FC.CONFIG.T, W = FC.CONFIG.COLUNAS, H = FC.CONFIG.LINHAS;
  const R = FC.desenho.R, E = FC.desenho.E;

  function pintar(g) {
    // céu de fim de tarde por trás da cerca
    R(g, 0, 0, 480, T, '#3c3a52'); R(g, 0, 0, 480, 10, '#5a4a62'); R(g, 0, 10, 480, 8, '#7a5a60');
    // cerca de arame
    g.strokeStyle = 'rgba(160,168,180,.55)'; g.lineWidth = 1;
    for (let x = -32; x < 520; x += 8) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x + 32, 28); g.stroke(); g.beginPath(); g.moveTo(x + 32, 0); g.lineTo(x, 28); g.stroke(); }
    R(g, 0, 28, 480, 4, '#2a2e36'); for (let x = 4; x < 480; x += 10) R(g, x, 26, 6, 2, '#8a8f99');
    // asfalto com faixas
    for (let r = 1; r < H; r++) for (let c = 0; c < W; c++) R(g, c * T, r * T, T, T, ((r * 7 + c * 3) % 6 === 0) ? '#4a4d55' : ((r + c) % 2 ? '#51545c' : '#4d5058'));
    R(g, 0, 5 * T + 12, 480, 2, 'rgba(240,230,170,.35)');
    R(g, 0, T, 8, 288, '#1e2128'); R(g, 472, T, 8, 288, '#1e2128'); R(g, 0, 314, 480, 6, '#1e2128');

    // muro com holofote (esquerda)
    R(g, T, T + 26, 4 * T, 6, 'rgba(0,0,0,.25)');
    R(g, T, T, 4 * T, T, '#7a6a58'); R(g, T, T, 4 * T, 4, '#9a8a76');
    for (let i = 0; i < 8; i++) R(g, T + 4 + i * 16, T + 9, 12, 8, '#6a5a4a');
    R(g, 3 * T - 6, T - 4, 14, 8, '#2a2e36'); R(g, 3 * T - 2, T - 10, 6, 8, '#d8d4b8');
    // cesta de basquete (direita)
    R(g, 11 * T, T + 26, 2 * T, 6, 'rgba(0,0,0,.25)');
    R(g, 11 * T, T, 2 * T, T, '#6a707c'); R(g, 11 * T + 4, T + 2, 56, 12, '#e8e4d8'); R(g, 11 * T + 24, T + 6, 16, 8, '#d8553a');
    R(g, 11 * T + 22, T + 14, 20, 2, '#e8e4d8'); R(g, 11 * T + 24, T + 16, 16, 6, 'rgba(240,240,240,.7)');
    // guarita / mesa de ronda
    R(g, 2 * T, 5 * T + 28, 2 * T, 6, 'rgba(0,0,0,.25)');
    R(g, 2 * T, 5 * T, 2 * T, T + 16, '#6b5a40'); R(g, 2 * T, 5 * T, 2 * T, 5, '#8a7656');
    R(g, 2 * T + 10, 5 * T + 10, 44, 16, '#2a2e36'); R(g, 2 * T + 12, 5 * T + 12, 40, 12, '#8ec1d6'); R(g, 2 * T + 28, 5 * T + 12, 2, 12, '#2a2e36');
    // pilha de pneus
    R(g, 10 * T, 5 * T + 28, 2 * T, 6, 'rgba(0,0,0,.25)');
    for (let i = 0; i < 3; i++) { E(g, 10 * T + 18 + i * 16, 5 * T + 36, 11, 8, '#1c1d22'); E(g, 10 * T + 18 + i * 16, 5 * T + 36, 5, 3, '#4a4d55'); }
    for (let i = 0; i < 2; i++) { E(g, 10 * T + 26 + i * 16, 5 * T + 22, 11, 8, '#23252b'); E(g, 10 * T + 26 + i * 16, 5 * T + 22, 5, 3, '#4a4d55'); }
    // barril
    R(g, 13 * T, 8 * T, T, T, '#7a3a2a'); R(g, 13 * T, 8 * T + 6, T, 3, '#4a4f5c'); R(g, 13 * T, 8 * T + 22, T, 3, '#4a4f5c'); E(g, 13 * T + 16, 8 * T + 2, 16, 4, '#9a5a3a');
  }

  function animar(ctx, frame) {
    // cone de luz do holofote, balançando
    const x = 3 * T + 4 + Math.sin(frame / 50) * 70;
    ctx.fillStyle = 'rgba(255,245,200,.07)';
    ctx.beginPath(); ctx.moveTo(3 * T + 4, T + 2); ctx.lineTo(x - 40, 300); ctx.lineTo(x + 40, 300); ctx.closePath(); ctx.fill();
  }

  FC.SALAS.push({
    mundo: 'prisao',
    id: 'patio',
    nome: 'Pátio',
    introducao: 'O pátio da prisão. O holofote vigia tudo: resolva os painéis e alcance o portão antes do alarme.',
    falha: { titulo: 'O alarme disparou!', texto: 'O holofote te achou no meio do pátio.' },
    inicio: { x: 7 * T + 9, y: 8 * T + 6 },
    porta: { x: 7 * T, estilo: 'metal' },
    obstaculos: [
      { x: T, y: T, w: 4 * T, h: T },              // muro e holofote
      { x: 11 * T, y: T, w: 2 * T, h: T },         // cesta
      { x: 2 * T, y: 5 * T, w: 2 * T, h: T + 16 }, // guarita
      { x: 10 * T, y: 5 * T, w: 2 * T, h: T + 16 }, // pneus
      { x: 13 * T, y: 8 * T, w: T, h: T }          // barril
    ],
    estacoes: [
      { id: 'holofote', rotulo: 'Holofote', x: 3 * T, y: 2 * T + 10, raio: 46, balao: { x: 3 * T, y: 10 } },
      { id: 'bola', rotulo: 'Cesta', x: 12 * T, y: 2 * T + 10, raio: 40, balao: { x: 12 * T, y: 10 } },
      { id: 'muro', rotulo: 'Guarita', x: 96, y: 218, raio: 40, balao: { x: 96, y: 148 } },
      FC.estacaoSaida('saida_patio', 7 * T)
    ],
    bancada: { x: 304, y: 268, w: 64, h: 28 },
    pintar: pintar,
    animar: animar
  });
})();
