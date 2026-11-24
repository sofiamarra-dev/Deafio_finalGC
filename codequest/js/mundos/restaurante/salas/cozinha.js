/* Sala 1: Cozinha. */
(function () {
  const T = FC.CONFIG.T, W = FC.CONFIG.COLUNAS, H = FC.CONFIG.LINHAS;
  const R = FC.desenho.R, E = FC.desenho.E;

  function pintar(g){
    // parede
    R(g,0,0,480,T,'#2c3e55');
    for(var i=0;i<30;i++){R(g,i*16,0,1,24,'#34496a');}
    R(g,0,12,480,1,'#34496a'); R(g,0,24,480,8,'#223046'); R(g,0,24,480,1,'#3b5276');
    // piso xadrez
    for(var r=1;r<H;r++){for(var c=0;c<W;c++){R(g,c*T,r*T,T,T,((r+c)%2)?'#3a5660':'#324d57');}}
    // luz da janela
    g.fillStyle='rgba(255,236,190,.07)'; g.beginPath(); g.moveTo(384,T); g.lineTo(448,T); g.lineTo(380,210); g.lineTo(290,210); g.closePath(); g.fill();
    // paredes laterais e de baixo
    R(g,0,T,8,288,'#1a1f36'); R(g,472,T,8,288,'#1a1f36'); R(g,0,314,480,6,'#1a1f36');
    // janela
    R(g,410,3,44,22,'#efe2c4'); R(g,413,6,38,16,'#9fd6ea'); R(g,431,6,2,16,'#efe2c4'); R(g,413,13,38,2,'#efe2c4'); R(g,416,8,7,2,'#d8f1fa');
    // relógio
    E(g,300,14,10,10,'#7a5a3a'); E(g,300,14,8,8,'#f6f0e0');
    g.strokeStyle='#3a2a1c'; g.lineWidth=1.5; g.beginPath(); g.moveTo(300,14); g.lineTo(300,9); g.moveTo(300,14); g.lineTo(304,16); g.stroke();
    // panelas penduradas
    R(g,3*T+2,4,60,2,'#8a8fa5');
    R(g,3*T+8,6,2,4,'#8a8fa5'); R(g,3*T+4,10,12,10,'#7b86a0'); R(g,3*T+4,10,12,2,'#98a3bd');
    R(g,3*T+35,6,2,12,'#c9b078'); R(g,3*T+32,16,8,5,'#c9b078');
    R(g,3*T+47,8,12,11,'#4a4f63');
    // sombra de móveis
    R(g,T,2*T,2*T,5,'rgba(0,0,0,.2)'); R(g,3*T,2*T,2*T,5,'rgba(0,0,0,.2)'); R(g,10*T,3*T,2*T,5,'rgba(0,0,0,.2)');
    // balcão com gavetas
    R(g,T,T,2*T,12,'#c19a64'); R(g,T,T,2*T,3,'#d7b37c'); R(g,T,T+12,2*T,20,'#8a6240');
    R(g,T+4,T+15,26,14,'#9b724a'); R(g,T+34,T+15,26,14,'#9b724a'); R(g,T+15,T+21,4,3,'#f2d27a'); R(g,T+45,T+21,4,3,'#f2d27a');
    R(g,T+6,T+3,12,6,'#e8e4f2'); R(g,T+8,T+1,3,3,'#e5655a'); R(g,T+12,T+1,3,3,'#8fc86a');
    R(g,T+36,T+3,22,7,'#d9bd8a');
    // fogão
    R(g,3*T,T,2*T,12,'#2a2d3b'); R(g,3*T,T+12,2*T,20,'#41475c');
    E(g,3*T+16,T+6,9,3,'#14161e'); E(g,3*T+48,T+6,9,3,'#14161e');
    R(g,3*T+8,T+16,48,11,'#1c1e2a'); R(g,3*T+10,T+23,44,3,'#e08a3a');
    R(g,3*T+12,T+13,4,2,'#c9ced9'); R(g,3*T+28,T+13,4,2,'#c9ced9'); R(g,3*T+44,T+13,4,2,'#c9ced9');
    // geladeira
    R(g,10*T,T,2*T,2*T,'#dfe8ee'); R(g,10*T+58,T,6,2*T,'#c4d0da'); R(g,10*T,T,64,3,'#f3f8fb'); R(g,10*T,T+22,64,3,'#aebdca');
    R(g,10*T+52,T+8,3,10,'#7f8fa0'); R(g,10*T+52,T+30,3,18,'#7f8fa0'); R(g,10*T,3*T-3,64,3,'#9fb0bd');
    R(g,10*T+10,T+30,6,6,'#e5655a'); R(g,10*T+20,T+34,6,6,'#f6d35c'); R(g,10*T+12,T+42,14,10,'#fffbe8'); R(g,10*T+14,T+45,10,1,'#b9a98a'); R(g,10*T+14,T+48,8,1,'#b9a98a');
    // tapete
    E(g,240,228,96,42,'#6b3f5a'); g.strokeStyle='#a67796'; g.lineWidth=2; g.beginPath(); g.ellipse(240,228,84,34,0,0,6.3); g.stroke();
    // mesa com toalha xadrez
    R(g,2*T+3,4*T+4,3*T,6,'rgba(0,0,0,.22)');
    R(g,2*T+4,3*T+26,4,12,'#5a3f2a'); R(g,5*T-8,3*T+26,4,12,'#5a3f2a');
    for(var xx=0;xx<6;xx++){for(var yy=0;yy<2;yy++){R(g,2*T+xx*16,3*T+10+yy*8,16,8,((xx+yy)%2)?'#fbf6ea':'#d9544f');}}
    R(g,2*T,3*T+26,96,5,'#c14843');
    E(g,3*T+16,3*T+16,12,4,'#f4f1fa'); R(g,3*T+10,3*T+10,14,7,'#f6cf55'); R(g,3*T+14,3*T+12,3,3,'#e0a92e'); R(g,3*T+19,3*T+14,2,2,'#e0a92e');
    // lixeira
    R(g,12*T+3,7*T+30,26,3,'rgba(0,0,0,.22)'); R(g,12*T+4,7*T+8,24,24,'#5d6a77'); R(g,12*T+1,7*T+4,30,6,'#7a899c'); R(g,12*T+8,7*T+12,2,16,'#7e8ea1');
    // planta
    R(g,T+4,8*T+8,24,4,'#cf7a50'); R(g,T+6,8*T+12,20,14,'#b8643f');
    R(g,T+10,8*T-6,5,16,'#3f9a6a'); R(g,T+16,8*T-12,5,22,'#4fb37c'); R(g,T+4,8*T,7,10,'#3f9a6a'); R(g,T+20,8*T-2,7,12,'#3f9a6a');
    // casinha do rato na parede
    g.fillStyle='#07080f'; g.beginPath(); g.arc(8,6*T+22,11,-Math.PI/2,Math.PI/2); g.fill();
    g.strokeStyle='#c19a64'; g.lineWidth=2; g.beginPath(); g.arc(8,6*T+22,12,-Math.PI/2,Math.PI/2); g.stroke();
    R(g,10,6*T+30,10,3,'#e5655a');
  }

  function vapor(ctx,frame){
    for(var i=0;i<3;i++){
      var off=((frame*0.35+i*9)%26), a=1-off/26;
      E(ctx,3*T+14+Math.sin((frame+i*20)/14)*3+i*4,T-2-off,3+i,3+i,'rgba(255,255,255,'+(0.3*a)+')');
    }
    E(ctx,3*T+16,T+4,11,4,'#4a4f63'); R(ctx,3*T+26,T+3,10,3,'#4a4f63'); E(ctx,3*T+16,T+3,9,3,'#2a2d3b');
  }

  FC.SALAS.push({
    mundo: 'restaurante',
    id: 'cozinha',
    nome: 'Cozinha',
    introducao: 'Um rato cozinheiro precisa escapar antes que o tempo acabe e a cozinha exploda.',
    falha: { titulo: 'A cozinha explodiu!', texto: 'O tempo acabou e o gás chegou ao fogão.' },
    inicio: { x: 7 * T + 9, y: 7 * T },
    porta: { x: 7 * T, estilo: 'madeira', cor: '#6b4b24', painel: '#7d5a2e' },
    obstaculos: [
      { x: T, y: T, w: 4 * T, h: T },            // balcão e fogão
      { x: 10 * T, y: T, w: 2 * T, h: 2 * T },   // geladeira
      { x: 2 * T, y: 3 * T + 10, w: 3 * T, h: 22 }, // mesa
      { x: 12 * T + 1, y: 7 * T + 8, w: 30, h: 24 }, // lixeira
      { x: T + 4, y: 8 * T + 8, w: 24, h: 18 }   // planta
    ],
    estacoes: [
      { id: 'geladeira', rotulo: 'Geladeira', x: 11 * T, y: 3 * T + 6, raio: 46, balao: { x: 11 * T, y: 10 } },
      { id: 'fogao', rotulo: 'Fogão', x: 4 * T, y: 2 * T + 10, raio: 40, balao: { x: 4 * T, y: 10 } },
      { id: 'gaveta', rotulo: 'Gaveta', x: 2 * T, y: 2 * T + 10, raio: 36, balao: { x: 2 * T, y: 10 } },
      FC.estacaoSaida('saida_cozinha', 7 * T)
    ],
    bancada: { x: 96, y: 268, w: 64, h: 28 },
    pintar: pintar,
    animar: vapor
  });
})();
