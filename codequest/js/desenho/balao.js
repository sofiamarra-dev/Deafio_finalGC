/* Balão que pula em cima de cada móvel interativo. */
window.FC = window.FC || {};

/* estado: { frame, resolvida, trancada, contagem } */
FC.desenharBalao = function (ctx, estacao, estado) {
  const R = FC.desenho.R;
  const x = estacao.balao.x;
  const y = estacao.balao.y + Math.sin(estado.frame / 12) * 2;
  const cor = estado.resolvida ? '#5fd4a0' : (estado.trancada ? '#8d8fae' : (estacao.treino ? '#4fb3c8' : '#f2b84b'));
  const w = estado.trancada ? 24 : 16;

  R(ctx, x - w / 2, y - 8, w, 16, cor);
  R(ctx, x - w / 2 + 2, y - 10, w - 4, 2, cor);
  R(ctx, x - w / 2 + 2, y + 8, w - 4, 2, cor);
  R(ctx, x - 2, y + 10, 4, 3, cor);

  ctx.fillStyle = '#1b1630';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 11px monospace';
  if (estado.resolvida) {
    ctx.strokeStyle = '#0c2a1e';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x - 4, y); ctx.lineTo(x - 1, y + 3); ctx.lineTo(x + 4, y - 3); ctx.stroke();
    ctx.lineWidth = 1;
  } else if (estado.trancada) {
    ctx.font = 'bold 9px monospace';
    ctx.fillText(estado.contagem, x, y + 1);
  } else {
    ctx.fillText(estacao.treino ? 'T' : '!', x, y + 1);
  }
  ctx.textAlign = 'start';
  ctx.textBaseline = 'alphabetic';
};
