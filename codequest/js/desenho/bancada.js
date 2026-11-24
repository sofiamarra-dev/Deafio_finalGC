/* Bancada de treino: aparece na sala quando o aluno erra o mesmo desafio várias vezes. */
window.FC = window.FC || {};

FC.desenharBancada = function (ctx, b, frame, t, feito) {
  const R = FC.desenho.R;
  const a = Math.min(1, t / 20);          // aparece aos poucos, caindo do alto
  ctx.save();
  ctx.globalAlpha = a;
  ctx.translate(0, Math.round((1 - a) * -14));

  R(ctx, b.x + 3, b.y + b.h, b.w, 4, 'rgba(0,0,0,.25)');                      // sombra
  R(ctx, b.x + 4, b.y + 10, 5, b.h - 10, '#5a3f2a'); R(ctx, b.x + b.w - 9, b.y + 10, 5, b.h - 10, '#5a3f2a'); // pernas
  R(ctx, b.x, b.y, b.w, 10, '#c9a56a'); R(ctx, b.x, b.y, b.w, 3, '#e0c088'); R(ctx, b.x, b.y + 8, b.w, 2, '#8a6a45'); // tampo
  R(ctx, b.x + 8, b.y + 2, 18, 7, '#f4efe4'); R(ctx, b.x + 16, b.y + 2, 1, 7, '#c9c4b8');   // caderno
  R(ctx, b.x + 10, b.y + 4, 5, 1, '#4fb3c8'); R(ctx, b.x + 19, b.y + 4, 5, 1, '#4fb3c8');
  R(ctx, b.x + 32, b.y + 4, 14, 2, '#f2c94c'); R(ctx, b.x + 45, b.y + 4, 2, 2, '#e5655a'); // lápis

  // plaquinha
  R(ctx, b.x + b.w - 14, b.y - 8, 2, 8, '#5a3f2a');
  R(ctx, b.x + b.w - 26, b.y - 18, 26, 10, feito ? '#5fd4a0' : '#4fb3c8');
  ctx.fillStyle = '#08242c'; ctx.font = 'bold 6px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(feito ? 'FEITO' : 'TREINO', b.x + b.w - 13, b.y - 13);
  ctx.textAlign = 'start'; ctx.textBaseline = 'alphabetic';
  ctx.restore();
};
