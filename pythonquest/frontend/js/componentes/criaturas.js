/* As 5 criaturas, em desenho 2D com contorno grosso. Cada uma tem um tema de programação.
   Qual nasce depende do jeito de estudar do aluno (calculado no servidor, em servicos/criatura.py). */
const SVG = 'http://www.w3.org/2000/svg';
const L = '#0b0d0f'; // contorno
const C = { stroke: L, 'stroke-width': 2.5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' };

/* Olho fofo: branco, pupila e brilho. */
const olho = (x, y, r = 4.2) => [
  ['circle', { cx: x, cy: y, r, fill: '#fff', ...C, 'stroke-width': 2 }],
  ['circle', { cx: x + 0.6, cy: y + 0.6, r: r * 0.55, fill: L }],
  ['circle', { cx: x + 1.4, cy: y - 0.6, r: r * 0.2, fill: '#fff' }]
];
const bochecha = (x, y) => ['ellipse', { cx: x, cy: y, rx: 2.6, ry: 1.6, fill: '#ff8fab', opacity: 0.75 }];

export const CRIATURAS = {
  certeira: {
    nome: 'Coruja Binária', tema: 'Óculos de mira e o peito em 0 e 1: pensa antes de enviar.',
    formas: [
      ['ellipse', { cx: 32, cy: 60, rx: 15, ry: 2.5, fill: L, opacity: 0.35 }],
      ['path', { d: 'M18 22 L16 9 L25 17 Z', fill: '#6b4426', ...C }],
      ['path', { d: 'M46 22 L48 9 L39 17 Z', fill: '#6b4426', ...C }],
      ['ellipse', { cx: 13, cy: 38, rx: 6, ry: 12, fill: '#6b4426', ...C, transform: 'rotate(15 13 38)' }],
      ['ellipse', { cx: 51, cy: 38, rx: 6, ry: 12, fill: '#6b4426', ...C, transform: 'rotate(-15 51 38)' }],
      ['ellipse', { cx: 32, cy: 36, rx: 18, ry: 21, fill: '#9a6a43', ...C }],
      ['ellipse', { cx: 32, cy: 45, rx: 12, ry: 11, fill: '#f1d9b5' }],
      ['text', { x: 32, y: 44, 'text-anchor': 'middle', 'font-family': 'IBM Plex Mono, monospace', 'font-weight': 700, 'font-size': 5.5, fill: '#9a6a43' }, '0101'],
      ['text', { x: 32, y: 50, 'text-anchor': 'middle', 'font-family': 'IBM Plex Mono, monospace', 'font-weight': 700, 'font-size': 5.5, fill: '#9a6a43' }, '1010'],
      ...olho(25, 28, 5), ...olho(39, 28, 5),
      ['circle', { cx: 25, cy: 28, r: 7, fill: 'none', stroke: '#f2b443', 'stroke-width': 2.5 }],
      ['circle', { cx: 39, cy: 28, r: 7, fill: 'none', stroke: '#f2b443', 'stroke-width': 2.5 }],
      ['path', { d: 'M32 28 L32 28', stroke: '#f2b443', 'stroke-width': 2.5 }],
      ['path', { d: 'M29 35 L35 35 L32 39.5 Z', fill: '#f2b443', ...C, 'stroke-width': 1.8 }],
      ['path', { d: 'M24 56.5 l-2 3 M26 57 v3.5 M28 56.5 l2 3 M36 56.5 l-2 3 M38 57 v3.5 M40 56.5 l2 3', stroke: '#f2b443', 'stroke-width': 2.2, 'stroke-linecap': 'round' }]
    ]
  },
  persistente: {
    nome: 'Tartaruga Loop', tema: 'O casco é um laço: tenta de novo até dar certo.',
    formas: [
      ['ellipse', { cx: 33, cy: 58, rx: 22, ry: 3, fill: L, opacity: 0.35 }],
      ['rect', { x: 15, y: 46, width: 8, height: 10, rx: 3.5, fill: '#2dd4bf', ...C }],
      ['rect', { x: 42, y: 46, width: 8, height: 10, rx: 3.5, fill: '#2dd4bf', ...C }],
      ['path', { d: 'M52 46 L60 47 L52 50 Z', fill: '#2dd4bf', ...C }],
      ['circle', { cx: 12, cy: 34, r: 9.5, fill: '#2dd4bf', ...C }],
      ['path', { d: 'M9 23 q3 -5 6 0', fill: 'none', stroke: L, 'stroke-width': 2 }],
      ...olho(10, 32, 3.6), bochecha(14.5, 38),
      ['path', { d: 'M5.5 38 q2.5 2.5 5 0', fill: 'none', stroke: L, 'stroke-width': 1.8 }],
      ['path', { d: 'M14 48 C14 22 54 22 54 48 Z', fill: '#0f766e', ...C }],
      ['path', { d: 'M14 48 C14 22 54 22 54 48', fill: 'none', stroke: '#14b8a6', 'stroke-width': 2, transform: 'translate(0 2) scale(1 .96)', opacity: 0.6 }],
      ['rect', { x: 12, y: 45, width: 44, height: 6, rx: 3, fill: '#99f6e4', ...C }],
      ['path', { d: 'M40.5 36 A7 7 0 1 1 34 29', fill: 'none', stroke: '#5eead4', 'stroke-width': 3.2, 'stroke-linecap': 'round' }],
      ['path', { d: 'M33 25 L38 29 L32.5 32.5 Z', fill: '#5eead4' }]
    ]
  },
  exploradora: {
    nome: 'Dragãozinho Pyxel', tema: 'Rabo de cobra (python) e asas para ir além do obrigatório.',
    formas: [
      ['ellipse', { cx: 32, cy: 60, rx: 17, ry: 2.5, fill: L, opacity: 0.35 }],
      ['path', { d: 'M44 50 C56 52 58 40 52 36 C48 34 46 40 50 41', fill: 'none', stroke: L, 'stroke-width': 7.5, 'stroke-linecap': 'round' }],
      ['path', { d: 'M44 50 C56 52 58 40 52 36 C48 34 46 40 50 41', fill: 'none', stroke: '#22c55e', 'stroke-width': 4.5, 'stroke-linecap': 'round' }],
      ['path', { d: 'M50 41 l4 -2 l-1 4 z', fill: '#f2b443', ...C, 'stroke-width': 1.5 }],
      ['path', { d: 'M20 34 L4 24 L8 34 L2 38 L18 42 Z', fill: '#a78bfa', ...C }],
      ['path', { d: 'M44 34 L60 24 L56 34 L62 38 L46 42 Z', fill: '#a78bfa', ...C }],
      ['ellipse', { cx: 32, cy: 45, rx: 14, ry: 14, fill: '#3ddc4f', ...C }],
      ['ellipse', { cx: 32, cy: 48, rx: 8, ry: 9, fill: '#d9f99d' }],
      ['path', { d: 'M27 46 h10 M26.5 50 h11 M28 54 h8', stroke: '#a3e635', 'stroke-width': 1.6 }],
      ['path', { d: 'M22 15 L19 5 L27 12 Z', fill: '#f2b443', ...C }],
      ['path', { d: 'M42 15 L45 5 L37 12 Z', fill: '#f2b443', ...C }],
      ['circle', { cx: 32, cy: 24, r: 13, fill: '#3ddc4f', ...C }],
      ['path', { d: 'M28 11.5 l2 -4 l2 4 l2 -4 l2 4', fill: '#00b312', ...C, 'stroke-width': 1.8 }],
      ...olho(26.5, 23, 4.2), ...olho(37.5, 23, 4.2), bochecha(23, 29.5), bochecha(41, 29.5),
      ['path', { d: 'M29 30 q3 3 6 0', fill: 'none', stroke: L, 'stroke-width': 1.8 }],
      ['rect', { x: 23, y: 56, width: 6, height: 4, rx: 2, fill: '#00b312', ...C, 'stroke-width': 2 }],
      ['rect', { x: 35, y: 56, width: 6, height: 4, rx: 2, fill: '#00b312', ...C, 'stroke-width': 2 }]
    ]
  },
  independente: {
    nome: 'Gato Sintaxe', tema: 'Rabo em chaves { }: resolve sozinho, sem pedir dica.',
    formas: [
      ['ellipse', { cx: 30, cy: 60, rx: 15, ry: 2.5, fill: L, opacity: 0.35 }],
      ['path', { d: 'M44 32 q6 0 6 5 v4 q0 4 5 4 q-5 0 -5 4 v4 q0 5 -6 5', fill: 'none', stroke: L, 'stroke-width': 7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }],
      ['path', { d: 'M44 32 q6 0 6 5 v4 q0 4 5 4 q-5 0 -5 4 v4 q0 5 -6 5', fill: 'none', stroke: '#f59e0b', 'stroke-width': 3.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }],
      ['ellipse', { cx: 30, cy: 47, rx: 13, ry: 11, fill: '#f59e0b', ...C }],
      ['ellipse', { cx: 30, cy: 50, rx: 7, ry: 7, fill: '#fde68a' }],
      ['path', { d: 'M15 21 L14 5 L27 13 Z', fill: '#f59e0b', ...C }],
      ['path', { d: 'M45 21 L46 5 L33 13 Z', fill: '#f59e0b', ...C }],
      ['path', { d: 'M17 16 L17 9 L23 13 Z', fill: '#ff8fab' }],
      ['path', { d: 'M43 16 L43 9 L37 13 Z', fill: '#ff8fab' }],
      ['ellipse', { cx: 30, cy: 26, rx: 17, ry: 14, fill: '#f59e0b', ...C }],
      ['path', { d: 'M26 13.5 v5 M30 13 v6 M34 13.5 v5', stroke: '#b45309', 'stroke-width': 2.2, 'stroke-linecap': 'round' }],
      ...olho(23.5, 26, 4), ...olho(36.5, 26, 4), bochecha(20, 32), bochecha(40, 32),
      ['path', { d: 'M28.5 31 h3 l-1.5 2 z', fill: '#ff6b81' }],
      ['path', { d: 'M27 34.5 q1.5 1.5 3 0 q1.5 1.5 3 0', fill: 'none', stroke: L, 'stroke-width': 1.6 }],
      ['path', { d: 'M8 29 h8 M8 33 l8 -1 M52 29 h-8 M52 33 l-8 -1', stroke: '#fde68a', 'stroke-width': 1.5, 'stroke-linecap': 'round' }],
      ['rect', { x: 21, y: 55, width: 7, height: 5, rx: 2.5, fill: '#fde68a', ...C, 'stroke-width': 2 }],
      ['rect', { x: 32, y: 55, width: 7, height: 5, rx: 2.5, fill: '#fde68a', ...C, 'stroke-width': 2 }]
    ]
  },
  constante: {
    nome: 'Abelha Commit', tema: 'Antenas de commit: um pouquinho por dia, sem pular.',
    formas: [
      ['ellipse', { cx: 32, cy: 60, rx: 15, ry: 2.5, fill: L, opacity: 0.35 }],
      ['path', { d: 'M24 18 C22 10 18 8 15 7', fill: 'none', stroke: L, 'stroke-width': 2.2 }],
      ['path', { d: 'M40 18 C42 10 46 8 49 7', fill: 'none', stroke: L, 'stroke-width': 2.2 }],
      ['circle', { cx: 14, cy: 7, r: 3.6, fill: '#00b312', ...C, 'stroke-width': 2 }],
      ['circle', { cx: 50, cy: 7, r: 3.6, fill: '#00b312', ...C, 'stroke-width': 2 }],
      ['ellipse', { cx: 18, cy: 30, rx: 11, ry: 7, fill: '#e0f2fe', ...C, opacity: 0.95, transform: 'rotate(-25 18 30)' }],
      ['ellipse', { cx: 46, cy: 30, rx: 11, ry: 7, fill: '#e0f2fe', ...C, opacity: 0.95, transform: 'rotate(25 46 30)' }],
      ['path', { d: 'M32 58 l-3 -5 h6 z', fill: L }],
      ['ellipse', { cx: 32, cy: 38, rx: 16, ry: 18, fill: '#facc15', ...C }],
      ['path', { d: 'M17 40 Q32 44 47 40 L46.2 45 Q32 49 17.8 45 Z', fill: L }],
      ['path', { d: 'M19.5 50 Q32 54 44.5 50 L42 53.5 Q32 57 22 53.5 Z', fill: L }],
      ...olho(26, 30, 4.4), ...olho(38, 30, 4.4), bochecha(22, 36), bochecha(42, 36),
      ['path', { d: 'M29 36 q3 3 6 0', fill: 'none', stroke: L, 'stroke-width': 1.8 }],
      ['path', { d: 'M11 54 h7 M14.5 50.5 v7', stroke: '#00b312', 'stroke-width': 2.4, 'stroke-linecap': 'round' }]
    ]
  }
};

function forma(alvo, [tag, atributos, texto]) {
  const no = document.createElementNS(SVG, tag);
  for (const [k, v] of Object.entries(atributos)) no.setAttribute(k, v);
  if (texto) no.textContent = texto;
  alvo.appendChild(no);
}

/* Pedaços de casca no chão, com as manchas na cor que o aluno escolheu. */
function casca(alvo, corMancha) {
  [['path', { d: 'M1 63 L2 55 L5 57.5 L7 53 L10 56.5 L12 54 L13 63 Z', fill: '#f3f3f3', ...C, 'stroke-width': 2 }],
    ['path', { d: 'M51 63 L52 54 L54.5 57 L57 52.5 L59.5 56 L62 54.5 L63 63 Z', fill: '#f3f3f3', ...C, 'stroke-width': 2 }],
    ['rect', { x: 5.5, y: 59, width: 2.4, height: 2, fill: corMancha }],
    ['rect', { x: 56, y: 58.5, width: 2.4, height: 2, fill: corMancha }]].forEach(f => forma(alvo, f));
}

export function criarCriatura(especie, { silhueta = false, comCasca = false, corMancha = '#00b312', rotulo } = {}) {
  const criatura = CRIATURAS[especie] || CRIATURAS.exploradora;
  const svg = document.createElementNS(SVG, 'svg');
  svg.setAttribute('viewBox', '0 0 64 64');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', rotulo || (silhueta ? 'Criatura em formação' : criatura.nome));
  svg.classList.add('criatura');
  if (silhueta) svg.classList.add('silhueta');
  const corpo = document.createElementNS(SVG, 'g');
  corpo.setAttribute('class', 'criatura-corpo');
  criatura.formas.forEach(f => forma(corpo, f));
  svg.appendChild(corpo);
  if (comCasca) casca(svg, corMancha);
  return svg;
}
