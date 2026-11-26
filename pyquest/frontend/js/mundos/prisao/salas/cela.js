/* Área 1 da prisão: a cela. Concreto, beliche, janela com grades, privada e balde. */
(function () {
  const T = FC.CONFIG.T, W = FC.CONFIG.COLUNAS, H = FC.CONFIG.LINHAS;
  const R = FC.desenho.R, E = FC.desenho.E;

  function pintar(g) {
    // parede de blocos de concreto
    R(g, 0, 0, 480, T, '#59606b');
    for (let r = 0; r < 2; r++) for (let c = -1; c < 16; c++) R(g, c * 32 + (r ? 16 : 0) + 1, r * 16 + 1, 30, 14, (c + r) % 2 ? '#66707c' : '#6d7783');
    R(g, 0, 24, 480, 8, '#3f454e'); R(g, 0, 24, 480, 1, '#7d8794');
    // piso de concreto manchado
    for (let r = 1; r < H; r++) for (let c = 0; c < W; c++) R(g, c * T, r * T, T, T, ((r * 3 + c) % 5 === 0) ? '#4a5059' : ((r + c) % 2 ? '#4f5660' : '#4b525b'));
    R(g, 0, T, 8, 288, '#23272e'); R(g, 472, T, 8, 288, '#23272e'); R(g, 0, 314, 480, 6, '#23272e');

    // janela com grades (na parede, em cima do beliche)
    R(g, 3 * T + 2, 4, 60, 22, '#1c2230'); R(g, 3 * T + 4, 6, 56, 18, '#7aa6c4'); R(g, 3 * T + 8, 8, 14, 3, '#b6d6ea');
    for (let i = 0; i < 5; i++) R(g, 3 * T + 10 + i * 12, 4, 3, 22, '#2b2f38');
    R(g, 3 * T + 2, 12, 60, 2, '#2b2f38');
    // luz da janela no chão
    g.fillStyle = 'rgba(190,220,245,.08)'; g.beginPath(); g.moveTo(3 * T + 4, T); g.lineTo(5 * T, T); g.lineTo(5 * T + 40, 200); g.lineTo(3 * T + 20, 200); g.closePath(); g.fill();

    // beliche: dois colchões e armação
    R(g, T, T + 26, 4 * T, 6, 'rgba(0,0,0,.25)');
    R(g, T, T, 4 * T, T, '#3a3f49');
    R(g, T + 2, T + 3, 4 * T - 4, 10, '#8a8f99'); R(g, T + 2, T + 3, 30, 10, '#d8d4c8');       // colchão de cima e travesseiro
    R(g, T + 2, T + 17, 4 * T - 4, 10, '#7c818b'); R(g, T + 2, T + 17, 30, 10, '#cfcabb');     // colchão de baixo
    R(g, T, T, 3, T, '#23272e'); R(g, 5 * T - 3, T, 3, T, '#23272e'); R(g, T, T + 14, 4 * T, 2, '#23272e');
    // riscos de dias na armação (grupos de 5)
    for (let k = 0; k < 3; k++) { for (let i = 0; i < 4; i++) R(g, 2 * T - 6 + k * 14 + i * 2, T + 5, 1, 6, '#e8e4d8'); R(g, 2 * T - 7 + k * 14, T + 7, 9, 1, '#e8e4d8'); }

    // bloco da privada e pia (direita)
    R(g, 10 * T, 3 * T, 2 * T, 5, 'rgba(0,0,0,.25)');
    R(g, 10 * T, T, 2 * T, 2 * T, '#9aa3ad'); R(g, 10 * T, T, 2 * T, 3, '#c0c9d2');
    E(g, 10 * T + 18, 2 * T - 8, 10, 7, '#e8eef2'); R(g, 10 * T + 10, 2 * T - 22, 16, 8, '#8d97a1');
    R(g, 10 * T + 38, T + 8, 18, 12, '#e8eef2'); R(g, 10 * T + 44, T + 20, 6, 6, '#7d8791'); R(g, 10 * T + 46, T + 4, 2, 6, '#7d8791');

    // tapete de ginástica improvisado
    R(g, 9 * T + 10, 3 * T + 12, 4 * T - 14, 6, '#2d4a6b'); R(g, 9 * T + 10, 3 * T + 12, 4 * T - 14, 2, '#3f6590');
    // banco
    R(g, 2 * T, 3 * T + 10, 3 * T, 22, '#6a5a44'); R(g, 2 * T, 3 * T + 10, 3 * T, 4, '#8a7658'); R(g, 2 * T + 6, 3 * T + 28, 4, 4, '#3a2f22'); R(g, 5 * T - 10, 3 * T + 28, 4, 4, '#3a2f22');
    R(g, 2 * T + 12, 3 * T + 6, 12, 4, '#d8d0b8');   // pratinho
    // balde e cobertores
    R(g, 12 * T + 1, 7 * T + 8, 30, 24, '#6e7782'); R(g, 12 * T + 1, 7 * T + 8, 30, 4, '#99a2ad'); E(g, 12 * T + 16, 7 * T + 9, 14, 3, '#2a2e35');
    R(g, T + 4, 8 * T + 8, 24, 18, '#7b4f3f'); R(g, T + 4, 8 * T + 8, 24, 4, '#9a6a56'); R(g, T + 8, 8 * T + 14, 16, 2, '#5d3a2e');
  }

  function animar(ctx, frame) {
    const a = 0.05 + 0.015 * Math.sin(frame / 40);
    ctx.fillStyle = 'rgba(190,220,245,' + a + ')';
    ctx.beginPath(); ctx.ellipse(130, 130, 90, 70, 0, 0, 6.3); ctx.fill();
  }

  FC.SALAS.push({
    mundo: 'prisao',
    id: 'cela',
    nome: 'Cela',
    introducao: 'Você acordou na cela 7. O guarda passa em pouco tempo: resolva os painéis e saia antes do alarme.',
    falha: { titulo: 'O alarme disparou!', texto: 'O guarda voltou antes de você sair da cela.' },
    inicio: { x: 7 * T + 9, y: 7 * T },
    porta: { x: 7 * T, estilo: 'metal' },
    obstaculos: [
      { x: T, y: T, w: 4 * T, h: T },            // beliche
      { x: 10 * T, y: T, w: 2 * T, h: 2 * T },   // privada e pia
      { x: 2 * T, y: 3 * T + 10, w: 3 * T, h: 22 }, // banco
      { x: 12 * T + 1, y: 7 * T + 8, w: 30, h: 24 }, // balde
      { x: T + 4, y: 8 * T + 8, w: 24, h: 18 }   // cobertores
    ],
    estacoes: [
      { id: 'flexoes', rotulo: 'Chão', x: 11 * T, y: 3 * T + 6, raio: 46, balao: { x: 11 * T, y: 10 } },
      { id: 'grade', rotulo: 'Janela', x: 4 * T, y: 2 * T + 10, raio: 40, balao: { x: 4 * T, y: 10 } },
      { id: 'riscos', rotulo: 'Parede', x: 2 * T, y: 2 * T + 10, raio: 36, balao: { x: 2 * T, y: 10 } },
      FC.estacaoSaida('saida_cela', 7 * T)
    ],
    bancada: { x: 96, y: 268, w: 64, h: 28 },
    pintar: pintar,
    animar: animar
  });
})();
