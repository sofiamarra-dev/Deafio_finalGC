/* Minha evolução: o que o aluno fez nos últimos dias, onde está indo bem e onde precisa melhorar.
   Tudo vem de /api/evolucao, calculado no servidor a partir dos envios. */
import { el, irPara } from '../util.js';
import { api } from '../api.js';
import { layoutApp } from '../componentes/layout.js';
import { graficoAtividade, barrasPorcentagem } from '../componentes/graficos.js';
import { cartaoJogador } from './trilha.js';

const DICA_ERRO = {
  TypeError: 'Confira se você converteu o input() com int() ou float() antes de fazer conta.',
  SyntaxError: 'Leia a linha do erro com calma: falta dois-pontos depois do if? Parênteses ou aspas abertos?',
  IndentationError: 'Use 4 espaços para cada nível dentro do if, for ou def.',
  NameError: 'Veja se a variável foi criada antes e se o nome está escrito igual (maiúsculas contam).',
  saida_errada: 'Compare letra por letra com a saída esperada: espaços, acentos e pontuação contam.',
  tempo_esgotado: 'Confira se o laço muda a variável da condição, senão ele nunca para.',
  alternativa_errada: 'Leia a explicação que aparece depois de errar: ela diz por que aquela opção não serve.',
  ValueError: 'O valor digitado não estava no formato que o int() ou float() espera.'
};

function numero(valor, rotulo) {
  return el('div', { className: 'numero-perfil' }, el('strong', {}, String(valor)), el('span', {}, rotulo));
}

export async function paginaEvolucao() {
  let ev, trilha;
  try { [ev, trilha] = await Promise.all([api.evolucao(), api.trilha()]); }
  catch (erro) {
    if (erro.status === 401) { irPara('entrar'); return el('div'); }
    return layoutApp(el('p', { className: 'aviso erro' }, erro.message), { ativo: 'evolucao' });
  }
  const partes = [el('h1', { className: 'titulo-pagina' }, 'Minha evolução')];
  if (!ev.total_envios) {
    partes.push(el('div', { className: 'cartao vazio' },
      el('p', {}, 'Ainda não há envios para mostrar.'),
      el('p', { className: 'texto-2' }, 'Resolva alguns exercícios na trilha e volte aqui para ver seus acertos, erros e onde melhorar.'),
      el('a', { className: 'botao', href: '#trilha' }, 'Ir para a trilha')));
    return layoutApp(el('div', { className: 'pagina-evolucao' }, partes), { ativo: 'evolucao', lateral: [cartaoJogador(trilha.jogador)] });
  }
  partes.push(el('div', { className: 'numeros-perfil' },
    numero(ev.total_envios, 'envios'), numero(ev.acertos, 'certos'), numero(ev.erros, 'com erro'), numero(ev.dicas, 'dicas abertas')));

  partes.push(el('section', { className: 'secao-perfil' }, el('h2', {}, 'Últimos 14 dias'), graficoAtividade(ev.atividade)));

  const melhorar = el('section', { className: 'secao-perfil secao-melhorar' }, el('h2', {}, 'Onde preciso melhorar'));
  if (!ev.melhorar.length && !ev.erros_comuns.length && !ev.exercicios_dificeis.length) {
    melhorar.append(el('p', { className: 'texto-2' }, 'Nada preocupante por enquanto. Continue assim!'));
  }
  if (ev.melhorar.length) {
    melhorar.append(el('p', { className: 'rotulo-campo' }, 'Assuntos com menos acertos'),
      barrasPorcentagem(ev.melhorar, { rotulo: a => a.nome, valor: a => a.taxa,
        detalhe: a => `${a.acertos} certo(s) em ${a.envios} envio(s)` }),
      el('p', { className: 'campo-ajuda' }, 'Abra o Guia da sala na trilha para revisar esses assuntos.'));
  }
  if (ev.erros_comuns.length) {
    melhorar.append(el('p', { className: 'rotulo-campo' }, 'Seus erros mais comuns'),
      el('ul', { className: 'erros-comuns' }, ev.erros_comuns.map(e => el('li', { className: 'cartao' },
        el('p', { className: 'conquista-titulo' }, `${e.nome} · ${e.vezes}x`),
        DICA_ERRO[e.tipo] ? el('p', { className: 'conquista-texto' }, DICA_ERRO[e.tipo]) : null))));
  }
  if (ev.exercicios_dificeis.length) {
    melhorar.append(el('p', { className: 'rotulo-campo' }, 'Exercícios em que você mais errou'),
      el('ul', { className: 'lista-simples' }, ev.exercicios_dificeis.map(x => el('li', {},
        el('span', {}, x.titulo, el('small', {}, x.concluiram ? ` · ${x.erros} erro(s) antes de acertar` : ` · ainda não concluído (${x.erros} erro(s))`)),
        el('a', { className: 'botao secundario pequeno', href: '#exercicio/' + encodeURIComponent(x.id) }, x.concluiram ? 'Praticar de novo' : 'Tentar')))));
  }
  partes.push(melhorar);

  if (ev.fortes.length) {
    partes.push(el('section', { className: 'secao-perfil' }, el('h2', {}, 'Seus pontos fortes'),
      barrasPorcentagem(ev.fortes, { rotulo: a => a.nome, valor: a => a.taxa, detalhe: a => `${a.acertos} certo(s) em ${a.envios} envio(s)` })));
  }
  const comDados = ev.assuntos.filter(a => a.envios >= 1);
  partes.push(el('section', { className: 'secao-perfil' },
    el('details', {}, el('summary', {}, `Todos os assuntos (${comDados.length})`),
      barrasPorcentagem([...comDados].sort((a, b) => a.nome.localeCompare(b.nome)), { rotulo: a => a.nome, valor: a => a.taxa,
        detalhe: a => `${a.acertos} certo(s) em ${a.envios} envio(s)` }))));

  return layoutApp(el('div', { className: 'pagina-evolucao' }, partes), { ativo: 'evolucao', lateral: [cartaoJogador(trilha.jogador)] });
}
