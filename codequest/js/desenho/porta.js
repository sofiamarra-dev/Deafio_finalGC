/* Porta de saída de cada sala. O estilo vem de sala.porta (madeira ou vidro). */
window.FC = window.FC || {};

FC.desenharPorta = function (ctx, sala, aberta, resolvidas, total) {
  const R = FC.desenho.R, T = FC.CONFIG.T;
  const p = sala.porta, x = p.x;
  const latao = FC.desenho.corDoTema('--accent', '#f2b84b');
  const verde = '#5fd4a0', vermelho = '#e05a5a';

  if (aberta) {
    if (p.estilo === 'metal') {
      R(ctx, x, 0, T, T, '#161a22'); R(ctx, x, 0, 4, T, '#4a505c'); R(ctx, x + T - 4, 0, 4, T, '#4a505c');   // porta aberta: só o vão e os batentes
      R(ctx, x + 6, 10, 20, 2, '#8ec1d6'); R(ctx, x + 10, 18, 12, 2, '#8ec1d6');
    } else if (p.estilo === 'vidro') {
      R(ctx, x, 0, T, T, '#cfe9f5'); R(ctx, x + 4, 6, 8, 2, '#ffffff'); R(ctx, x + 18, 12, 6, 2, '#ffffff'); R(ctx, x, 26, T, 6, '#9aa7b3');
    } else {
      R(ctx, x, 0, T, T, '#0a0c18'); R(ctx, x + 6, 8, 2, 2, '#f6e9b8'); R(ctx, x + 20, 14, 2, 2, '#f6e9b8'); R(ctx, x + 13, 5, 2, 2, '#f6e9b8');
    }
  } else {
    if (p.estilo === 'metal') {
      R(ctx, x, 0, T, T, '#59606b');
      R(ctx, x + 3, 3, T - 6, T - 6, '#6d7580');
      for (let i = 0; i < 5; i++) R(ctx, x + 6 + i * 5, 3, 2, T - 6, '#2b2f38');          // grades verticais
      R(ctx, x + 3, 12, T - 6, 2, '#2b2f38');
      R(ctx, x + 20, 18, 7, 5, '#2b2f38'); R(ctx, x + 22, 19, 3, 3, latao);               // fechadura
      R(ctx, x + 6, 22, 10, 6, resolvidas === total ? verde : vermelho);                   // luz de status
    } else if (p.estilo === 'vidro') {
      R(ctx, x, 0, T, T, '#2a2f3d');
      R(ctx, x + 3, 3, 12, 22, '#7fa9bd'); R(ctx, x + 17, 3, 12, 22, '#7fa9bd');
      R(ctx, x + 5, 5, 3, 10, 'rgba(255,255,255,.35)'); R(ctx, x + 19, 5, 3, 10, 'rgba(255,255,255,.35)');
      R(ctx, x + 12, 14, 2, 8, latao); R(ctx, x + 18, 14, 2, 8, latao);
      R(ctx, x + 11, 24, 10, 4, resolvidas === total ? verde : vermelho);
    } else {
      R(ctx, x, 0, T, T, p.cor);
      R(ctx, x + 4, 4, 10, 12, p.painel); R(ctx, x + 18, 4, 10, 12, p.painel);
      R(ctx, x + 22, 18, 5, 5, latao);
      R(ctx, x + 11, 18, 10, 7, resolvidas === total ? verde : vermelho);
      R(ctx, x + 13, 14, 6, 5, '#9aa3b5');
    }
    // luzinhas: uma para cada painel resolvido
    const ini = x + 16 - Math.round((total * 7 - 3) / 2);
    for (let i = 0; i < total; i++) R(ctx, ini + i * 7, 28, 4, 3, i < resolvidas ? verde : '#3a2a1c');
  }
  ctx.strokeStyle = latao; ctx.lineWidth = 3; ctx.strokeRect(x + 1.5, 1.5, T - 3, T - 3); ctx.lineWidth = 1;
};
