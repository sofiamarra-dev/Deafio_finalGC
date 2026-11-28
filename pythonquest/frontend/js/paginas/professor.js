/* Área do professor: as turmas dele (com o código de convite e o ovo da turma), o formulário de turma nova
   e o painel de cada turma (#professor/turma/ID), com o desempenho calculado no servidor. */
import { el, irPara } from '../util.js';
import { sessao } from '../estado.js';
import { api } from '../api.js';
import { layoutPublico } from '../componentes/layout.js';
import { criarOvo, ESTAGIOS } from '../componentes/ovo.js';
import { graficoAtividade, barrasPorcentagem } from '../componentes/graficos.js';

function itemTurma(turma) {
  const copiar = el('button', { className: 'botao secundario pequeno', type: 'button', onclick: async () => {
    try { await navigator.clipboard.writeText(turma.codigo_convite); copiar.textContent = 'Copiado!'; }
    catch { copiar.textContent = 'Selecione e copie'; }
    setTimeout(() => { copiar.textContent = 'Copiar código'; }, 1800);
  } }, 'Copiar código');
  return el('li', {},
    el('div', { className: 'turma-ovo', title: 'Ovo da turma' }, criarOvo(turma.ovo?.estagio || 0, { animar: false, cor: 'amarelo', especie: turma.ovo?.especie })),
    el('div', { className: 'turma-dados' }, el('strong', {}, turma.nome),
      el('div', { className: 'turma-info' }, `${turma.alunos} aluno(s) · ${turma.ovo?.salas || 0} sala(s) concluídas somando todos`),
      el('div', { className: 'turma-info' }, `Ovo da turma: ${ESTAGIOS[Math.min(turma.ovo?.estagio || 0, 6)].nome}` +
        (turma.ovo?.nome_especie ? ` · tendência: ${turma.ovo.nome_especie}` : ''))),
    el('div', { className: 'turma-codigo' }, el('code', {}, turma.codigo_convite), copiar,
      el('a', { className: 'botao pequeno', href: '#professor/turma/' + turma.id }, 'Ver painel')));
}

export async function paginaProfessor(secao, id) {
  if (secao === 'turma' && id) return paginaPainelTurma(id);
  const turmas = await api.turmasDoProfessor().catch(() => []);
  const lista = el('ul', { className: 'turmas' }, turmas.map(itemTurma));
  const vazio = el('p', { className: 'turma-vazio', hidden: turmas.length > 0 }, 'Você ainda não tem turmas. Crie a primeira abaixo.');

  const erro = el('p', { className: 'aviso erro', role: 'alert', hidden: true });
  const nome = el('input', { name: 'nome', required: true, minLength: 2, maxLength: 60, placeholder: 'Ex.: 3º ano B, manhã' });
  const criar = el('button', { className: 'botao', type: 'submit' }, 'Criar turma');
  const form = el('form', { className: 'form-turma' },
    el('label', { className: 'campo' }, 'Nome da nova turma', nome), criar);
  form.addEventListener('submit', async evento => {
    evento.preventDefault();
    erro.hidden = true; criar.disabled = true;
    try {
      const turma = await api.criarTurma(nome.value);
      const item = itemTurma(turma);
      item.classList.add('turma-nova');
      lista.prepend(item);
      vazio.hidden = true;
      nome.value = '';
    } catch (falha) { erro.textContent = falha.message; erro.hidden = false; }
    criar.disabled = false;
  });

  const sair = el('button', { className: 'botao secundario', type: 'button', onclick: async () => {
    await sessao.sair(); irPara('entrar');
  } }, 'Sair');

  return layoutPublico(el('section', { className: 'cartao professor-aviso' },
    el('h1', {}, `Olá, ${sessao.usuario.nome}`),
    el('p', {}, 'Passe o código da turma para os alunos. Eles colocam o código no campo "Código da turma" ao criar a conta.'),
    el('h2', {}, 'Suas turmas'), vazio, lista, form, erro,
    el('div', { className: 'espaco-acima' }, sair)));
}

function quando(iso) {
  if (!iso) return 'nunca';
  const dias = Math.floor((Date.now() - new Date(iso)) / 86400000);
  return dias <= 0 ? 'hoje' : dias === 1 ? 'ontem' : `há ${dias} dias`;
}

