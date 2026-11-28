/* Área do professor. O painel com as métricas da turma é a etapa 7 do plano; até lá esta página
   diz isso claramente em vez de mostrar números que ainda não existem. */
import { el, irPara } from '../util.js';
import { sessao } from '../estado.js';
import { api } from '../api.js';
import { layoutPublico } from '../componentes/layout.js';

export async function paginaProfessor() {
  const turmas = await api.turmasDoProfessor().catch(() => []);
  const sair = el('button', { className: 'botao secundario', type: 'button', onclick: async () => {
    await sessao.sair(); irPara('entrar');
  } }, 'Sair');
  return layoutPublico(el('section', { className: 'cartao professor-aviso' },
    el('h1', {}, `Olá, ${sessao.usuario.nome}`),
    el('p', {}, 'O painel do professor, com o desempenho da turma, chega numa próxima etapa.'),
    turmas.length
      ? [el('p', {}, 'Passe o código da turma para os alunos usarem no cadastro:'),
         el('ul', { className: 'turmas' }, turmas.map(t => el('li', {},
           el('span', {}, `${t.nome} · ${t.alunos} aluno(s)`), el('code', {}, t.codigo_convite))))]
      : el('p', {}, 'Você ainda não tem turmas. Crie uma com o comando python -m app.criar_professor --turma.'),
    sair));
}
