/* O ovo evolutivo, em pixel art 2D. O estágio vem do servidor (= módulos concluídos de verdade).
   Os estágios ficam numa lista de dados, então dá para trocar desenhos ou criar outras criaturas depois. */

const SVG = 'http://www.w3.org/2000/svg';
const LARGURAS = [4, 6, 8, 10, 10, 12, 12, 14, 14, 14, 16, 16, 16, 16, 16, 14, 14, 12, 10, 6];
const COR = { casca: '#f3f3f3', sombra: '#c9cfd4', brilho: '#ffffff', mancha: '#00b312', contorno: '#0b0d0f',
  luz: '#f2b443', criatura: '#3ddc4f', criaturaSombra: '#00b312', olho: '#0b0d0f' };
/* Cores que o aluno pode escolher para as manchas do ovo (as mesmas que o servidor aceita). */
export const CORES_OVO = { verde: '#00b312', azul: '#3b82f6', roxo: '#a855f7', laranja: '#f97316', rosa: '#ec4899', amarelo: '#eab308' };
const MANCHAS = [[5, 6], [6, 6], [10, 9], [11, 9], [11, 10], [4, 13], [5, 13], [9, 15], [10, 15]];

/* Rachaduras: cada estágio soma as suas às anteriores. */
const RACHADURAS = {
  1: [[7, 3], [8, 4], [7, 5]],
  2: [[11, 7], [10, 8], [11, 9], [12, 10], [4, 10], [5, 11], [4, 12]],
  3: [[8, 6], [9, 7], [6, 7], [7, 8], [5, 9], [9, 12], [10, 13], [8, 14], [9, 15]],
  4: [[3, 14], [4, 15], [12, 13], [13, 14], [6, 16], [7, 17]],
  5: [[2, 11], [13, 11], [8, 18], [10, 17]]
};

export const ESTAGIOS = [
  { nome: 'Ovo intacto', frase: 'Todo mundo começa aqui. Conclua o primeiro módulo para ver o que acontece.' },
  { nome: 'Primeiras marcas', frase: 'Algo se mexeu lá dentro.' },
  { nome: 'Rachaduras', frase: 'As rachaduras estão aumentando. Falta pouco para abrir.' },
  { nome: 'Abrindo', frase: 'Dá para ver uma luz saindo pelas frestas.' },
  { nome: 'Quase lá', frase: 'Pedaços da casca estão soltos. Um olho apareceu!' },
  { nome: 'Eclodindo', frase: 'A cabeça já está para fora.' },
  { nome: 'Eclodiu!', frase: 'Sua criatura nasceu. Ela é fruto de todo o seu estudo.' }
];

function pixel(alvo, x, y, cor) {
  const r = document.createElementNS(SVG, 'rect');
  r.setAttribute('x', x); r.setAttribute('y', y); r.setAttribute('width', 1); r.setAttribute('height', 1);
  r.setAttribute('fill', cor);
  alvo.appendChild(r);
}

/* Itens da lojinha. Cascas: um desenho por cima da casca (só nos pixels de dentro, nunca na borda). */
const CASCA_DOURADA = { casca: '#f6d365', sombra: '#c99a2e', brilho: '#fff6cc' };
const DESENHO_CASCA = {
  'casca-listras': (x, y, mancha) => (y % 4 === 1 ? mancha : null),
  'casca-binaria': (x, y) => ((x + y * 3) % 7 === 0 && y % 2 === 0 ? '#1f6f2b' : null),
  'casca-estrelas': (x, y) => {
    const centros = [[5, 5], [10, 8], [6, 12], [11, 15], [4, 17]];
    return centros.some(([cx, cy]) => Math.abs(cx - x) + Math.abs(cy - y) <= 1 && (cx === x || cy === y)) ? '#f2b443' : null;
  }
};

