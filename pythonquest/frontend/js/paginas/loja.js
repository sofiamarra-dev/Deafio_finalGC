/* Lojinha: o aluno gasta bytes com ninhos, cascas e escudos de sequência.
   Preço, saldo e requisitos são conferidos no servidor; aqui só mostramos o que ele respondeu. */
import { el, irPara } from '../util.js';
import { api } from '../api.js';
import { sessao } from '../estado.js';
import { layoutApp } from '../componentes/layout.js';
import { criarOvo, criarCriatura } from '../componentes/ovo.js';
import { icone } from '../componentes/icones.js';
import { cartaoJogador } from './trilha.js';

const SECOES = [
  ['evolucao', 'Evolução da criatura', 'Sua criatura nasce no fim da primeira sala. Aqui ela cresce: forma 2 e forma final.'],
  ['escudo', 'Escudo de sequência', 'Pulou um dia? O escudo é gasto sozinho e sua sequência continua.'],
  ['ninho', 'Ninhos', 'Onde o seu ovo fica e, depois que ela nasce, a sua criatura. Aparece na trilha, no perfil e no ranking.'],
  ['casca', 'Cascas', 'O desenho da casca. Depois que a criatura nasce, os pedaços da casca ficam do lado dela.']
];

function aparencia(dados, extra = {}) {
  return { animar: false, cor: sessao.usuario?.avatar, ninho: dados.equipado.ninho, casca: dados.equipado.casca,
    especie: dados.criatura?.especie, forma: dados.forma, ...extra };
}

const FORMA_DO_ITEM = { 'evolucao-2': 2, 'evolucao-3': 3 };

function nomeDoItem(item, dados) {
  if (item.categoria !== 'evolucao' || !dados.criatura) return item.nome;
  return `Evoluir para ${dados.criatura.formas[FORMA_DO_ITEM[item.id] - 1]}`;
}

function vitrineDoItem(item, dados) {
  if (item.categoria === 'escudo') return el('div', { className: 'loja-icone' }, icone('escudo', { tamanho: 56 }));
  if (item.categoria === 'evolucao') {
    const especie = dados.criatura?.especie;
    return el('div', { className: 'loja-previa loja-previa-criatura' }, especie
      ? criarCriatura(especie, { forma: FORMA_DO_ITEM[item.id], rotulo: nomeDoItem(item, dados) })
      : criarCriatura('exploradora', { silhueta: true, rotulo: 'Criatura que ainda não nasceu' }));
  }
  const previa = { ...dados, equipado: { ...dados.equipado, [item.categoria]: item.id } };
  return el('div', { className: 'loja-previa' }, criarOvo(dados.ovo, aparencia(previa)));
}

function botaoDoItem(item, agir) {
  if (item.categoria === 'evolucao' && item.possui) return null;
  if (item.categoria !== 'escudo' && item.possui) {
    return item.equipado
      ? el('button', { type: 'button', className: 'botao secundario pequeno', onclick: () => agir(() => api.equipar(item.categoria, null), `${item.nome} guardado.`) }, 'Tirar')
      : el('button', { type: 'button', className: 'botao contorno-verde pequeno', onclick: () => agir(() => api.equipar(item.categoria, item.id), `Agora seu ovo usa: ${item.nome}.`) }, 'Usar');
  }
  return el('button', { type: 'button', className: 'botao pequeno', disabled: !item.pode_comprar,
    onclick: () => agir(() => api.comprar(item.id), `Você comprou: ${nomeDoItem(item, dados)}!`) },
    icone('moeda', { tamanho: 18 }), `${item.preco}`);
}

function cartaoItem(item, dados, agir) {
  const situacao = item.equipado ? el('span', { className: 'selo-item selo-uso' }, 'Em uso')
    : item.possui && item.categoria === 'evolucao' ? el('span', { className: 'selo-item selo-uso' }, 'Evoluiu!')
    : item.possui && item.categoria !== 'escudo' ? el('span', { className: 'selo-item' }, 'Seu')
    : item.motivo ? el('span', { className: 'motivo-item' }, item.motivo) : null;
  return el('li', { className: `item-loja${item.equipado ? ' item-equipado' : ''}${!item.pode_comprar && !item.possui ? ' item-travado' : ''}` },
    vitrineDoItem(item, dados),
    el('div', { className: 'item-texto' },
      el('h3', {}, nomeDoItem(item, dados)),
      el('p', { className: 'texto-2' }, item.descricao),
      situacao),
    botaoDoItem(item, agir));
}

function conteudo(dados, agir, aviso) {
  const topo = el('section', { className: 'loja-topo' },
    el('div', { className: 'loja-palco' }, criarOvo(dados.ovo, { ...aparencia(dados), animar: true })),
    el('div', { className: 'loja-saldo' },
      el('p', { className: 'saldo-numero' }, icone('moeda', { tamanho: 32 }), el('span', {}, String(dados.saldo)), el('small', {}, 'bytes')),
      el('p', { className: 'texto-2' },
        `Você ganhou ${dados.ganhos.do_xp} bytes com XP e ${dados.ganhos.das_conquistas} com conquistas.`),
      el('p', { className: 'texto-2' }, 'Cada exercício novo que você acerta dá bytes (metade do XP). Refazer não dá.'),
      el('p', { className: 'loja-escudos' }, icone('escudo', { tamanho: 20 }),
        dados.escudos === 1 ? '1 escudo guardado' : `${dados.escudos} escudos guardados`)));
  const secoes = SECOES.map(([categoria, titulo, texto]) => el('section', { className: 'secao-loja' },
    el('h2', {}, titulo),
    el('p', { className: 'texto-2' }, texto),
    el('ul', { className: 'grade-loja' }, dados.itens.filter(i => i.categoria === categoria).map(i => cartaoItem(i, dados, agir)))));
  return el('div', {}, topo, aviso, ...secoes);
}

export async function paginaLoja() {
  let dados, trilha;
  try { [dados, trilha] = await Promise.all([api.loja(), api.trilha()]); }
  catch (erro) { if (erro.status === 401) { irPara('entrar'); return el('div'); } throw erro; }

  const area = el('div', { className: 'area-loja' });
  const lateral = el('div', {}, cartaoJogador({ ...trilha.jogador, bytes: dados.saldo }));
  const desenhar = (mensagem = null, erro = false) => {
    dados.ovo = trilha.ovo.estagio;
    const aviso = mensagem ? el('p', { className: `aviso${erro ? ' erro' : ''}`, role: 'status' }, mensagem) : null;
    area.replaceChildren(conteudo(dados, agir, aviso));
  };
  async function agir(pedido, sucesso) {
    area.querySelectorAll('button').forEach(b => { b.disabled = true; });
    try {
      dados = await pedido();
      if (sessao.usuario) Object.assign(sessao.usuario, dados.equipado); // o ovo da trilha já aparece com o item
      if (trilha.criatura) trilha.criatura.forma = dados.forma;
      trilha.jogador.sequencia.escudos = dados.escudos;
      lateral.replaceChildren(cartaoJogador({ ...trilha.jogador, bytes: dados.saldo }));
      desenhar(sucesso);
    } catch (e) {
      desenhar(e.message, true);
    }
  }
  desenhar();
  return layoutApp(el('div', { className: 'pagina-loja' },
    el('h1', { className: 'titulo-pagina' }, 'Lojinha'),
    el('p', { className: 'texto-2' }, 'Gaste seus bytes para evoluir sua criatura e deixar o ovo com a sua cara. A loja não vende XP, dica nem resposta.'),
    area), { ativo: 'loja', lateral: [lateral] });
}
