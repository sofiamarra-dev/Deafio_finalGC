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

function desenharCasca(grupo, estagio, mancha) {
  const topoAberto = estagio >= 6 ? 9 : 0; // na eclosão, a parte de cima da casca some
  LARGURAS.forEach((largura, y) => {
    if (y < topoAberto) return;
    const inicio = (16 - largura) / 2;
    for (let x = inicio; x < inicio + largura; x++) {
      const borda = x === inicio || x === inicio + largura - 1 || y === topoAberto || y === LARGURAS.length - 1;
      const sombra = x >= inicio + largura - 3 || y >= LARGURAS.length - 3;
      pixel(grupo, x, y, borda ? COR.contorno : (sombra ? COR.sombra : COR.casca));
    }
  });
  if (estagio < 6) [[5, 3], [5, 4], [4, 5]].forEach(([x, y]) => pixel(grupo, x, y, COR.brilho));
  MANCHAS.filter(([, y]) => y >= topoAberto).forEach(([x, y]) => pixel(grupo, x, y, mancha));
  for (let e = 1; e <= Math.min(estagio, 5); e++) {
    RACHADURAS[e].forEach(([x, y]) => pixel(grupo, x, y, e >= 3 && estagio >= 3 ? COR.luz : COR.contorno));
  }
  if (estagio === 4 || estagio === 5) [[6, 8], [9, 8]].forEach(([x, y]) => pixel(grupo, x, y, COR.olho));
}

/* As criaturas (cabeça saindo da casca). Cada uma tem 7 linhas de 13 colunas e as próprias cores.
   Qual nasce depende do jeito de estudar do aluno (calculado no servidor, em servicos/criatura.py). */
export const CRIATURAS = {
  certeira: { nome: 'Coruja Bit', cores: { v: '#7a5230', V: '#c08a5a', w: '#f3f3f3', o: '#0b0d0f', r: '#f2b443' }, linhas: [
    '..v.......v..', '..vv.....vv..', '..vVVVVVVVv..', '.vwwwVVVwwwv.', '.vwowVVVwowv.', '.vVVVVrVVVVv.', '..vVVVVVVVv..'] },
  persistente: { nome: 'Tartaruga Loop', cores: { v: '#0f766e', V: '#2dd4bf', o: '#0b0d0f', r: '#ff7a59' }, linhas: [
    '.............', '....vvvvv....', '...vVVVVVv...', '..vVoVVVoVv..', '..vVVVVVVVv..', '..vVVrrrVVv..', '...vVVVVVv...'] },
  exploradora: { nome: 'Dragãozinho Pyxel', cores: { v: '#00b312', V: '#3ddc4f', o: '#0b0d0f', r: '#ff7a59' }, linhas: [
    '..vv.....vv..', '..vVVVVVVVv..', '.vVVVVVVVVVv.', '.vVoVVVVVoVv.', '.vVVVVVVVVVv.', '.vVVVrrrVVVv.', '..vVVVVVVVv..'] },
  independente: { nome: 'Gato Sintaxe', cores: { v: '#b07b1c', V: '#f2b443', o: '#0b0d0f', r: '#ff7a59', w: '#a9b0b7' }, linhas: [
    '..v.......v..', '..vv.....vv..', '..vVvvvvvVv..', '..vVVVVVVVv..', '.wvVoVVVoVvw.', '..vVVVrVVVv..', '.w.vVVVVVv.w.'] },
  constante: { nome: 'Abelha Commit', cores: { v: '#a16207', V: '#facc15', o: '#0b0d0f', r: '#ff7a59', e: '#0b0d0f' }, linhas: [
    '...o.....o...', '....o...o....', '...vVVVVVv...', '..vVoVVVoVv..', '..eeeeeeeee..', '..vVVVrVVVv..', '...eeeeeee...'] }
};

function desenharCriatura(grupo, especie = 'exploradora', { silhueta = false, x0 = 1.5, y0 = 2 } = {}) {
  const criatura = CRIATURAS[especie] || CRIATURAS.exploradora;
  criatura.linhas.forEach((linha, y) => [...linha].forEach((c, x) => {
    const cor = criatura.cores[c];
    if (cor) pixel(grupo, x + x0, y + y0, silhueta ? '#0b0d0f' : cor);
  }));
}

/* Só a criatura (sem casca): usada no perfil para mostrar a criatura em formação, como silhueta. */
export function criarCriatura(especie, { silhueta = false } = {}) {
  const svg = document.createElementNS(SVG, 'svg');
  svg.setAttribute('viewBox', '0 0 13 7');
  svg.setAttribute('shape-rendering', 'crispEdges');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', silhueta ? 'Criatura em formação' : (CRIATURAS[especie]?.nome || 'Criatura'));
  svg.classList.add('criatura');
  desenharCriatura(svg, especie, { silhueta, x0: 0, y0: 0 });
  return svg;
}

export function criarOvo(estagio = 0, { animar = true, cor = 'verde', especie = null } = {}) {
  estagio = Math.max(0, Math.min(estagio, ESTAGIOS.length - 1));
  const svg = document.createElementNS(SVG, 'svg');
  svg.setAttribute('viewBox', '-1 -1 18 23');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', `Ovo no estágio ${estagio}: ${ESTAGIOS[estagio].nome}`);
  svg.setAttribute('shape-rendering', 'crispEdges');
  svg.classList.add('ovo');

  for (let x = 3; x < 13; x++) pixel(svg, x, 21, '#0b0d0f'); // sombra chapada no chão
  const grupo = document.createElementNS(SVG, 'g');
  if (animar) grupo.setAttribute('class', estagio >= 2 && estagio < 6 ? 'ovo-tremendo' : 'ovo-balanco');
  if (estagio >= 6) desenharCriatura(grupo, especie || 'exploradora');
  desenharCasca(grupo, estagio, CORES_OVO[cor] || COR.mancha);
  svg.appendChild(grupo);
  return svg;
}
