/* A tela de um exercício: enunciado, exemplos, área de resposta, dicas, Executar (no navegador)
   e Verificar (correção oficial no servidor), com feedback de acerto ou erro. */
import { el, irPara, textoRico, NOME_DIFICULDADE, NOME_TIPO } from '../util.js';
import { api } from '../api.js';
import { executarExemplos } from '../python-local.js';
import { criarMultiplaEscolha } from '../exercicios/multipla-escolha.js';
import { criarCompletar } from '../exercicios/completar.js';
import { criarMontar } from '../exercicios/montar.js';
import { criarEditor } from '../exercicios/editor.js';
import { criarOvo, ESTAGIOS } from '../componentes/ovo.js';
import { abrirModal } from '../componentes/modal.js';
import { soltarConfete } from '../componentes/confete.js';

function descreverEntrada(exercicio, entrada) {
  if (exercicio.modo_teste === 'funcao') return `${exercicio.funcao}(${entrada.replace(/^\[|\]$/g, '')})`;
  if (exercicio.modo_teste === 'variavel') return `${exercicio.variavel} = ${entrada}`;
  return entrada === '' ? '(sem entrada)' : entrada;
}

function tabelaExemplos(exercicio) {
  if (!exercicio.exemplos.length) return null;
  const rotuloEntrada = { funcao: 'Chamada', variavel: 'Valor testado' }[exercicio.modo_teste] || 'Entrada (digitada)';
  const rotuloSaida = exercicio.modo_teste === 'funcao' ? 'Deve devolver' : 'Saída esperada';
  return el('section', { className: 'exemplos', 'aria-label': 'Exemplos' },
    el('h2', {}, 'Exemplos'),
    el('div', { className: 'exemplos-grade' }, exercicio.exemplos.map(ex => el('div', { className: 'exemplo' },
      el('div', {}, el('span', { className: 'exemplo-rotulo' }, rotuloEntrada), el('pre', {}, descreverEntrada(exercicio, ex.entrada))),
      el('div', {}, el('span', { className: 'exemplo-rotulo' }, rotuloSaida), el('pre', {}, ex.saida))))),
    exercicio.casos_escondidos
      ? el('p', { className: 'exemplos-nota' }, `Na correção, seu código também passa por ${exercicio.casos_escondidos} teste(s) escondido(s).`)
      : null);
}

function listaCasos(casos, exercicio) {
  return el('ol', { className: 'casos' }, casos.map((caso, i) => el('li', { className: caso.passou ? 'caso-ok' : 'caso-falhou' },
    el('span', { className: 'caso-marca', 'aria-hidden': 'true' }, caso.passou ? '✓' : '✗'),
    caso.visivel === false
      ? el('span', {}, `Teste escondido ${i + 1}: ${caso.passou ? 'passou' : 'falhou'}${caso.erro && !caso.passou ? ` (${caso.erro})` : ''}`)
      : el('div', { className: 'caso-detalhe' },
          el('span', {}, `${descreverEntrada(exercicio, caso.entrada)}`),
          el('span', {}, 'Esperado: ', el('code', {}, caso.esperado || '(vazio)')),
          el('span', {}, 'Obtido: ', el('code', {}, caso.obtido || '(nada)')),
          caso.erro ? el('span', { className: 'caso-erro' }, caso.erro) : null))));
}

function mostrarEvolucaoDoOvo(ovo) {
  const estagio = Math.min(ovo.para, ESTAGIOS.length - 1);
  const palco = el('div', { className: 'ovo-palco ovo-evoluindo' }, criarOvo(ovo.de, { animar: false }));
  const modal = abrirModal({
    titulo: 'Módulo concluído!',
    conteudo: el('div', { className: 'evolucao' }, palco,
      el('p', { className: 'ovo-nome' }, ESTAGIOS[estagio].nome), el('p', {}, ESTAGIOS[estagio].frase)),
    acoes: [el('button', { className: 'botao', type: 'button', onclick: () => modal.fechar() }, 'Continuar')]
  });
  setTimeout(() => { palco.replaceChildren(criarOvo(ovo.para)); palco.classList.add('ovo-mudou'); soltarConfete(70); }, 900);
}

