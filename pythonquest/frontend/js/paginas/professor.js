/* Área do professor: as turmas dele, com o código de convite, e o formulário para criar uma turma nova.
   O painel com as métricas da turma é a etapa 7 do plano; até lá a página diz isso claramente. */
import { el, irPara } from '../util.js';
import { sessao } from '../estado.js';
import { api } from '../api.js';
import { layoutPublico } from '../componentes/layout.js';
import { criarOvo, ESTAGIOS } from '../componentes/ovo.js';

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
    el('div', { className: 'turma-codigo' }, el('code', {}, turma.codigo_convite), copiar));
}

export async function paginaProfessor() {
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
    el('p', { className: 'aviso' }, 'O painel com o desempenho da turma chega numa próxima etapa.'),
    el('div', { className: 'espaco-acima' }, sair)));
}