function tabelaAlunos(alunos) {
  if (!alunos.length) return el('p', { className: 'texto-2' }, 'Nenhum aluno entrou nesta turma ainda. Passe o código de convite para eles.');
  const ordem = { 'nome': (a, b) => a.nome.localeCompare(b.nome), 'xp': (a, b) => b.xp - a.xp,
    'taxa': (a, b) => (a.taxa ?? 101) - (b.taxa ?? 101) };
  const corpo = el('tbody');
  const desenhar = chave => corpo.replaceChildren(...[...alunos].sort(ordem[chave]).map(a => el('tr', { className: a.atencao.length ? 'linha-atencao' : '' },
    el('td', {}, el('strong', {}, a.nome), a.apelido !== a.nome ? el('small', {}, ` (${a.apelido})`) : null,
      a.atencao.length ? el('div', { className: 'etiqueta-atencao' }, '⚠ ' + a.atencao.join(', ')) : null),
    el('td', {}, String(a.nivel)), el('td', {}, String(a.xp)), el('td', {}, String(a.salas)), el('td', {}, String(a.exercicios)),
    el('td', {}, a.taxa === null ? '–' : a.taxa + '%'), el('td', {}, quando(a.ultimo_envio)))));
  const cab = (texto, chave) => el('th', {}, chave ? el('button', { type: 'button', className: 'ordenar', onclick: () => desenhar(chave) }, texto) : texto);
  desenhar('nome');
  return el('div', { className: 'tabela-rolagem' }, el('table', { className: 'tabela-alunos' },
    el('thead', {}, el('tr', {}, cab('Aluno', 'nome'), cab('Nível'), cab('XP', 'xp'), cab('Salas'), cab('Exercícios'),
      cab('Acerto', 'taxa'), cab('Último envio'))), corpo));
}

async function paginaPainelTurma(id) {
  let p;
  try { p = await api.painelTurma(id); }
  catch (erro) {
    return layoutPublico(el('section', { className: 'cartao' }, el('p', { className: 'aviso erro' }, erro.message),
      el('a', { className: 'botao secundario', href: '#professor' }, 'Voltar')));
  }
  const atencao = p.alunos.filter(a => a.atencao.length);
  const blocos = [
    el('a', { className: 'voltar', href: '#professor' }, '← Suas turmas'),
    el('h1', { className: 'titulo-pagina' }, p.turma.nome),
    el('p', { className: 'texto-2' }, `Código de convite: ${p.turma.codigo_convite}`),
    el('div', { className: 'numeros-perfil' },
      el('div', { className: 'numero-perfil' }, el('strong', {}, String(p.alunos.length)), el('span', {}, 'alunos')),
      el('div', { className: 'numero-perfil' }, el('strong', {}, String(p.ativos_7_dias)), el('span', {}, 'estudaram nos últimos 7 dias')),
      el('div', { className: 'numero-perfil' }, el('strong', {}, p.taxa === null ? '–' : p.taxa + '%'), el('span', {}, 'dos envios certos')),
      el('div', { className: 'numero-perfil numero-ovo' }, criarOvo(p.ovo.estagio, { animar: false, cor: 'amarelo', especie: p.ovo.especie }),
        el('span', {}, `Ovo da turma: ${ESTAGIOS[Math.min(p.ovo.estagio, 6)].nome}`)))
  ];
  if (!p.total_envios) {
    blocos.push(el('div', { className: 'cartao vazio espaco-acima' }, el('p', {}, 'A turma ainda não enviou nenhuma resposta. Os gráficos aparecem assim que os alunos começarem.')));
  } else {
    blocos.push(
      el('section', { className: 'secao-perfil' }, el('h2', {}, 'Atividade da turma (14 dias)'), graficoAtividade(p.atividade)),
      el('div', { className: 'painel-duas-colunas' },
        el('section', { className: 'secao-perfil' }, el('h2', {}, 'Assuntos com menos acertos'),
          barrasPorcentagem(p.assuntos.filter(a => a.envios >= 3).slice(0, 6), { rotulo: a => a.nome, valor: a => a.taxa,
            detalhe: a => `${a.acertos} certo(s) em ${a.envios} envio(s)` }),
          el('p', { className: 'campo-ajuda' }, 'Só aparecem assuntos com pelo menos 3 envios.')),
        el('section', { className: 'secao-perfil' }, el('h2', {}, 'Erros mais comuns'),
          p.erros_comuns.length ? el('ul', { className: 'lista-simples' }, p.erros_comuns.map(e =>
            el('li', {}, el('span', {}, e.nome), el('strong', {}, `${e.vezes}x`)))) : el('p', { className: 'texto-2' }, 'Nenhum erro registrado.'))),
      el('section', { className: 'secao-perfil' }, el('h2', {}, 'Exercícios em que a turma mais trava'),
        p.exercicios_dificeis.length ? el('ul', { className: 'lista-simples' }, p.exercicios_dificeis.map(x => el('li', {},
          el('span', {}, el('strong', {}, x.titulo), el('small', {}, ` · ${x.concluiram} de ${x.tentaram} concluíram · ${x.erros} erro(s)` +
            (x.media_tentativas ? ` · ${x.media_tentativas} tentativas em média` : ''))),
          x.travados ? el('span', { className: 'etiqueta-atencao' }, `${x.travados} travado(s)`) : null))) : el('p', { className: 'texto-2' }, 'Ninguém errou ainda.')));
  }
  if (atencao.length) {
    blocos.push(el('section', { className: 'secao-perfil' }, el('h2', {}, `Precisam de atenção (${atencao.length})`),
      el('ul', { className: 'lista-simples' }, atencao.map(a => el('li', {}, el('strong', {}, a.nome), el('span', { className: 'etiqueta-atencao' }, a.atencao.join(', ')))))));
  }
  blocos.push(el('section', { className: 'secao-perfil' }, el('h2', {}, 'Alunos'), tabelaAlunos(p.alunos)));
  return layoutPublico(el('div', { className: 'painel-turma' }, blocos));
}
