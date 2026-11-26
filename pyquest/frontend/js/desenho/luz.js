/* Apagão: uma camada escura sobre a sala, com "buracos" de luz onde a energia voltou. */
window.FC = window.FC || {};

(function () {
  let tela = null, g = null;

  function luz(x, y, r) {
    const grad = g.createRadialGradient(x, y, r * 0.25, x, y, r);
    grad.addColorStop(0, 'rgba(0,0,0,1)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = grad;
    g.beginPath(); g.arc(x, y, r, 0, 6.3); g.fill();
  }

  /* alpha: quão escuro (0 a 1). luzes: [{ x, y, r }] */
  FC.desenharEscuro = function (ctx, alpha, luzes) {
    if (alpha <= 0.005) return;
    if (!tela) {
      tela = document.createElement('canvas');
      tela.width = FC.CONFIG.LARGURA; tela.height = FC.CONFIG.ALTURA;
      g = tela.getContext('2d');
    }
    g.globalCompositeOperation = 'source-over';
    g.clearRect(0, 0, tela.width, tela.height);
    g.fillStyle = 'rgba(4,5,16,' + alpha + ')';
    g.fillRect(0, 0, tela.width, tela.height);
    g.globalCompositeOperation = 'destination-out';
    luzes.forEach(l => luz(l.x, l.y, l.r));
    ctx.drawImage(tela, 0, 0);
  };
})();
