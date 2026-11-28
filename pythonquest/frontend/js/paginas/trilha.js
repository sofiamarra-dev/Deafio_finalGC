/* A trilha: módulos em sequência, cada um com seus exercícios como nós clicáveis em zigue-zague.
   Tudo o que aparece aqui (estados, progresso, ovo) vem de /api/trilha, calculado no servidor. */
import { sessao } from '../estado.js';
import { el, irPara, textoRico, NOME_DIFICULDADE, NOME_TIPO } from '../util.js';
import { api } from '../api.js';
import { layoutApp } from '../componentes/layout.js';
import { icone } from '../componentes/icones.js';
import { criarOvo, ESTAGIOS, CRIATURAS } from '../componentes/ovo.js';
import { abrirModal } from '../componentes/modal.js';
import { colocarAvatar } from '../componentes/avatar-trilha.js';

const DESLOCAMENTO = [0, 1, 1.6, 1, 0, -1, -1.6, -1]; // forma do zigue-zague

function iconeDoNo(exercicio) {
  if (exercicio.estado === 'concluido') return icone('certo', { tamanho: 30 });
  if (exercicio.estado === 'bloqueado') return icone('cadeado', { tamanho: 26 });
  if (exercicio.desafio_final) return icone('trofeu', { tamanho: 30 });
  return icone('estrela', { tamanho: 30 });
}

function fecharBaloes(exceto) {
  document.querySelectorAll('.balao-no').forEach(b => {
    if (b !== exceto) { b.hidden = true; b.parentElement.classList.remove('passo-aberto'); }
  });
  document.querySelectorAll('.no[aria-expanded="true"]').forEach(n => {
    if (!exceto || n.nextElementSibling !== exceto) n.setAttribute('aria-expanded', 'false');
  });
}

function criarNo(exercicio, indice, { atual, posicao, total }) {
  const rotuloEstado = { concluido: 'concluído', liberado: 'liberado', bloqueado: 'bloqueado' }[exercicio.estado];
  const balao = el('div', { className: 'balao-no', hidden: true, role: 'dialog', 'aria-label': exercicio.titulo });
  const no = el('button', {
    type: 'button',
    className: `no no-${exercicio.estado}${atual ? ' no-atual' : ''}${exercicio.desafio_final ? ' no-final' : ''}`,
    'aria-label': `${exercicio.titulo}, ${NOME_DIFICULDADE[exercicio.dificuldade]}, ${rotuloEstado}`,
    'aria-expanded': 'false'
  }, iconeDoNo(exercicio));

  if (exercicio.estado === 'bloqueado') {
    balao.append(el('p', { className: 'balao-titulo' }, exercicio.titulo),
      el('p', { className: 'balao-texto' }, 'Conclua os exercícios anteriores para desbloquear.'));
  } else {
    balao.append(
      el('p', { className: 'balao-titulo' }, exercicio.titulo),
      el('p', { className: 'balao-texto' },
        `${NOME_TIPO[exercicio.tipo]} · ${NOME_DIFICULDADE[exercicio.dificuldade]} · ${posicao} de ${total}`),
      el('a', { className: 'botao largo', href: '#exercicio/' + encodeURIComponent(exercicio.id) },
        exercicio.estado === 'concluido' ? 'Praticar de novo' : 'Começar'));
  }

  no.addEventListener('click', evento => {
    evento.stopPropagation();
    const abrir = balao.hidden;
    fecharBaloes(balao);
    balao.hidden = !abrir;
    no.parentElement.classList.toggle('passo-aberto', abrir); // o balão fica por cima dos próximos nós
    no.setAttribute('aria-expanded', String(abrir));
    if (exercicio.estado === 'bloqueado') {
      no.classList.remove('tremer'); void no.offsetWidth; no.classList.add('tremer');
    }
    if (abrir) (balao.querySelector('a') || no).focus({ preventScroll: true });
  });

  const desloc = DESLOCAMENTO[indice % DESLOCAMENTO.length];
  no.dataset.parada = exercicio.id; // ponto onde o ovo pode parar
  return el('li', { className: `passo${atual ? ' passo-com-ovo' : ''}`, style: `--desloc:${desloc}` }, no, balao);
}

