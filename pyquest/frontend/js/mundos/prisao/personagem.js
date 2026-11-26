/* Preso de macacão laranja, cabelo curto e barba por fazer (pixel art com retângulos), mesmo tamanho do rato. */
window.FC = window.FC || {};
FC.PERSONAGENS = FC.PERSONAGENS || {};

FC.PERSONAGENS.preso = function (ctx, jogador, frame, andando, olhando, equip) {
  const bob = andando ? (Math.floor(frame / 6) % 2 ? -1 : 0) : (Math.floor(frame / 40) % 2 ? -1 : 0);
  const swing = andando ? (Math.floor(frame / 6) % 2 ? 1 : -1) : 0;
  const blink = (frame % 220) < 6;
  const cx = jogador.x + jogador.w / 2, sx = cx - 12, sy = jogador.y + jogador.h - 31;
  ctx.save();
  if (olhando < 0) { ctx.translate(cx, 0); ctx.scale(-1, 1); ctx.translate(-cx, 0); }
  const r = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(sx + x, sy + y + bob, w, h); };
  const pele = '#e0ac84', peleSom = '#c48a64', cabelo = '#4a3322', laranja = '#e2872f', laranjaEsc = '#a85a14', escuro = '#2a2a30';
  ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.beginPath(); ctx.ellipse(cx, sy + 31, 9, 2.6, 0, 0, 6.3); ctx.fill();
  // pernas e sapatos
  r(8, 26, 3, 4, laranja); r(13, 26, 3, 4, laranja); r(8, 27, 3, 1, laranjaEsc); r(13, 27, 3, 1, laranjaEsc);
  r(7, 29, 5, 2, escuro); r(12, 29, 5, 2, escuro);
  // macacão, zíper, cinto e etiqueta com número
  r(6, 14, 12, 13, laranja); r(6, 14, 12, 1, laranjaEsc); r(12, 16, 1, 9, laranjaEsc); r(6, 23, 12, 1, laranjaEsc);
  r(8, 17, 3, 4, '#f4efe4'); r(9, 18, 1, 2, escuro);
  // braços e mãos
  r(3, 15 + (swing > 0 ? 1 : 0), 3, 8, laranja); r(18, 15 + (swing < 0 ? 1 : 0), 3, 8, laranja);
  r(3, 22 + (swing > 0 ? 1 : 0), 3, 3, pele); r(18, 22 + (swing < 0 ? 1 : 0), 3, 3, pele);
  // colher de fuga
  const sp = swing < 0 ? 1 : 0;
  r(21, 21 + sp, 1, 7, '#c9ced9'); r(20, 19 + sp, 3, 3, '#aeb4c2');
  // pescoço e gola
  r(10, 12, 4, 3, pele); r(9, 14, 6, 1, peleSom);
  // cabeça, orelhas e barba por fazer
  r(7, 2, 10, 11, pele); r(6, 6, 1, 3, pele); r(17, 6, 1, 3, pele);
  r(7, 10, 10, 3, '#c9a07a'); r(10, 12, 4, 1, '#c9a07a');
  // cabelo curto
  r(7, 1, 10, 3, cabelo); r(6, 3, 1, 3, cabelo); r(17, 3, 1, 3, cabelo); r(7, 4, 1, 2, cabelo); r(16, 4, 1, 2, cabelo);
  // rosto
  r(9, 6, 2, 1, cabelo); r(13, 6, 2, 1, cabelo);
  if (blink) { r(9, 8, 2, 1, escuro); r(13, 8, 2, 1, escuro); }
  else { r(9, 7, 2, 2, '#ffffff'); r(13, 7, 2, 2, '#ffffff'); r(10, 7, 1, 2, escuro); r(14, 7, 1, 2, escuro); }
  r(11, 9, 2, 1, peleSom); r(10, 11, 4, 1, '#7a4a3a');
  if (equip && FC.acessorios) FC.acessorios.desenharPersonagem(ctx, sx, sy + bob, equip, -2, 7);
  ctx.restore();
};
