/* Ícones 2D desenhados com quadradinhos (pixel art), sem imagens externas. */
const SVG = 'http://www.w3.org/2000/svg';

/* Cada ícone é uma grade de texto: cada letra é uma cor da paleta, "." é vazio. */
const PALETA = { v: '#00b312', V: '#3ddc4f', c: '#f3f3f3', g: '#8a939b', e: '#0b0d0f', d: '#f2b443', D: '#b07b1c', r: '#ff7a59' };

const ICONES = {
  casa: [
    '....vv....', '...vVVv...', '..vVVVVv..', '.vVVVVVVv.', 'vvvvvvvvvv',
    '.cccccccc.', '.cc....cc.', '.cc.dd.cc.', '.cc.dd.cc.', '.cccddccc.'
  ],
  sair: [
    'gggggg....', 'g....g....', 'g....g..v.', 'g....g..vv', 'g...vvvvvv',
    'g...vvvvvv', 'g....g..vv', 'g....g..v.', 'g....g....', 'gggggg....'
  ],
  estrela: [
    '....cc....', '....cc....', '...cccc...', 'cccccccccc', '.cccccccc.',
    '..cccccc..', '..cccccc..', '.ccc..ccc.', '.cc....cc.', 'c........c'
  ],
  certo: [
    '..........', '.........c', '........cc', '.......cc.', 'c.....cc..',
    'cc...cc...', '.cc.cc....', '..ccc.....', '...c......', '..........'
  ],
  cadeado: [
    '...gggg...', '..g....g..', '..g....g..', '..g....g..', '.gggggggg.',
    '.gggggggg.', '.gggeeggg.', '.gggeeggg.', '.gggggggg.', '.gggggggg.'
  ],
  trofeu: [
    'dddddddddd', 'd.dddddd.d', 'd.dddddd.d', '.ddddddd d', '..dddddd..',
    '...dddd...', '....dd....', '....dd....', '..DDDDDD..', '..DDDDDD..'
  ],
  livro: [
    'cccc..cccc', 'cggc..cggc', 'cccc..cccc', 'cggcvvcggc', 'ccccvvcccc',
    'cggcvvcggc', 'ccccvvcccc', 'cggcvvcggc', 'cccccccccc', '..........'
  ]
};

export function icone(nome, { tamanho = 28, rotulo } = {}) {
  const grade = ICONES[nome];
  const svg = document.createElementNS(SVG, 'svg');
  svg.setAttribute('viewBox', `0 0 ${grade[0].length} ${grade.length}`);
  svg.setAttribute('width', tamanho);
  svg.setAttribute('height', tamanho);
  svg.setAttribute('shape-rendering', 'crispEdges');
  if (rotulo) { svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', rotulo); }
  else svg.setAttribute('aria-hidden', 'true');
  grade.forEach((linha, y) => [...linha].forEach((letra, x) => {
    if (!PALETA[letra]) return;
    const r = document.createElementNS(SVG, 'rect');
    r.setAttribute('x', x); r.setAttribute('y', y); r.setAttribute('width', 1); r.setAttribute('height', 1);
    r.setAttribute('fill', PALETA[letra]);
    svg.appendChild(r);
  }));
  return svg;
}
