/* Desenho do rato cozinheiro (pixel art feita com retângulos). */
window.FC = window.FC || {};

FC.desenharRato=function(ctx,jogador,frame,andando,olhando){
  var bob=andando?(Math.floor(frame/6)%2?-1:0):(Math.floor(frame/40)%2?-1:0);
  var swing=andando?(Math.floor(frame/6)%2?1:-1):0;
  var wag=Math.floor(frame/18)%2;
  var blink=(frame%220)<6;
  var cx=jogador.x+jogador.w/2, sx=cx-12, sy=jogador.y+jogador.h-31;
  ctx.save();
  if(olhando<0){ctx.translate(cx,0);ctx.scale(-1,1);ctx.translate(-cx,0);}
  function r(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(sx+x,sy+y+bob,w,h);}
  ctx.fillStyle='rgba(0,0,0,.3)'; ctx.beginPath(); ctx.ellipse(cx,sy+31,9,2.6,0,0,6.3); ctx.fill();
  // rabo longo e fino
  r(1,28,7,1,'#c79a96'); r(0,25,2,4,'#c79a96'); r(0,22+wag,2,3,'#c79a96');
  // calça xadrez de cozinheiro e sapatos
  r(8,27,3,3,'#d3d3da'); r(13,27,3,3,'#d3d3da'); r(9,28,1,1,'#44444b'); r(14,28,1,1,'#44444b');
  r(7,29,5,2,'#2e2a26'); r(12,29,5,2,'#2e2a26');
  // dólmã branco
  r(6,16,12,12,'#f4f2ee'); r(12,16,1,12,'#d5d1c7'); r(6,26,12,2,'#dcd8ce');
  r(9,18,2,2,'#3a4a66'); r(14,18,2,2,'#3a4a66'); r(9,21,2,2,'#3a4a66'); r(14,21,2,2,'#3a4a66');
  // avental azul-marinho
  r(7,23,10,5,'#2f4a73'); r(6,24,1,2,'#2f4a73'); r(17,24,1,2,'#2f4a73'); r(8,23,8,1,'#3d5d8f');
  // braços com punho
  r(3,17+(swing>0?1:0),3,6,'#f4f2ee'); r(18,17+(swing<0?1:0),3,6,'#f4f2ee');
  r(3,23+(swing>0?1:0),3,1,'#cfcabf'); r(18,23+(swing<0?1:0),3,1,'#cfcabf');
  r(3,24+(swing>0?1:0),3,2,'#c79a96'); r(18,24+(swing<0?1:0),3,2,'#c79a96');
  // colher de pau
  var sp=(swing<0?1:0);
  r(21,19+sp,1,8,'#c9a56a'); r(20,17+sp,3,3,'#b78f50');
  // lenço no pescoço
  r(8,15,8,3,'#b5483f'); r(11,17,2,2,'#b5483f');
  // orelhas
  r(4,3,5,7,'#8f897b'); r(5,4,3,5,'#c79a96'); r(15,3,5,7,'#8f897b'); r(16,4,3,5,'#c79a96');
  // cabeça estreita com focinho
  r(7,6,10,9,'#8f897b'); r(9,13,6,3,'#a39d8e'); r(11,15,2,2,'#2e2428');
  if(blink){ r(9,11,2,1,'#14110f'); r(13,11,2,1,'#14110f'); }
  else{ r(9,10,2,2,'#14110f'); r(13,10,2,2,'#14110f'); r(9,10,1,1,'#d8d3c6'); r(13,10,1,1,'#d8d3c6'); }
  r(3,14,4,1,'#cfcabd'); r(17,14,4,1,'#cfcabd'); r(4,16,3,1,'#cfcabd'); r(17,16,3,1,'#cfcabd');
  // touca alta de cozinheiro
  r(7,-1,10,6,'#f7f5f0'); r(5,-5,14,5,'#f7f5f0'); r(8,-8,8,4,'#f7f5f0');
  r(9,-8,1,12,'#dcd8ce'); r(12,-8,1,12,'#dcd8ce'); r(15,-8,1,12,'#dcd8ce');
  r(7,3,10,2,'#e7e3da'); r(7,5,10,1,'#c9c4b8');
  ctx.restore();
};
