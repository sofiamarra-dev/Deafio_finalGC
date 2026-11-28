/* O ovo evolutivo, desenhado em pixel art 2D (SVG de quadradinhos).
   Nesta etapa existe só o estágio 0 (ovo intacto). Os estágios 1 a 6, com as rachaduras
   e a eclosão, chegam na etapa de gamificação e vão depender do progresso real do aluno. */

const SVG = 'http://www.w3.org/2000/svg';

/* Formato do ovo: largura de cada linha, de cima para baixo (grade de 16 x 20). */
const LARGURAS = [4, 6, 8, 10, 10, 12, 12, 14, 14, 14, 16, 16, 16, 16, 16, 14, 14, 12, 10, 6];
const CORES = { casca: '#f3f3f3', sombra: '#c9cfd4', brilho: '#ffffff', mancha: '#00b312', contorno: '#0b0d0f' };
/* Manchas verdes na casca (coluna, linha): lembram os blocos da logo. */
const MANCHAS = [[5, 6], [6, 6], [10, 9], [11, 9], [11, 10], [4, 13], [5, 13], [9, 15], [10, 15]];

function pixel(svg, x, y, cor) {
  const r = document.createElementNS(SVG, 'rect');
  r.setAttribute('x', x); r.setAttribute('y', y);
  r.setAttribute('width', 1); r.setAttribute('height', 1);
  r.setAttribute('fill', cor);
  svg.appendChild(r);
}

export function criarOvo({ rotulo = 'Ovo intacto' } = {}) {
  const svg = document.createElementNS(SVG, 'svg');
  svg.setAttribute('viewBox', '-1 -1 18 23');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', rotulo);
  svg.setAttribute('shape-rendering', 'crispEdges');

  const grupo = document.createElementNS(SVG, 'g');
  grupo.setAttribute('class', 'ovo-balanco');

  LARGURAS.forEach((largura, y) => {
    const inicio = (16 - largura) / 2;
    for (let x = inicio; x < inicio + largura; x++) {
      const borda = x === inicio || x === inicio + largura - 1 || y === 0 || y === LARGURAS.length - 1;
      const ladoDireito = x >= inicio + largura - 3 || y >= LARGURAS.length - 3;
      let cor = ladoDireito ? CORES.sombra : CORES.casca;
      if (borda) cor = CORES.contorno;
      pixel(grupo, x, y, cor);
    }
  });
  [[5, 3], [5, 4], [4, 5]].forEach(([x, y]) => pixel(grupo, x, y, CORES.brilho));
  MANCHAS.forEach(([x, y]) => pixel(grupo, x, y, CORES.mancha));

  /* Sombra chapada no chão. */
  for (let x = 3; x < 13; x++) pixel(svg, x, 21, '#0b0d0f');
  svg.appendChild(grupo);
  return svg;
}
