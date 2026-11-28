/* Ranking: geral, da semana e da turma. Tudo calculado no servidor a partir do XP gravado nos envios. */
import { el, irPara } from '../util.js';
import { api } from '../api.js';
import { layoutApp } from '../componentes/layout.js';
import { criarOvo } from '../componentes/ovo.js';
import { cartaoJogador, cartaoOvoTurma } from './trilha.js';

const ESCOPOS = [['geral', 'Geral'], ['semana', 'Esta semana'], ['turma', 'Minha turma']];
let escopoAtual = 'geral';

function linhaRanking(l, escopo) {
  return el('li', { className: `linha-ranking${l.eu ? ' linha-eu' : ''}${l.posicao <= 3 ? ' top-' + l.posicao : ''}` },
    el('span', { className: 'ranking-posicao' }, String(l.posicao)),
    el('span', { className: 'ranking-ovo' }, criarOvo(l.ovo, { animar: false, cor: l.cor, ninho: l.ninho, casca: l.casca, especie: l.especie, forma: l.forma })),
    el('a', { className: 'ranking-nome', href: '#perfil/' + l.id }, l.nome, l.eu ? el('small', {}, ' (você)') : null),
    el('span', { className: 'ranking-nivel' }, `Nível ${l.nivel}`),
    el('span', { className: 'ranking-xp' }, `${l.xp} XP`, escopo === 'semana' ? el('small', {}, ' na semana') : null));
}

function podio(linhas) {
  const ordem = [linhas[1], linhas[0], linhas[2]].filter(Boolean);
  return el('div', { className: 'podio', 'aria-hidden': 'true' }, ordem.map(l =>
    el('a', { className: `podio-lugar lugar-${l.posicao}`, href: '#perfil/' + l.id },
      el('div', { className: 'podio-ovo' }, criarOvo(l.ovo, { cor: l.cor, ninho: l.ninho, casca: l.casca, especie: l.especie, forma: l.forma })),
      el('span', { className: 'podio-nome' }, l.nome),
      el('span', { className: 'podio-xp' }, `${l.xp} XP`),
      el('div', { className: 'podio-degrau' }, String(l.posicao)))));
}

async function conteudoRanking(escopo) {
  const dados = await api.ranking(escopo);
  if (dados.sem_turma) {
    return el('div', { className: 'cartao vazio' },
      el('p', {}, 'Você ainda não está em uma turma.'),
      el('p', { className: 'texto-2' }, 'Peça o código da turma ao seu professor. Ele é usado na hora de criar a conta.'));
  }
  if (!dados.linhas.length) return el('div', { className: 'cartao vazio' }, el('p', {}, 'Ninguém ganhou XP ainda nesse período. Que tal ser o primeiro?'));
  const lista = el('ol', { className: 'lista-ranking' }, dados.linhas.map(l => linhaRanking(l, escopo)));
  const fora = dados.eu && !dados.linhas.some(l => l.eu)
    ? el('ol', { className: 'lista-ranking lista-eu' }, linhaRanking(dados.eu, escopo)) : null;
  return el('div', {}, ...(dados.ovos_turma || []).map(cartaoOvoTurma),
    dados.linhas.length >= 2 ? podio(dados.linhas) : null, lista, fora,
    escopo === 'semana' ? el('p', { className: 'nota-ranking' }, 'O ranking da semana recomeça toda segunda-feira à meia-noite.') : null);
}

export async function paginaRanking() {
  let trilha;
  try { trilha = await api.trilha(); }
  catch (erro) { if (erro.status === 401) { irPara('entrar'); return el('div'); } throw erro; }

  const area = el('div', { className: 'area-ranking', 'aria-live': 'polite' });
  const abas = el('div', { className: 'abas', role: 'tablist' });
  async function mostrar(escopo) {
    escopoAtual = escopo;
    abas.querySelectorAll('button').forEach(b => b.setAttribute('aria-selected', String(b.dataset.escopo === escopo)));
    area.replaceChildren(el('p', { className: 'carregando' }, 'Carregando…'));
    try { area.replaceChildren(await conteudoRanking(escopo)); }
    catch (erro) { area.replaceChildren(el('p', { className: 'aviso erro' }, erro.message)); }
  }
  ESCOPOS.forEach(([escopo, nome]) => {
    const b = el('button', { type: 'button', className: 'aba', role: 'tab', onclick: () => mostrar(escopo) }, nome);
    b.dataset.escopo = escopo;
    abas.append(b);
  });
  mostrar(escopoAtual);
  return layoutApp(el('div', { className: 'pagina-ranking' },
    el('h1', { className: 'titulo-pagina' }, 'Ranking'),
    el('p', { className: 'texto-2' }, 'O XP vem só da primeira vez que você acerta cada exercício. Refazer não conta.'),
    abas, area), { ativo: 'ranking', lateral: [cartaoJogador(trilha.jogador)] });
}