export async function paginaExercicio(id) {
  let exercicio;
  try {
    exercicio = await api.exercicio(id);
  } catch (erro) {
    if (erro.status === 401) { irPara('entrar'); return el('div'); }
    return el('div', { className: 'tela-exercicio' }, el('div', { className: 'exercicio-corpo' },
      el('p', { className: 'aviso erro' }, erro.message), el('a', { className: 'botao', href: '#trilha' }, 'Voltar para a trilha')));
  }

  const verificar = el('button', { className: 'botao', type: 'button', disabled: true }, 'Verificar');
  const aoMudar = () => { verificar.disabled = !resposta.pronta(); };
  const resposta = exercicio.tipo === 'multipla_escolha' ? criarMultiplaEscolha(exercicio, aoMudar)
    : exercicio.tipo === 'completar' ? criarCompletar(exercicio, aoMudar)
    : exercicio.tipo === 'montar' ? criarMontar(exercicio, aoMudar)
    : criarEditor(exercicio, aoMudar);

  /* Dicas: cada clique pede a próxima ao servidor (que registra quantas o aluno usou). */
  const listaDicas = el('ol', { className: 'dicas', 'aria-live': 'polite' }, exercicio.dicas.map(d => el('li', {}, d)));
  const botaoDica = el('button', { className: 'botao secundario pequeno', type: 'button' });
  function atualizarBotaoDica() {
    const vistas = listaDicas.children.length;
    botaoDica.textContent = vistas >= exercicio.total_dicas ? 'Sem mais dicas' : `Dica (${vistas + 1} de ${exercicio.total_dicas})`;
    botaoDica.disabled = vistas >= exercicio.total_dicas;
  }
  botaoDica.addEventListener('click', async () => {
    botaoDica.disabled = true;
    try {
      const dica = await api.dica(exercicio.id);
      const item = el('li', { className: 'dica-nova' }, dica.texto);
      listaDicas.append(item);
    } catch (erro) { listaDicas.append(el('li', {}, erro.message)); }
    atualizarBotaoDica();
  });
  atualizarBotaoDica();

  /* Executar: roda os exemplos no navegador, sem contar tentativa. */
  const saidaExecutar = el('div', { className: 'saida-executar', 'aria-live': 'polite', hidden: true });
  const executar = resposta.tipo === 'codigo' ? el('button', { className: 'botao secundario', type: 'button', onclick: async () => {
    executar.disabled = true;
    saidaExecutar.hidden = false;
    saidaExecutar.replaceChildren(el('p', {}, 'Rodando os exemplos…'));
    const resultados = await executarExemplos(exercicio, resposta.programa());
    saidaExecutar.replaceChildren(
      el('p', { className: 'saida-titulo' }, 'Teste com os exemplos (não conta como tentativa):'),
      listaCasos(resultados.map(r => ({ ...r, esperado: r.saida, passou: !r.erro && r.obtido === r.saida.trimEnd() })), exercicio));
    executar.disabled = false;
  } }, 'Executar') : null;

  /* Feedback depois de verificar (painel que sobe do rodapé, verde ou laranja). */
  const painel = el('div', { className: 'painel-resultado', hidden: true, role: 'status', 'aria-live': 'assertive' });
  const areaResposta = el('div', { className: 'area-resposta' }, resposta.elemento);

  async function enviar() {
    verificar.disabled = true;
    verificar.textContent = 'Corrigindo…';
    let r;
    try {
      r = await api.enviar(exercicio.id, resposta.resposta(), exercicio.abertura_id);
    } catch (erro) {
      painel.className = 'painel-resultado painel-erro';
      painel.replaceChildren(el('div', { className: 'painel-conteudo' }, el('p', { className: 'painel-titulo' }, 'Não deu para corrigir'),
        el('p', {}, erro.message)));
      painel.hidden = false;
      verificar.textContent = 'Verificar';
      verificar.disabled = false;
      return;
    }
    verificar.textContent = 'Verificar';
    mostrarResultado(r);
  }

  function mostrarResultado(r) {
    const acertou = r.correto;
    painel.className = `painel-resultado ${acertou ? 'painel-acerto' : 'painel-erro'}`;
    const continuar = acertou
      ? el('button', { className: 'botao', type: 'button', onclick: () => irPara(r.proximo_exercicio ? 'exercicio/' + r.proximo_exercicio : 'trilha') },
          r.proximo_exercicio ? 'Próximo exercício' : 'Voltar para a trilha')
      : el('button', { className: 'botao perigo', type: 'button', onclick: () => {
          painel.hidden = true; aoMudar(); resposta.focar?.();
        } }, 'Tentar de novo');
    const detalhes = [];
    if (!acertou && r.mensagem) detalhes.push(el('p', { className: 'painel-mensagem' }, r.mensagem));
    if (r.explicacao) detalhes.push(el('p', { className: 'painel-explicacao' }, r.explicacao));
    if (!acertou && r.explicacao_em) detalhes.push(el('p', { className: 'painel-nota' },
      'Errou de novo? A explicação completa aparece no próximo erro. As dicas também ajudam.'));
    if (r.casos?.length && exercicio.tipo !== 'multipla_escolha') {
      detalhes.push(el('details', { className: 'painel-casos', open: !acertou },
        el('summary', {}, `${r.passados} de ${r.total} testes passaram`), listaCasos(r.casos, exercicio)));
    }
    const xp = r.xp?.ganho > 0 ? el('span', { className: 'xp-ganho', title: r.xp.partes.map(p => `${p.motivo}: ${p.xp > 0 ? '+' : ''}${p.xp}`).join('\n') },
      `+${r.xp.ganho} XP`) : null;
    if (r.xp?.ganho > 0) {
      detalhes.unshift(el('ul', { className: 'xp-partes' }, r.xp.partes.map(p =>
        el('li', { className: p.xp < 0 ? 'xp-menos' : '' }, `${p.xp > 0 ? '+' : ''}${p.xp} ${p.motivo.toLowerCase()}`))));
    }
    if (acertou && !r.primeira_conclusao) detalhes.unshift(el('p', { className: 'painel-nota' }, 'Refazer é ótimo para treinar, mas o XP só vem na primeira vez.'));
    if (r.xp?.subiu_de_nivel) detalhes.unshift(el('p', { className: 'subiu-nivel' }, `Subiu para o nível ${r.jogador.nivel}!`));
    painel.replaceChildren(el('div', { className: 'painel-conteudo' },
      el('div', { className: 'painel-texto' },
        el('p', { className: 'painel-titulo' }, acertou ? (r.primeira_conclusao ? 'Mandou bem!' : 'Certo de novo!') : 'Quase lá', xp),
        detalhes),
      el('div', { className: 'painel-acoes' }, continuar)));
    painel.hidden = false;
    continuar.focus({ preventScroll: true });
    if (acertou) {
      soltarConfete(r.xp?.subiu_de_nivel ? 90 : undefined);
      if (r.modulo_concluido && r.ovo.para > r.ovo.de) mostrarEvolucaoDoOvo(r.ovo);
    } else {
      areaResposta.classList.remove('tremer'); void areaResposta.offsetWidth; areaResposta.classList.add('tremer');
    }
  }
  verificar.addEventListener('click', enviar);

  const tela = el('div', { className: 'tela-exercicio' },
    el('header', { className: 'exercicio-topo' },
      el('a', { className: 'fechar', href: '#trilha', 'aria-label': 'Voltar para a trilha' }, '✕'),
      el('div', { className: 'exercicio-etiquetas' },
        el('span', { className: `etiqueta etiqueta-${exercicio.dificuldade}` }, NOME_DIFICULDADE[exercicio.dificuldade]),
        el('span', { className: 'etiqueta' }, NOME_TIPO[exercicio.tipo]),
        exercicio.desafio_final ? el('span', { className: 'etiqueta etiqueta-final' }, 'Desafio final') : null,
        exercicio.concluido ? el('span', { className: 'etiqueta etiqueta-feito' }, 'Já concluído') : null)),
    el('main', { className: 'exercicio-corpo' },
      el('h1', {}, exercicio.titulo),
      el('div', { className: 'enunciado' }, textoRico(exercicio.enunciado)),
      tabelaExemplos(exercicio),
      areaResposta,
      saidaExecutar,
      el('section', { className: 'bloco-dicas', 'aria-label': 'Dicas' }, listaDicas)),
    el('footer', { className: 'exercicio-rodape' },
      el('div', { className: 'rodape-interno' }, el('div', { className: 'rodape-esquerda' }, botaoDica, executar), verificar)),
    painel);
  return tela;
}
