/* Confete, partículas e a explosão da sala. */
window.FC = window.FC || {};

(function () {
  const R = FC.desenho.R;

  function desenharExplosao(ctx,t){
    // clarão branco
    if(t<7){ctx.fillStyle='rgba(255,255,255,'+(1-t/7)+')';ctx.fillRect(0,0,480,320);}
    // bolas de fogo
    var fade=Math.max(0,1-(t-35)/45), cs=['#fff2b0','#ffb62e','#ff7a2e','#e5452f','#ffb62e','#fff2b0'];
    ctx.save(); ctx.globalAlpha=fade;
    for(var i=0;i<6;i++){
      var rr=Math.min(150,Math.max(0,t*5.5-i*9));
      if(rr<=0)continue;
      ctx.fillStyle=cs[i]; ctx.beginPath();
      ctx.arc(240+Math.cos(i*1.7)*70,170+Math.sin(i*2.3)*45,rr*(1-i*0.08),0,6.283); ctx.fill();
    }
    ctx.restore();
    // fumaça escurecendo a cena
    if(t>28){ctx.fillStyle='rgba(18,14,14,'+Math.min(.82,(t-28)/50)+')';ctx.fillRect(0,0,480,320);}
    // BUM!
    if(t>3&&t<75){
      var sc=Math.min(1,(t-3)/8), a=t>55?Math.max(0,1-(t-55)/20):1;
      ctx.save(); ctx.globalAlpha=a; ctx.translate(240,160); ctx.scale(sc,sc); ctx.rotate(-0.08);
      ctx.font='bold 64px "Pixelify Sans",monospace'; ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.lineWidth=8; ctx.strokeStyle='#3a1208'; ctx.strokeText('BUM!',0,0);
      ctx.fillStyle='#ffd23f'; ctx.fillText('BUM!',0,0);
      ctx.restore();
    }
  }

  function desenharAlarme(ctx, t) {
    // luz giratória vermelha: alterna a cada ~14 quadros
    const on = Math.floor(t / 14) % 2 === 0;
    ctx.fillStyle = 'rgba(224,40,40,' + (on ? 0.38 : 0.12) + ')'; ctx.fillRect(0, 0, 480, 320);
    ctx.fillStyle = 'rgba(14,6,10,' + Math.min(.7, t / 60) + ')'; ctx.fillRect(0, 0, 480, 320);
    // faixas de alerta no alto e embaixo
    for (let x = -20; x < 500; x += 28) {
      ctx.fillStyle = on ? '#ffd23f' : '#3a1208';
      ctx.beginPath(); ctx.moveTo(x + (t % 28), 0); ctx.lineTo(x + 14 + (t % 28), 0); ctx.lineTo(x + 6 + (t % 28), 12); ctx.lineTo(x - 8 + (t % 28), 12); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(x - (t % 28) + 28, 308); ctx.lineTo(x - (t % 28) + 42, 308); ctx.lineTo(x - (t % 28) + 34, 320); ctx.lineTo(x - (t % 28) + 20, 320); ctx.closePath(); ctx.fill();
    }
    if (t > 4) {
      const sc = Math.min(1, (t - 4) / 8);
      ctx.save(); ctx.translate(240, 160); ctx.scale(sc, sc);
      ctx.font = 'bold 54px "Pixelify Sans",monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.lineWidth = 8; ctx.strokeStyle = '#2a0808'; ctx.strokeText('ALARME!', 0, 0);
      ctx.fillStyle = on ? '#ffffff' : '#ff6a5a'; ctx.fillText('ALARME!', 0, 0);
      ctx.restore();
    }
  }

  FC.efeitos = {
    modo: 'explosao',
    particulas: [],
    t: -1, // frames desde a explosão (-1 = não explodiu)

    reiniciar() { this.particulas.length = 0; this.t = -1; },
    explodindo() { return this.t >= 0; },
    falhando() { return this.t >= 0; },

    /* Falha do mundo da prisão: sirene em vez de explosão. */
    alarmar() { this.t = 0; this.modo = 'alarme'; },

    confete(x, y) {
      const cores = ['#f2b84b', '#5fd4a0', '#e5655a', '#4fb3c8', '#ffffff'];
      for (let i = 0; i < 22; i++) {
        this.particulas.push({ x: x, y: y, vx: (Math.random() - .5) * 4, vy: -Math.random() * 3.5 - 1, vida: 40 + Math.random() * 20, tam: 3, cor: cores[i % cores.length] });
      }
    },

    explodir() {
      this.t = 0; this.modo = 'explosao';
      const cores = ['#ffb62e', '#ff7a2e', '#e5452f', '#f7f5f0', '#7a5a3a', '#c9d4dc', '#4a4f63', '#d9544f', '#f6cf55'];
      for (let i = 0; i < 140; i++) {
        const ang = Math.random() * 6.283, vel = 1.5 + Math.random() * 7;
        this.particulas.push({ x: 240, y: 170, vx: Math.cos(ang) * vel, vy: Math.sin(ang) * vel - 2, vida: 60 + Math.random() * 50, tam: 3 + Math.floor(Math.random() * 4), cor: cores[i % cores.length] });
      }
    },

    atualizar() {
      if (this.t >= 0) this.t++;
      for (let i = this.particulas.length - 1; i >= 0; i--) {
        const p = this.particulas[i];
        p.x += p.vx; p.y += p.vy; p.vy += 0.15; p.vida--;
        if (p.vida <= 0) this.particulas.splice(i, 1);
      }
    },

    desenharParticulas(ctx) {
      this.particulas.forEach(p => R(ctx, p.x, p.y, p.tam, p.tam, p.cor));
    },

    desenharExplosao(ctx) {
      if (this.t < 0) return;
      if (this.modo === 'alarme') desenharAlarme(ctx, this.t); else desenharExplosao(ctx, this.t);
    }
  };
})();