/* Ninhos: linhas de pixels embaixo do ovo (y 17 a 21), desenhadas por cima da parte de baixo da casca. */
const NINHOS = {
  'ninho-palha': { cores: { a: '#d6a756', b: '#9c6b2a', c: '#6b4419' },
    linhas: ['..ab.ba..ab.ba..', '.abababababababa.', 'babababababababab', '.cbcbcbcbcbcbcbc.', '..ccccccccccccc..'] },
  'ninho-circuito': { cores: { a: '#14532d', b: '#3ddc4f', c: '#0b2e19', d: '#f2b443' },
    linhas: ['..ab.aa..aa.ba..', '.aaaabaaaabaaaaa.', 'aabadaabaadabaaba', '.cccccccccccccc..', '..ccccccccccccc..'] },
  'ninho-cristal': { cores: { a: '#7dd3fc', b: '#0ea5e9', c: '#0c4a6e', d: '#e0f2fe' },
    linhas: ['.da..ad..da..ad..', '.ab.dab.dab.dab..', 'abbbabbbabbbabbba', '.cccccccccccccc..', '..ccccccccccccc..'] },
  'ninho-vulcao': { cores: { a: '#44403c', b: '#f97316', c: '#1c1917', d: '#fde047' },
    linhas: ['..ab.ba..ab.ba..', '.aaabaaadaaabaaa.', 'abaadabbaadaabaab', '.cbcccbcccbcccbc.', '..ccccccccccccc..'] }
};

function desenharNinho(svg, id) {
  const ninho = NINHOS[id];
  if (!ninho) return false;
  ninho.linhas.forEach((linha, i) => [...linha].forEach((letra, x) => {
    if (ninho.cores[letra]) pixel(svg, x - 0.5, 17 + i, ninho.cores[letra]);
  }));
  return true;
}

function desenharCasca(grupo, estagio, mancha, casca = null) {
  const topoAberto = estagio >= 6 ? 9 : 0; // na eclosão, a parte de cima da casca some
  const cores = casca === 'casca-dourada' ? { ...COR, ...CASCA_DOURADA } : COR;
  const desenho = DESENHO_CASCA[casca];
  LARGURAS.forEach((largura, y) => {
    if (y < topoAberto) return;
    const inicio = (16 - largura) / 2;
    for (let x = inicio; x < inicio + largura; x++) {
      const borda = x === inicio || x === inicio + largura - 1 || y === topoAberto || y === LARGURAS.length - 1;
      const sombra = x >= inicio + largura - 3 || y >= LARGURAS.length - 3;
      const extra = !borda && desenho ? desenho(x, y, mancha) : null;
      pixel(grupo, x, y, borda ? cores.contorno : (extra || (sombra ? cores.sombra : cores.casca)));
    }
  });
  if (estagio < 6) [[5, 3], [5, 4], [4, 5]].forEach(([x, y]) => pixel(grupo, x, y, cores.brilho));
  if (casca !== 'casca-dourada') MANCHAS.filter(([, y]) => y >= topoAberto).forEach(([x, y]) => pixel(grupo, x, y, mancha));
  for (let e = 1; e <= Math.min(estagio, 5); e++) {
    RACHADURAS[e].forEach(([x, y]) => pixel(grupo, x, y, e >= 3 && estagio >= 3 ? COR.luz : COR.contorno));
  }
  if (estagio === 4 || estagio === 5) [[6, 8], [9, 8]].forEach(([x, y]) => pixel(grupo, x, y, COR.olho));
}

export { CRIATURAS, criarCriatura } from './criaturas.js';
import { criarCriatura } from './criaturas.js';

/* ninho e casca: ids dos itens equipados na lojinha (ou null). */
export function criarOvo(estagio = 0, { animar = true, cor = 'verde', especie = null, ninho = null, casca = null } = {}) {
  estagio = Math.max(0, Math.min(estagio, ESTAGIOS.length - 1));
  if (estagio >= 6) {
    // eclodiu: a criatura de corpo inteiro, em pé entre os pedaços da casca
    const criatura = criarCriatura(especie || 'exploradora', { comCasca: true, corMancha: CORES_OVO[cor] || COR.mancha });
    criatura.classList.add('ovo', 'ovo-eclodido');
    if (animar) criatura.classList.add('criatura-feliz');
    return criatura;
  }
  const svg = document.createElementNS(SVG, 'svg');
  svg.setAttribute('viewBox', '-1.5 -1 19 23');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', `Ovo no estágio ${estagio}: ${ESTAGIOS[estagio].nome}`);
  svg.setAttribute('shape-rendering', 'crispEdges');
  svg.classList.add('ovo');

  if (!NINHOS[ninho]) for (let x = 3; x < 13; x++) pixel(svg, x, 21, '#0b0d0f'); // sombra chapada no chão
  const grupo = document.createElementNS(SVG, 'g');
  if (animar) grupo.setAttribute('class', estagio >= 2 && estagio < 6 ? 'ovo-tremendo' : 'ovo-balanco');
  desenharCasca(grupo, estagio, CORES_OVO[cor] || COR.mancha, casca);
  svg.appendChild(grupo);
  desenharNinho(svg, ninho); // o ninho fica na frente do pé do ovo
  return svg;
}