/* A porta no fim de cada sala. Ela abre quando o módulo é concluído (estado vindo do servidor). */
function criarPorta(modulo, seguinte) {
  const aberta = modulo.estado === 'concluido';
  const balao = el('div', { className: 'balao-no', hidden: true, role: 'dialog', 'aria-label': 'Porta' });
  balao.append(
    el('p', { className: 'balao-titulo' }, aberta ? `Porta para: ${seguinte.titulo}` : 'Porta trancada'),
    el('p', { className: 'balao-texto' }, aberta
      ? (seguinte.estado === 'em_producao' ? 'A próxima sala ainda está em produção.' : 'Seu ovo já pode seguir para a próxima sala.')
      : `Conclua os exercícios Fácil, Intermediário e o desafio final de ${modulo.titulo} para abrir.`));
  const porta = el('button', {
    type: 'button', className: `porta ${aberta ? 'porta-aberta' : 'porta-trancada'}`,
    'aria-label': aberta ? `Porta aberta para ${seguinte.titulo}` : 'Porta trancada', 'aria-expanded': 'false'
  }, el('span', { className: 'porta-folha', 'aria-hidden': 'true' }), aberta ? null : icone('cadeado', { tamanho: 22 }));
  porta.dataset.parada = 'porta-' + modulo.id;
  porta.addEventListener('click', evento => {
    evento.stopPropagation();
    const abrir = balao.hidden;
    fecharBaloes(balao);
    balao.hidden = !abrir;
    porta.parentElement.classList.toggle('passo-aberto', abrir);
    porta.setAttribute('aria-expanded', String(abrir));
    if (!aberta) { porta.classList.remove('tremer'); void porta.offsetWidth; porta.classList.add('tremer'); }
  });
  return el('div', { className: 'passagem' }, porta, balao);
}

function abrirGuia(modulo) {
  const corpo = el('div', { className: 'carregando' }, 'Carregando o guia…');
  abrirModal({
    titulo: `Guia: ${modulo.titulo}`,
    conteudo: corpo,
    acoes: [el('button', { className: 'botao', type: 'button', onclick: () => document.querySelector('.fundo-modal')?.click() }, 'Entendi')]
  });
  api.guia(modulo.id).then(g => corpo.replaceWith(el('div', { className: 'guia' }, textoRico(g.guia))))
    .catch(e => { corpo.textContent = e.message; });
}

function secaoModulo(modulo, proximo) {
  const classes = { concluido: 'faixa-concluida', liberado: 'faixa-ativa', bloqueado: 'faixa-bloqueada', em_producao: 'faixa-bloqueada' };
  const subtitulo = {
    concluido: 'Módulo concluído',
    liberado: `${modulo.concluidos} de ${modulo.total} exercícios`,
    bloqueado: 'Conclua o módulo anterior para liberar',
    em_producao: 'Conteúdo em produção'
  }[modulo.estado];

  const faixa = el('header', { className: `faixa-modulo ${classes[modulo.estado]}` },
    el('div', {},
      el('p', { className: 'faixa-rotulo' }, `Sala ${modulo.ordem} · ${subtitulo}`),
      el('h2', {}, modulo.titulo),
      el('p', { className: 'faixa-descricao' }, modulo.descricao)),
    modulo.tem_guia && modulo.estado !== 'bloqueado'
      ? el('button', { className: 'botao-guia', type: 'button', onclick: () => abrirGuia(modulo) }, icone('livro', { tamanho: 22 }), 'Guia')
      : null);

  const secao = el('section', {
    className: `modulo-trilha sala sala-${modulo.estado}`, style: `--sala:${(modulo.ordem - 1) % 6}`,
    'aria-label': `Sala ${modulo.ordem}: ${modulo.titulo}`
  }, faixa);
  if (!modulo.exercicios.length) return secao;

  let indice = 0;
  for (const dificuldade of ['facil', 'intermediario', 'avancado']) {
    const lista = modulo.exercicios.filter(e => e.dificuldade === dificuldade);
    if (!lista.length) continue;
    secao.append(el('p', { className: 'divisor-nivel' }, el('span', {}, NOME_DIFICULDADE[dificuldade])));
    secao.append(el('ol', { className: 'caminho' }, lista.map((ex, i) =>
      criarNo(ex, indice++, { atual: ex.id === proximo, posicao: i + 1, total: lista.length }))));
  }
  return secao;
}

/* Nível, XP e sequência de dias: números calculados no servidor a partir dos envios. */
export function cartaoJogador(jogador) {
  const { xp, nivel, xp_inicio_nivel: inicio, xp_proximo_nivel: proximo, sequencia } = jogador;
  const pct = Math.round(100 * (xp - inicio) / (proximo - inicio));
  const textoSequencia = sequencia.dias === 0 ? 'Acerte um exercício hoje para começar uma sequência.'
    : sequencia.estudou_hoje ? 'Você já estudou hoje. Volte amanhã para continuar!'
    : 'Acerte um exercício hoje para não perder a sequência.';
  return el('section', { className: 'cartao cartao-jogador' },
    el('div', { className: 'jogador-linha' },
      el('div', { className: 'selo-nivel', 'aria-label': `Nível ${nivel}` }, el('small', {}, 'Nível'), String(nivel)),
      el('div', { className: 'jogador-xp' },
        el('p', { className: 'jogador-titulo' }, icone('raio', { tamanho: 18 }), `${xp} XP`),
        el('div', { className: 'barra barra-xp', role: 'progressbar', 'aria-label': 'XP até o próximo nível',
          'aria-valuemin': inicio, 'aria-valuemax': proximo, 'aria-valuenow': xp }, el('i', { style: `width:${pct}%` })),
        el('p', { className: 'jogador-legenda' }, `Faltam ${proximo - xp} XP para o nível ${nivel + 1}`))),
    el('div', { className: `sequencia${sequencia.estudou_hoje ? ' sequencia-ativa' : ''}` },
      icone('fogo', { tamanho: 26 }),
      el('div', {},
        el('p', { className: 'jogador-titulo' }, sequencia.dias === 1 ? '1 dia seguido' : `${sequencia.dias} dias seguidos`),
        el('p', { className: 'jogador-legenda' }, textoSequencia))));
}

