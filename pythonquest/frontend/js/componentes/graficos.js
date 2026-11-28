/* Gráficos simples em HTML (sem biblioteca): barras por dia e barras horizontais de porcentagem.
   Cada barra tem dica ao passar o mouse (title) e o número também aparece em texto, então a cor nunca é a única pista. */
import { el } from '../util.js';

const DIAS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];

/* Atividade por dia: barra empilhada de acertos (verde) e erros (laranja). */
export function graficoAtividade(dias) {
  const maximo = Math.max(1, ...dias.map(d => d.envios));
  const colunas = dias.map(d => {
    const data = new Date(d.dia + 'T12:00:00');
    const erros = d.envios - d.acertos;
    const rotulo = `${data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}: ${d.acertos} certo(s), ${erros} com erro`;
    return el('div', { className: 'coluna-dia', title: rotulo, role: 'img', 'aria-label': rotulo },
      el('div', { className: 'pilha', style: `height:${(100 * d.envios / maximo).toFixed(1)}%` },
        erros ? el('i', { className: 'parte-erro', style: `flex:${erros}` }) : null,
        d.acertos ? el('i', { className: 'parte-acerto', style: `flex:${d.acertos}` }) : null),
      el('span', { className: 'rotulo-dia' }, DIAS[data.getDay()]));
  });
  return el('div', { className: 'grafico' },
    el('div', { className: 'legenda' },
      el('span', {}, el('i', { className: 'parte-acerto' }), 'Envios certos'),
      el('span', {}, el('i', { className: 'parte-erro' }), 'Envios com erro')),
    el('div', { className: 'colunas-dias' }, colunas));
}

/* Lista de barras horizontais (0 a 100%). */
export function barrasPorcentagem(itens, { rotulo, valor, detalhe }) {
  return el('ul', { className: 'barras-h' }, itens.map(item => el('li', { title: detalhe(item) },
    el('span', { className: 'barras-h-nome' }, rotulo(item)),
    el('div', { className: 'barras-h-trilho' }, el('i', { style: `width:${valor(item)}%` })),
    el('span', { className: 'barras-h-valor' }, `${valor(item)}%`))));
}
