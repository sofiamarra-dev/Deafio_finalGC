/* As 5 criaturas do PythonQuest: monstrinhos originais, cada um com tipo, habilidade e um detalhe de programação.
   Qual nasce depende do jeito de estudar do aluno (calculado no servidor, em servicos/criatura.py). */
const SVG = 'http://www.w3.org/2000/svg';
const L = '#0b0d0f'; // contorno
const C = { stroke: L, 'stroke-width': 2, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' };
const brilho = d => ['path', { d, fill: 'none', stroke: '#fff', 'stroke-width': 1.4, opacity: 0.28, 'stroke-linecap': 'round' }];
/* Traço com contorno: desenha o contorno grosso e a cor por cima (para caudas e pescoços). */
const tubo = (d, cor, largura) => [
  ['path', { d, fill: 'none', stroke: L, 'stroke-width': largura + 3.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }],
  ['path', { d, fill: 'none', stroke: cor, 'stroke-width': largura, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }]
];
const sombra = (cx, rx) => ['ellipse', { cx, cy: 61, rx, ry: 2.2, fill: L, opacity: 0.4 }];

export const CRIATURAS = {
  certeira: {
    nomes: ['Strixel', 'Strixar', 'Strixion'],
    nome: 'Strixel', tipo: 'Precisão', corTipo: '#38bdf8', habilidade: 'Mira Binária',
    tema: 'Ave de rapina com circuitos nas asas. Calcula tudo antes de agir e quase nunca erra o alvo.',
    /* evolucoes[0] = forma 2, evolucoes[1] = forma final (somada à 2). atras = desenhado antes do corpo. */
    evolucoes: [
      { atras: [
        ['path', { d: 'M21 30 L3 40 L9 41 L2 48 L12 47 L8 54 L21 46 Z', fill: '#1e2a44', ...C }],
        ['path', { d: 'M43 30 L61 40 L55 41 L62 48 L52 47 L56 54 L43 46 Z', fill: '#1e2a44', ...C }],
        ['path', { d: 'M7 44 h5 M57 44 h-5', stroke: '#22d3ee', 'stroke-width': 1.3 }]
      ], frente: [
        ['path', { d: 'M27 10 L24 0 L30 6 L32 -3 L34 6 L40 0 L37 10 Z', fill: '#22d3ee', ...C, 'stroke-width': 1.5 }],
        ['path', { d: 'M23 18.5 h18', stroke: '#22d3ee', 'stroke-width': 0.9, opacity: 0.9 }]
      ] },
      { atras: [], frente: [
        ['circle', { cx: 32, cy: -4, r: 4.5, fill: 'none', stroke: '#facc15', 'stroke-width': 1.4 }],
        ['path', { d: 'M32 -10.5 v3.5 M32 -1 v3.5 M25.5 -4 h3.5 M35 -4 h3.5', stroke: '#facc15', 'stroke-width': 1.4 }],
        ['circle', { cx: 32, cy: -4, r: 1, fill: '#facc15' }],
        ['path', { d: 'M26 30 C24 40 26 50 32 53 C38 50 40 40 38 30', fill: 'none', stroke: '#facc15', 'stroke-width': 1.2, opacity: 0.8 }]
      ] }
    ],
    formas: [
      sombra(32, 14),
      ['path', { d: 'M26 50 L21 62 L29 56 L32 62 L35 56 L43 62 L38 50 Z', fill: '#26324d', ...C }],
      ['path', { d: 'M21 25 C9 33 10 48 20 56 L25 41 Z', fill: '#26324d', ...C }],
      ['path', { d: 'M43 25 C55 33 54 48 44 56 L39 41 Z', fill: '#26324d', ...C }],
      ['path', { d: 'M14 37 h4 v6 h3 M50 37 h-4 v6 h-3 M16 47 h3', fill: 'none', stroke: '#22d3ee', 'stroke-width': 1.4 }],
      ['circle', { cx: 21, cy: 43, r: 1.2, fill: '#22d3ee' }], ['circle', { cx: 43, cy: 43, r: 1.2, fill: '#22d3ee' }],
      ['path', { d: 'M21 49 C17 36 21 23 32 19 C43 23 47 36 43 49 C39 56 25 56 21 49 Z', fill: '#3f5585', ...C }],
      ['path', { d: 'M26 30 C24 40 26 50 32 53 C38 50 40 40 38 30 C36 26 28 26 26 30 Z', fill: '#cdd7ea' }],
      ['path', { d: 'M28.5 35 l3.5 2.5 l3.5 -2.5 M28.5 41 l3.5 2.5 l3.5 -2.5 M29.5 47 l2.5 2 l2.5 -2', fill: 'none', stroke: '#3f5585', 'stroke-width': 1.5 }],
      ['path', { d: 'M23 13 L15 3 L27 9 Z', fill: '#26324d', ...C }],
      ['path', { d: 'M41 13 L49 3 L37 9 Z', fill: '#26324d', ...C }],
      ['path', { d: 'M20 22 C20 13 25 8 32 8 C39 8 44 13 44 22 C40 27 24 27 20 22 Z', fill: '#3f5585', ...C }],
      ['path', { d: 'M23 20.5 C23 15 28 14 32 16.5 C36 14 41 15 41 20.5 C38 23.5 26 23.5 23 20.5 Z', fill: '#e2e8f0' }],
      ['path', { d: 'M24 18.2 L30.5 18 L29.3 21 L25 20.4 Z', fill: '#facc15', stroke: L, 'stroke-width': 1.2 }],
      ['path', { d: 'M40 18.2 L33.5 18 L34.7 21 L39 20.4 Z', fill: '#facc15', stroke: L, 'stroke-width': 1.2 }],
      ['circle', { cx: 28, cy: 19.3, r: 1.1, fill: L }], ['circle', { cx: 36, cy: 19.3, r: 1.1, fill: L }],
      ['path', { d: 'M23 16.6 L30.5 17.8 M41 16.6 L33.5 17.8', stroke: L, 'stroke-width': 2 }],
      ['path', { d: 'M30.4 21.5 L33.6 21.5 L32 26 Z', fill: '#f59e0b', stroke: L, 'stroke-width': 1.3 }],
      brilho('M24 13 C26 10 29 9.5 31 9.5'),
      ['path', { d: 'M27 55 l-2.5 4 M29 55.5 v4 M35 55.5 v4 M37 55 l2.5 4', stroke: '#f59e0b', 'stroke-width': 2, 'stroke-linecap': 'round' }]
    ]
  },
  persistente: {
    nomes: ['Loopadon', 'Loopagor', 'Infiloop'],
    nome: 'Loopadon', tipo: 'Rocha', corTipo: '#a8a29e', habilidade: 'Tenta de Novo',
    tema: 'Fera blindada com uma runa de laço no casco. Cada erro deixa a armadura mais forte.',
    evolucoes: [
      { atras: [
        ['path', { d: 'M25 28 l3 -13 l4 12 Z M35 26 l4 -14 l3 13 Z M45 28 l5 -11 l1 12 Z', fill: '#a8a29e', ...C, 'stroke-width': 1.6 }]
      ], frente: [
        ['path', { d: 'M20 51 h1.5 M30 52 h1.5 M43 52 h1.5 M52 51 h1.5', stroke: '#34d399', 'stroke-width': 2.4, 'stroke-linecap': 'round' }],
        ['path', { d: 'M12 29 L13 19 L17 28 Z', fill: '#e7e5e4', ...C, 'stroke-width': 1.5 }],
        ['path', { d: 'M15 44 C25 47 47 47 57 44', fill: 'none', stroke: '#34d399', 'stroke-width': 1.3, opacity: 0.8 }]
      ] },
      { atras: [
        ['ellipse', { cx: 36, cy: 38, rx: 30, ry: 9, fill: 'none', stroke: '#34d399', 'stroke-width': 1.4, 'stroke-dasharray': '3 3', opacity: 0.7 }]
      ], frente: [
        ['path', { d: 'M29 24 l2 -10 l3 9 Z M38 22 l3 -12 l3 12 Z M47 25 l3 -9 l1.5 9 Z', fill: '#34d399', ...C, 'stroke-width': 1.4 }],
        ['path', { d: 'M40.5 13 l0.5 -3 M39 16 l1 -1', stroke: '#d1fae5', 'stroke-width': 1, 'stroke-linecap': 'round' }],
        ['circle', { cx: 62, cy: 36, r: 1.6, fill: '#34d399' }], ['circle', { cx: 8, cy: 52, r: 1.3, fill: '#34d399' }]
      ] }
    ],
    formas: [
      sombra(34, 24),
      ['rect', { x: 17, y: 45, width: 7, height: 13, rx: 2, fill: '#44403c', ...C }],
      ['rect', { x: 27, y: 46, width: 7, height: 12, rx: 2, fill: '#57534e', ...C }],
      ['rect', { x: 40, y: 46, width: 7, height: 12, rx: 2, fill: '#57534e', ...C }],
      ['rect', { x: 49, y: 45, width: 7, height: 13, rx: 2, fill: '#44403c', ...C }],
      ['path', { d: 'M56 42 C61 41 63 44 60 46 C64 46 64 52 59 51 L55 47 Z', fill: '#44403c', ...C }],
      ['path', { d: 'M60 46 l3 -3 M61 50 l3 1', stroke: L, 'stroke-width': 1.8 }],
      ['path', { d: 'M18 32 l3 -7 l3 6 Z M27 27 l3.5 -8 l3.5 7 Z M38 26 l3.5 -8 l3.5 7 Z M48 30 l4 -6 l1.5 7 Z', fill: '#d6d3d1', ...C, 'stroke-width': 1.6 }],
      ['path', { d: 'M13 45 C13 31 25 25 37 25 C49 25 58 32 58 45 Z', fill: '#78716c', ...C }],
      ['path', { d: 'M22 34 l5 -3 l5 3 v5 l-5 3 l-5 -3 Z M44 33 l5 3 v5 l-5 3', fill: 'none', stroke: '#57534e', 'stroke-width': 1.5 }],
      ['circle', { cx: 37, cy: 36.5, r: 6.5, fill: 'none', stroke: '#34d399', 'stroke-width': 5, opacity: 0.25 }],
      ['path', { d: 'M42.5 39.5 A6.2 6.2 0 1 1 38 30.5', fill: 'none', stroke: '#34d399', 'stroke-width': 2.4, 'stroke-linecap': 'round' }],
      ['path', { d: 'M36.5 27.5 L41.5 30.5 L36.8 33.6 Z', fill: '#34d399' }],
      ['rect', { x: 11, y: 42, width: 48, height: 5, rx: 2.5, fill: '#44403c', ...C, 'stroke-width': 1.6 }],
      brilho('M19 31 C24 27 30 26 34 26'),
      ['path', { d: 'M4 40 C2 33 7 29 13 30 C18 31 20 36 18 42 C14 47 7 46 4 40 Z', fill: '#78716c', ...C }],
      ['path', { d: 'M9 30.5 L7 22 L14 29 Z', fill: '#e7e5e4', ...C, 'stroke-width': 1.6 }],
      ['path', { d: 'M6.5 35.5 L11.5 35 L10.5 37.5 Z', fill: '#34d399', stroke: L, 'stroke-width': 1.1 }],
      ['path', { d: 'M5.5 34 L12 34.5', stroke: L, 'stroke-width': 1.8 }],
      ['path', { d: 'M5 41.5 L11 42.5 l2 -1.5', fill: 'none', stroke: L, 'stroke-width': 1.5 }],
      ['path', { d: 'M7 42.3 l1 1.6 l1 -1.4', fill: '#e7e5e4', stroke: L, 'stroke-width': 0.8 }]
    ]
  },
  exploradora: {
    nomes: ['Pyrrax', 'Pyrrazor', 'Pyrrathon'],
    nome: 'Pyrrax', tipo: 'Fogo', corTipo: '#f97316', habilidade: 'Além do Mapa',
    tema: 'Serpente-dragão com corpo de python. Não fica no caminho obrigatório: vai atrás dos desafios extras.',
    evolucoes: [
      { atras: [
        ['path', { d: 'M38 27 L18 16 L24 25 L12 28 L33 34 Z', fill: '#b91c1c', ...C }]
      ], frente: [
        ['path', { d: 'M41 24 q-6 -1 -5 -7 q2 3 5 3 q-3 -5 1 -9 q1 5 4 6 q0 -4 3 -6 q0 6 -2 9 Z', fill: '#f97316', ...C, 'stroke-width': 1.4, transform: 'translate(-3 9)' }],
        ['path', { d: 'M15 56 C5 61 1 51 6 46 C6 51 10 52 10 48 C13 51 17 53 15 56 Z', fill: '#f97316', ...C, 'stroke-width': 1.5 }],
        ['path', { d: 'M12.5 55 C9 55.5 7.5 52 8.5 50.5 C9.5 52.5 12 53 12.5 55 Z', fill: '#fde047' }]
      ] },
      { atras: [
        ['path', { d: 'M44 30 L64 6 L61 18 L66 17 L52 35 Z', fill: '#7f1d1d', ...C }]
      ], frente: [
        ['path', { d: 'M36 7 L33 -3 L38 2 L40 -6 L43 1 L47 -4 L46 5 Z', fill: '#fde047', ...C, 'stroke-width': 1.4 }],
        ['path', { d: 'M38 4 L40 -1 L42 3', fill: '#f97316' }],
        ['circle', { cx: 25, cy: 36, r: 1.2, fill: '#fbbf24' }], ['circle', { cx: 58, cy: 30, r: 1, fill: '#fbbf24' }],
        ['circle', { cx: 5, cy: 42, r: 1.1, fill: '#f97316' }]
      ] }
    ],
    formas: [
      sombra(32, 20),
      ['path', { d: 'M39 29 L23 11 L27 22 L16 21 L32 33 Z', fill: '#7f1d1d', ...C }],
      ...tubo('M15 56 C6 51 9 41 21 43 C33 45 39 55 49 51 C57 47 56 37 46 35 C41 34 40 27 41 19', '#dc2626', 7),
      ['path', { d: 'M15 56 C6 51 9 41 21 43 C33 45 39 55 49 51 C57 47 56 37 46 35', fill: 'none', stroke: '#fbbf24', 'stroke-width': 1.6, 'stroke-dasharray': '2 2.5', transform: 'translate(0 1.6)' }],
      ['path', { d: 'M42 30 L58 13 L55 23 L63 21 L51 34 Z', fill: '#991b1b', ...C }],
      ['path', { d: 'M50 22 L55 18 M52 27 L58 23', stroke: '#fca5a5', 'stroke-width': 1, opacity: 0.6 }],
      ['path', { d: 'M15 56 C8 59 5 52 9 49 C9 53 12 53 12 50 C14 52.5 16.5 54 15 56 Z', fill: '#f97316', ...C, 'stroke-width': 1.5 }],
      ['path', { d: 'M12.5 55 C10 55.5 9.5 53 10.5 52 C11 53.5 12.5 53.5 12.5 55 Z', fill: '#fde047' }],
      ['path', { d: 'M38 8 L34 0.5 L41.5 5.5 Z M43 6 L41.5 -0.5 L46 5 Z', fill: '#fbbf24', ...C, 'stroke-width': 1.5 }],
      ['path', { d: 'M34 15 C33 8 39 4.5 46 6.5 L56 10 L50 13.5 C48 18.5 39 20 34 15 Z', fill: '#ef4444', ...C }],
      ['path', { d: 'M48 13.5 L54 11.5', stroke: L, 'stroke-width': 1.4 }],
      ['path', { d: 'M40.5 9.4 L46.5 9 L45.5 11.8 L41.5 11.4 Z', fill: '#fde047', stroke: L, 'stroke-width': 1.1 }],
      ['rect', { x: 43.4, y: 9.2, width: 1.1, height: 2.4, fill: L }],
      ['path', { d: 'M39.5 8.2 L46.5 8.6', stroke: L, 'stroke-width': 1.8 }],
      ['circle', { cx: 53.5, cy: 9.6, r: 0.7, fill: L }],
      brilho('M36 11 C37 8 40 6.5 43 6.5'),
      ['path', { d: 'M57 8 q2 -2 4 -1 q-1 2 1 3', fill: 'none', stroke: '#9ca3af', 'stroke-width': 1.2, opacity: 0.8 }]
    ]
  },
  independente: {
    nomes: ['Synthra', 'Synthrax', 'Synthrael'],
    nome: 'Synthra', tipo: 'Sombra', corTipo: '#a78bfa', habilidade: 'Sem Dicas',
    tema: 'Felino das sombras com a cauda em chaves { }. Resolve tudo sozinho e em silêncio.',
    evolucoes: [
      { atras: [
        ['path', { d: 'M23 37 L9 28 L13 38 L6 40 L21 45 Z', fill: '#4c1d95', ...C, 'stroke-width': 1.6 }],
        ['path', { d: 'M41 37 L55 28 L51 38 L58 40 L43 45 Z', fill: '#4c1d95', ...C, 'stroke-width': 1.6 }]
      ], frente: [
        ['path', { d: 'M29.5 13.5 a3.2 3.2 0 1 0 5 0 a2.4 2.4 0 1 1 -5 0 Z', fill: '#e879f9', stroke: L, 'stroke-width': 0.8 }],
        ['path', { d: 'M22 27 l-3 2 M42 27 l3 2', stroke: '#c084fc', 'stroke-width': 1.4, 'stroke-linecap': 'round' }]
      ] },
      { atras: [
        ['circle', { cx: 32, cy: 22, r: 17, fill: 'none', stroke: '#a78bfa', 'stroke-width': 1.2, 'stroke-dasharray': '1.5 3', opacity: 0.8 }]
      ], frente: [
        ['text', { x: 2, y: 22, 'font-size': 13, 'font-family': 'monospace', 'font-weight': 700, fill: '#c084fc' }, '{'],
        ['text', { x: 55, y: 14, 'font-size': 11, 'font-family': 'monospace', 'font-weight': 700, fill: '#c084fc', opacity: 0.8 }, '}'],
        ['path', { d: 'M24 2 L32 -6 L40 2 L36 0 L32 -2 L28 0 Z', fill: '#c084fc', ...C, 'stroke-width': 1.3 }]
      ] }
    ],
    formas: [
      sombra(32, 14),
      ...tubo('M42 54 C52 54 54 47 51 42 C49 38 52 34 55 34', '#312e81', 4),
      ['path', { d: 'M55 34 q3 0 3 3 v2 q0 2 2 2 q-2 0 -2 2 v2 q0 3 -3 3', fill: 'none', stroke: '#c084fc', 'stroke-width': 2, 'stroke-linecap': 'round' }],
      ['path', { d: 'M22 57 C18 46 20 36 26 32 L38 32 C44 36 46 46 42 57 Z', fill: '#312e81', ...C }],
      ['path', { d: 'M27 34 L32 45 L37 34 Z', fill: '#6366f1' }],
      ['path', { d: 'M27 57 v-9 M37 57 v-9', stroke: L, 'stroke-width': 1.8 }],
      ['path', { d: 'M22 57 h8 M34 57 h8', stroke: L, 'stroke-width': 2.2 }],
      ['path', { d: 'M20 17 L17 1.5 L29 10 Z', fill: '#3730a3', ...C }],
      ['path', { d: 'M44 17 L47 1.5 L35 10 Z', fill: '#3730a3', ...C }],
      ['path', { d: 'M17 1.5 L16 -2 M47 1.5 L48 -2', stroke: L, 'stroke-width': 1.6 }],
      ['path', { d: 'M20.5 14 L19.5 6 L25 10.5 Z M43.5 14 L44.5 6 L39 10.5 Z', fill: '#c084fc', opacity: 0.8 }],
      ['path', { d: 'M18 22 C18 14 24 10 32 10 C40 10 46 14 46 22 C46 28 40 32.5 32 33.5 C24 32.5 18 28 18 22 Z', fill: '#3730a3', ...C }],
      ['path', { d: 'M18.5 24 L11 28.5 L19.5 28 M45.5 24 L53 28.5 L44.5 28', fill: '#3730a3', ...C, 'stroke-width': 1.6 }],
      ['path', { d: 'M30 12.5 l2 4 l2 -4', fill: 'none', stroke: '#c084fc', 'stroke-width': 1.5 }],
      ['path', { d: 'M21.5 20 L29 21 L27 24 L23 23 Z', fill: '#e879f9', stroke: L, 'stroke-width': 1.2 }],
      ['path', { d: 'M42.5 20 L35 21 L37 24 L41 23 Z', fill: '#e879f9', stroke: L, 'stroke-width': 1.2 }],
      ['rect', { x: 25, y: 20.6, width: 1.2, height: 3, fill: L }], ['rect', { x: 37.8, y: 20.6, width: 1.2, height: 3, fill: L }],
      ['path', { d: 'M21 18.6 L29.5 20.3 M43 18.6 L34.5 20.3', stroke: L, 'stroke-width': 1.8 }],
      ['path', { d: 'M30.5 26 h3 l-1.5 1.8 Z', fill: '#f0abfc', stroke: L, 'stroke-width': 0.8 }],
      ['path', { d: 'M29.5 29.5 q2.5 1.2 5 0', fill: 'none', stroke: L, 'stroke-width': 1.4 }],
      brilho('M22 15 C24 12 28 11 31 11')
    ]
  },
  constante: {
    nomes: ['Commitix', 'Commitor', 'Mergeon'],
    nome: 'Commitix', tipo: 'Elétrico', corTipo: '#facc15', habilidade: 'Commit Diário',
    tema: 'Vespa blindada com antenas de raio que terminam em commits. Um pouco por dia, sem pular nenhum.',
    evolucoes: [
      { atras: [
        ['path', { d: 'M31 30 C22 40 10 43 9 37 C8 32 21 30 31 30 Z', fill: '#bae6fd', ...C, opacity: 0.85 }]
      ], frente: [
        ['path', { d: 'M41 59 L38 65 L45 60 Z', fill: '#facc15', stroke: L, 'stroke-width': 1.2 }],
        ['path', { d: 'M16 34 L22 33 M13 37 L19 35', stroke: '#22d3ee', 'stroke-width': 1, opacity: 0.8 }],
        ['path', { d: 'M17 22 C15 19 15.5 16 17 14', fill: 'none', stroke: '#facc15', 'stroke-width': 1.4 }]
      ] },
      { atras: [], frente: [
        ['path', { d: 'M31 2.5 C36 1 38 -2 39 -5 M23 1.5 C27 -3 34 -6 39 -5', fill: 'none', stroke: '#00b312', 'stroke-width': 1.6 }],
        ['circle', { cx: 39, cy: -5, r: 2.4, fill: '#facc15', stroke: L, 'stroke-width': 1.2 }],
        ['path', { d: 'M52 30 L48 36 L52 36 L48 42', fill: 'none', stroke: '#facc15', 'stroke-width': 1.6, 'stroke-linejoin': 'round' }],
        ['path', { d: 'M8 46 L5 50 L8 50 L5 54', fill: 'none', stroke: '#facc15', 'stroke-width': 1.4, 'stroke-linejoin': 'round' }]
      ] }
    ],
    formas: [
      sombra(34, 12),
      ['path', { d: 'M28 24 C18 10 4 10 6 18 C8 24 20 26 28 26 Z', fill: '#bae6fd', ...C, opacity: 0.9 }],
      ['path', { d: 'M34 24 C42 8 58 6 58 15 C58 22 44 26 34 26 Z', fill: '#bae6fd', ...C, opacity: 0.9 }],
      ['path', { d: 'M10 17 L24 23 M54 13 L38 23', stroke: '#22d3ee', 'stroke-width': 1.2, opacity: 0.8 }],
      ['path', { d: 'M27 30 l-7 10 l-3 6 M30 32 l-4 12 l1 6 M35 31 l2 10 l-2 6', fill: 'none', stroke: L, 'stroke-width': 1.6 }],
      ['path', { d: 'M33 33 C42 30 52 38 50 50 C49 57 43 61 39 58 C34 54 30 40 33 33 Z', fill: '#eab308', ...C }],
      ['path', { d: 'M35 38 C40 36 46 38 49 42 L50 46 C45 42 39 41 34.5 43 Z M37.5 48 C42 47 47 49 49.5 52 L48 56 C45 53 41 52 39 53 Z', fill: L }],
      ['path', { d: 'M41 58.5 L39 63 L44 59 Z', fill: L }],
      brilho('M37 35 C41 33.5 45 34.5 47.5 37'),
      ['ellipse', { cx: 30, cy: 29, rx: 8, ry: 6.5, fill: '#1f2937', ...C }],
      ['path', { d: 'M27 25 C24 27 24 31 27 33', fill: 'none', stroke: '#facc15', 'stroke-width': 1.5 }],
      ['path', { d: 'M17 22 C15 14 20 9 26 10 C31 11 33 16 31 21 C29 26 20 27 17 22 Z', fill: '#1f2937', ...C }],
      ['path', { d: 'M18.5 16 C19 12.5 23 11.5 25.5 13 L24 18 L19 18.5 Z', fill: '#22d3ee', stroke: L, 'stroke-width': 1.2 }],
      ['path', { d: 'M20 14.5 L22.5 14', stroke: '#e0f2fe', 'stroke-width': 1, 'stroke-linecap': 'round' }],
      ['path', { d: 'M19 22.5 l-2 3 M22 23.5 l0 3', stroke: '#facc15', 'stroke-width': 1.6, 'stroke-linecap': 'round' }],
      ['path', { d: 'M24 10.5 L22 6 L25 6 L23 1.5', fill: 'none', stroke: '#facc15', 'stroke-width': 1.6 }],
      ['path', { d: 'M28 12 L30 7.5 L27.5 7 L31 2.5', fill: 'none', stroke: '#facc15', 'stroke-width': 1.6 }],
      ['circle', { cx: 23, cy: 1.5, r: 2, fill: '#00b312', stroke: L, 'stroke-width': 1.2 }],
      ['circle', { cx: 31, cy: 2.5, r: 2, fill: '#00b312', stroke: L, 'stroke-width': 1.2 }]
    ]
  }
};

function forma(alvo, [tag, atributos, texto]) {
  const no = document.createElementNS(SVG, tag);
  for (const [k, v] of Object.entries(atributos)) no.setAttribute(k, v);
  if (texto) no.textContent = texto;
  alvo.appendChild(no);
}

/* Pedaços de casca no chão, com as manchas na cor que o aluno escolheu e o desenho da casca comprada na loja. */
const ENFEITE_CASCA = {
  'casca-listras': cor => [['path', { d: 'M2 59 h10.5 M52 58.5 h10.5', stroke: cor, 'stroke-width': 1.6 }]],
  'casca-binaria': () => [['text', { x: 3, y: 61.5, 'font-size': 4.5, 'font-family': 'monospace', 'font-weight': 700, fill: '#1f6f2b' }, '01'],
    ['text', { x: 53.5, y: 61.5, 'font-size': 4.5, 'font-family': 'monospace', 'font-weight': 700, fill: '#1f6f2b' }, '10']],
  'casca-estrelas': () => [['path', { d: 'M7 57 l0.8 1.8 l1.8 0.8 l-1.8 0.8 l-0.8 1.8 l-0.8 -1.8 l-1.8 -0.8 l1.8 -0.8 Z M57.5 57 l0.8 1.8 l1.8 0.8 l-1.8 0.8 l-0.8 1.8 l-0.8 -1.8 l-1.8 -0.8 l1.8 -0.8 Z', fill: '#f2b443' }]]
};
function casca(alvo, corMancha, estilo = null) {
  const cor = estilo === 'casca-dourada' ? '#f6d365' : '#f3f3f3';
  [['path', { d: 'M1 63 L2 55 L5 57.5 L7 53 L10 56.5 L12 54 L13 63 Z', fill: cor, ...C }],
    ['path', { d: 'M51 63 L52 54 L54.5 57 L57 52.5 L59.5 56 L62 54.5 L63 63 Z', fill: cor, ...C }]].forEach(f => forma(alvo, f));
  if (ENFEITE_CASCA[estilo]) ENFEITE_CASCA[estilo](corMancha).forEach(f => forma(alvo, f));
  else if (estilo !== 'casca-dourada') [['rect', { x: 5.5, y: 59, width: 2.4, height: 2, fill: corMancha }],
    ['rect', { x: 56, y: 58.5, width: 2.4, height: 2, fill: corMancha }]].forEach(f => forma(alvo, f));
}

/* Brilho atrás da forma final, na cor do tipo. */
function aura(alvo, cor) {
  forma(alvo, ['ellipse', { cx: 32, cy: 30, rx: 33, ry: 33, fill: cor, opacity: 0.16 }]);
  [[4, 8], [60, 4], [62, 50], [2, 30]].forEach(([x, y]) =>
    forma(alvo, ['path', { d: `M${x} ${y - 3} L${x + 1} ${y - 1} L${x + 3} ${y} L${x + 1} ${y + 1} L${x} ${y + 3} L${x - 1} ${y + 1} L${x - 3} ${y} L${x - 1} ${y - 1} Z`, fill: cor }]));
}

/* forma: 1 = acabou de nascer, 2 e 3 = evoluções compradas na lojinha (o servidor diz qual). */
export function nomeDaCriatura(especie, formaAtual = 1) {
  const criatura = CRIATURAS[especie] || CRIATURAS.exploradora;
  return criatura.nomes[Math.min(Math.max(formaAtual, 1), 3) - 1];
}

export function criarCriatura(especie, { silhueta = false, comCasca = false, corMancha = '#00b312', estiloCasca = null, rotulo, forma: nivelForma = 1 } = {}) {
  const criatura = CRIATURAS[especie] || CRIATURAS.exploradora;
  const extras = criatura.evolucoes.slice(0, Math.max(0, Math.min(nivelForma, 3) - 1));
  const svg = document.createElementNS(SVG, 'svg');
  svg.setAttribute('viewBox', '-1 -3 66 67');
  // as evoluções têm o corpo do mesmo tamanho e os enfeites (asas, coroa, aura) saem um pouco para fora da caixa
  if (extras.length) svg.setAttribute('overflow', 'visible');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', rotulo || (silhueta ? 'Criatura em formação' : nomeDaCriatura(especie, nivelForma)));
  svg.classList.add('criatura', `criatura-forma-${extras.length + 1}`);
  if (silhueta) svg.classList.add('silhueta');
  const corpo = document.createElementNS(SVG, 'g');
  corpo.setAttribute('class', 'criatura-corpo');
  if (extras.length === 2 && !silhueta) aura(corpo, criatura.corTipo);
  extras.forEach(e => e.atras.forEach(f => forma(corpo, f)));
  criatura.formas.forEach(f => forma(corpo, f));
  extras.forEach(e => e.frente.forEach(f => forma(corpo, f)));
  svg.appendChild(corpo);
  if (comCasca) casca(svg, corMancha, estiloCasca);
  return svg;
}