/* O ovo coletivo da turma: aquece com as salas concluídas por todos. */
export function cartaoOvoTurma(ovo) {
  const falta = ovo.salas_para_proximo;
  return el('section', { className: 'cartao cartao-ovo-turma' },
    el('h2', {}, `Ovo da turma`),
    el('p', { className: 'turma-nome' }, ovo.turma),
    el('div', { className: 'ovo-turma-linha' },
      el('div', { className: 'ovo-turma-desenho' }, criarOvo(ovo.estagio, { cor: 'amarelo', especie: ovo.especie })),
      el('div', {},
        el('p', { className: 'jogador-titulo' }, `${ovo.salas} sala(s) somadas`),
        el('p', { className: 'jogador-legenda' }, ovo.estagio >= 6 ? 'O ovo da turma eclodiu!'
          : `Faltam ${falta} sala(s) da turma para a próxima rachadura. Ajudar um colega também conta.`),
        ovo.nome_especie ? el('p', { className: 'jogador-legenda' }, `Lá dentro: algo com cara de ${ovo.nome_especie}.`) : null)));
}

function fraseDaCriatura(criatura) {
  if (criatura.situacao === 'nasceu') return `${criatura.nome}: ${criatura.frase}`;
  if (criatura.situacao === 'formando') return `Lá dentro está se formando algo com cara de ${criatura.nome}. Veja no seu perfil.`;
  return `Conclua ${criatura.minimo - criatura.feitos} exercício(s) para descobrir que criatura está se formando.`;
}

function colunaDireita(dados) {
  const { ovo, resumo } = dados;
  const pct = resumo.exercicios_total ? Math.round(100 * resumo.exercicios_concluidos / resumo.exercicios_total) : 0;
  const continuar = dados.proximo_exercicio
    ? el('a', { className: 'botao largo', href: '#exercicio/' + encodeURIComponent(dados.proximo_exercicio) }, 'Continuar')
    : null;
  return [
    cartaoJogador(dados.jogador),
    el('section', { className: 'cartao cartao-ovo' },
      el('h2', {}, 'Seu ovo'),
      el('div', { className: 'ovo-palco' }, criarOvo(ovo.estagio, { cor: sessao.usuario?.avatar, especie: dados.criatura.especie })),
      el('p', { className: 'ovo-nome' }, ESTAGIOS[Math.min(ovo.estagio, ESTAGIOS.length - 1)].nome),
      el('p', { className: 'ovo-frase' }, ESTAGIOS[Math.min(ovo.estagio, ESTAGIOS.length - 1)].frase),
      el('a', { className: 'ovo-criatura', href: '#perfil' }, fraseDaCriatura(dados.criatura)),
      el('p', { className: 'ovo-contagem' }, `${resumo.modulos_concluidos} de ${ovo.estagios} módulos concluídos`)),
    el('section', { className: 'cartao' },
      el('h2', {}, 'Seu progresso'),
      el('div', { className: 'barra', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': resumo.exercicios_total,
        'aria-valuenow': resumo.exercicios_concluidos, 'aria-label': 'Exercícios concluídos' },
        el('i', { style: `width:${pct}%` })),
      el('p', { className: 'barra-legenda' },
        el('span', {}, `${resumo.exercicios_concluidos} de ${resumo.exercicios_total} exercícios`), el('span', {}, `${pct}%`)),
      continuar ? el('div', { className: 'espaco-acima' }, continuar) : null),
    ...(dados.ovos_turma || []).map(cartaoOvoTurma)
  ];
}

export async function paginaTrilha() {
  let dados;
  try {
    dados = await api.trilha();
  } catch (erro) {
    if (erro.status === 401) { irPara('entrar'); return el('div'); }
    return layoutApp(el('p', { className: 'aviso erro' }, erro.message));
  }
  const salas = [];
  dados.modulos.forEach((m, i) => {
    salas.push(secaoModulo(m, dados.proximo_exercicio));
    if (i < dados.modulos.length - 1) salas.push(criarPorta(m, dados.modulos[i + 1]));
  });
  const centro = el('div', { className: 'trilha' }, salas);
  centro.addEventListener('click', () => fecharBaloes());
  document.addEventListener('keydown', e => { if (e.key === 'Escape') fecharBaloes(); }, { once: true });
  const pagina = layoutApp(centro, { ativo: 'trilha', lateral: colunaDireita(dados) });
  requestAnimationFrame(() => colocarAvatar(centro, dados));
  return pagina;
}
