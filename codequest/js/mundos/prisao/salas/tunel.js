/* Área 3 da prisão: o túnel. Terra, escoras de madeira, lampião no escuro (apagão). */
(function () {
  const T = FC.CONFIG.T, H = FC.CONFIG.LINHAS;
  const R = FC.desenho.R, E = FC.desenho.E;

  function pintar(g) {
    // teto de terra
    R(g, 0, 0, 480, T, '#3a2a1e');
    for (let i = 0; i < 40; i++) R(g, (i * 37) % 470, (i * 13) % 26, 4 + (i % 3) * 2, 3, i % 2 ? '#4a362a' : '#2c2018');
    R(g, 0, 24, 480, 8, '#241810'); R(g, 0, 24, 480, 1, '#5a4332');
    // chão de terra batida
    for (let r = 1; r < H; r++) {
      R(g, 0, r * T, 480, T, r % 2 ? '#5a4330' : '#52402d');
      for (let x = (r * 29) % 50; x < 480; x += 50) R(g, x, r * T + 8 + (x % 3) * 6, 6, 3, '#3e2e20');
    }
    R(g, 0, T, 8, 288, '#1a120c'); R(g, 472, T, 8, 288, '#1a120c'); R(g, 0, 314, 480, 6, '#1a120c');
    // escoras de madeira no teto
    for (let x = 48; x < 480; x += 96) { R(g, x, 0, 8, T, '#7a5230'); R(g, x - 4, 0, 16, 5, '#8a6038'); }
    // lampião
    R(g, 236, 0, 2, 12, '#1a1410'); R(g, 231, 10, 12, 4, '#2a211b'); E(g, 237, 17, 10, 6, '#ffcf7a');

    // rack de ferramentas (esquerda)
    R(g, T, T, 4 * T, T, '#6b4a2e'); R(g, T, T + 14, 4 * T, 3, '#a07c50'); R(g, T, T + 29, 4 * T, 3, '#a07c50');
    for (let i = 0; i < 6; i++) { R(g, T + 8 + i * 20, T + 3, 3, 12, '#9aa3b5'); R(g, T + 6 + i * 20, T + 2, 8, 3, '#7a5a3a'); }
    E(g, T + 100, T + 22, 8, 6, '#e8d070'); R(g, T + 94, T + 22, 12, 6, '#c9b048');
    // monte de terra solta (direita, em cima)
    E(g, 13 * T + 24, T + 24, 30, 16, '#6a5038'); E(g, 13 * T + 24, T + 18, 22, 12, '#7a5c42');
    // pilha de terra e pedras (centro)
    R(g, 195, 176, 80, 4, 'rgba(0,0,0,.25)');
    E(g, 232, 158, 42, 22, '#6a5038'); E(g, 224, 148, 26, 14, '#7a5c42'); E(g, 250, 152, 12, 8, '#8a8f99');
    R(g, 270, 150, 2, 24, '#c9a56a'); R(g, 266, 146, 10, 4, '#9aa3b5');   // pá espetada
    // parede de tijolos que cede (direita)
    R(g, 387, 224, 64, 4, 'rgba(0,0,0,.25)');
    for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++) R(g, 12 * T + c * 16 + (r ? 8 : 0), 6 * T + r * 16, 15, 15, (c + r) % 2 ? '#7a4a38' : '#8a5642');
    R(g, 13 * T + 4, 6 * T + 4, 6, 6, '#3a2418');
    // sacos de terra
    R(g, T + 2, 7 * T + 4, 24, 26, '#9a8460'); R(g, T + 10, 7 * T + 1, 8, 4, '#6a5a3a');
    R(g, T + 30, 7 * T + 8, 28, 24, '#8a7650'); R(g, T + 40, 7 * T + 5, 8, 4, '#6a5a3a');
  }

  function animar(ctx, frame) {
    const a = 0.07 + 0.02 * Math.sin(frame / 9);
    ctx.fillStyle = 'rgba(255,200,120,' + a + ')'; ctx.beginPath(); ctx.ellipse(237, 100, 120, 85, 0, 0, 6.3); ctx.fill();
    ctx.fillStyle = 'rgba(255,230,170,' + (a * 2) + ')'; ctx.beginPath(); ctx.arc(237, 17, 22, 0, 6.3); ctx.fill();
  }

  FC.SALAS.push({
    mundo: 'prisao',
    id: 'tunel',
    nome: 'Túnel',
    introducao: 'O túnel que você cavou. Última área: a saída fica do outro lado.',
    falha: { titulo: 'O túnel desabou!', texto: 'O alarme soou e a terra veio abaixo antes de você sair.' },
    inicio: { x: 7 * T + 9, y: 8 * T },
    porta: { x: 11 * T, estilo: 'metal' },
    obstaculos: [
      { x: T, y: T, w: 4 * T, h: T },              // rack de ferramentas
      { x: 13 * T, y: T, w: 48, h: 40 },           // terra solta
      { x: 192, y: 128, w: 80, h: 48 },            // pilha de terra
      { x: 12 * T, y: 6 * T, w: 2 * T, h: T },     // parede de tijolos
      { x: T, y: 7 * T, w: 2 * T, h: T }           // sacos
    ],
    estacoes: [
      { id: 'lanterna', rotulo: 'Lanterna', x: 3 * T, y: 2 * T + 10, raio: 46, balao: { x: 3 * T, y: 10 } },
      { id: 'pa', rotulo: 'Pá', x: 232, y: 186, raio: 40, balao: { x: 232, y: 116 } },
      { id: 'tijolos', rotulo: 'Tijolos', x: 416, y: 234, raio: 40, balao: { x: 416, y: 176 } },
      FC.estacaoSaida('saida_tunel', 11 * T)
    ],
    bancada: { x: 112, y: 268, w: 64, h: 28 },
    apagao: { escuridao: 0.62, luzes: [{ x: 237, y: 30, r: 70 }] },
    pintar: pintar,
    animar: animar
  });
})();
