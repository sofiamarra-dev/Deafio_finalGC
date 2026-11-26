/* Logo "PyQuest" em pixel art (o mesmo do login), em tamanho pequeno para o topo das outras páginas.
   Qualquer elemento com data-logo recebe o desenho. */
window.FC = window.FC || {};

FC.logo = (function () {
  const G = {
    P: [0, ['1111.', '1...1', '1...1', '1111.', '1....', '1....', '1....']],
    y: [2, ['1...1', '1...1', '.1.1.', '..1..', '.1...', '1....', '1....']],
    Q: [0, ['.111.', '1...1', '1...1', '1...1', '1.1.1', '1..1.', '.11.1']],
    u: [2, ['1...1', '1...1', '1...1', '1..11', '.11.1']],
    e: [2, ['.111.', '1...1', '11111', '1....', '.1111']],
    s: [2, ['.1111', '1....', '.111.', '....1', '1111.']],
    t: [1, ['.1...', '1111.', '.1...', '.1...', '.1..1', '..11.']]
  };
  let n = 0;
  function svg() {
    const id = 'lg' + (++n), K = 20; let x0 = 0, r = '';
    'PyQuest'.split('').forEach(ch => {
      const g = G[ch];
      g[1].forEach((linha, j) => [...linha].forEach((c, i) => { if (c === '1') r += '<rect x="' + (x0 + i * K) + '" y="' + ((g[0] + j) * K) + '" width="28" height="26"/>'; }));
      x0 += 6 * K;
    });
    const W = x0 - K + 8, H = 182;
    return '<svg class="logo-pixel" viewBox="-4 -4 ' + (W + 10) + ' ' + (H + 10) + '" role="img" aria-label="PyQuest" focusable="false" shape-rendering="crispEdges">' +
      '<defs><clipPath id="' + id + 'f">' + r + '</clipPath><linearGradient id="' + id + 'g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff0b8"/><stop offset=".5" stop-color="#ffd36b"/><stop offset="1" stop-color="#f2a33a"/></linearGradient></defs>' +
      '<g clip-path="url(#' + id + 'f)" transform="translate(7 8)" opacity=".55"><rect width="' + (W + 8) + '" height="' + H + '" fill="#000"/></g>' +
      '<g clip-path="url(#' + id + 'f)"><rect width="' + (W + 8) + '" height="' + H + '" fill="url(#' + id + 'g)"/></g></svg>';
  }
  Array.prototype.forEach.call(document.querySelectorAll('[data-logo]'), el => { el.innerHTML = svg(); });
  return { svg: svg };
})();
