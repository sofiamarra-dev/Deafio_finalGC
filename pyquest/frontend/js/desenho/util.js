/* Funções pequenas de desenho usadas por todas as salas. */
window.FC = window.FC || {};

FC.desenho = {
  /* Retângulo preenchido. */
  R(g, x, y, w, h, cor) { g.fillStyle = cor; g.fillRect(x, y, w, h); },

  /* Elipse preenchida. */
  E(g, x, y, rx, ry, cor) { g.fillStyle = cor; g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, 6.3); g.fill(); },

  /* Lê uma cor das variáveis CSS (ex.: '--accent'). */
  corDoTema(nome, reserva) {
    const v = getComputedStyle(document.documentElement).getPropertyValue(nome).trim();
    return v || reserva;
  }
};
