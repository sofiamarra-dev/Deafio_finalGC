/* Guaxinim de uniforme listrado (pixel art com retângulos), mesmo tamanho do rato. */
window.FC = window.FC || {};
FC.PERSONAGENS = FC.PERSONAGENS || {};

FC.PERSONAGENS.guaxinim = function (ctx, jogador, frame, andando, olhando) {
  const bob = andando ? (Math.floor(frame / 6) % 2 ? -1 : 0) : (Math.floor(frame / 40) % 2 ? -1 : 0);
  const swing = andando ? (Math.floor(frame / 6) % 2 ? 1 : -1) : 0;
  const wag = Math.floor(frame / 18) % 2;
  const blink = (frame % 220) < 6;
  const cx = jogador.x + jogador.w / 2, sx = cx - 12, sy = jogador.y + jogador.h - 31;
  ctx.save();
  if (olhando < 0) { ctx.translate(cx, 0); ctx.scale(-1, 1); ctx.translate(-cx, 0); }
  const r = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(sx + x, sy + y + bob, w, h); };
  ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.beginPath(); ctx.ellipse(cx, sy + 31, 9, 2.6, 0, 0, 6.3); ctx.fill();
  // rabo anelado
  const aneis = ['#8c8a92', '#2a2a30'];
  for (let i = 0; i < 6; i++) r(0 + (i > 3 ? 1 : 0), 27 - i * 2 - (i > 3 ? wag : 0), 4, 2, aneis[i % 2]);
  r(1, 14 - wag, 3, 2, '#2a2a30');
  // pernas de uniforme e sapatos
  r(8, 27, 3, 3, '#e8e6e0'); r(13, 27, 3, 3, '#e8e6e0'); r(8, 28, 3, 1, '#23232a'); r(13, 28, 3, 1, '#23232a');
  r(7, 29, 5, 2, '#1c1c22'); r(12, 29, 5, 2, '#1c1c22');
  // uniforme listrado (branco e preto)
  r(6, 16, 12, 12, '#ecebe6');
  for (let y = 17; y < 28; y += 3) r(6, y, 12, 1, '#23232a');
  r(6, 16, 12, 1, '#23232a');
  // número no peito
  r(9, 19, 6, 5, '#f4f2ee'); r(10, 20, 1, 3, '#23232a'); r(12, 20, 1, 3, '#23232a'); r(11, 20, 1, 1, '#23232a'); r(11, 22, 1, 1, '#23232a');
  // braços listrados e patas
  r(3, 17 + (swing > 0 ? 1 : 0), 3, 6, '#ecebe6'); r(18, 17 + (swing < 0 ? 1 : 0), 3, 6, '#ecebe6');
  r(3, 19 + (swing > 0 ? 1 : 0), 3, 1, '#23232a'); r(18, 19 + (swing < 0 ? 1 : 0), 3, 1, '#23232a');
  r(3, 23 + (swing > 0 ? 1 : 0), 3, 3, '#4a4852'); r(18, 23 + (swing < 0 ? 1 : 0), 3, 3, '#4a4852');
  // colher de fuga
  const sp = swing < 0 ? 1 : 0;
  r(21, 21 + sp, 1, 7, '#c9ced9'); r(20, 19 + sp, 3, 3, '#aeb4c2');
  // pescoço
  r(8, 15, 8, 2, '#8c8a92');
  // orelhas
  r(4, 3, 5, 6, '#8c8a92'); r(5, 4, 3, 4, '#2a2a30'); r(15, 3, 5, 6, '#8c8a92'); r(16, 4, 3, 4, '#2a2a30');
  // cabeça larga
  r(5, 6, 14, 10, '#8c8a92'); r(8, 13, 8, 3, '#d8d6d0'); r(11, 14, 2, 2, '#1c1c22');
  // máscara escura e olhos
  r(5, 9, 14, 3, '#2a2a30'); r(11, 6, 2, 4, '#d8d6d0');
  if (blink) { r(8, 10, 3, 1, '#d8d6d0'); r(13, 10, 3, 1, '#d8d6d0'); }
  else { r(8, 10, 3, 2, '#f4f2ee'); r(13, 10, 3, 2, '#f4f2ee'); r(9, 10, 1, 2, '#14110f'); r(14, 10, 1, 2, '#14110f'); }
  // bigodes
  r(2, 14, 4, 1, '#d8d6d0'); r(18, 14, 4, 1, '#d8d6d0');
  // boné de preso listrado
  r(6, 3, 12, 4, '#ecebe6'); r(6, 4, 12, 1, '#23232a'); r(6, 6, 12, 1, '#23232a'); r(7, 1, 10, 3, '#ecebe6'); r(7, 2, 10, 1, '#23232a');
  ctx.restore();
};
