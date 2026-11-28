/* As duas cascas de página: pública (início, entrar, cadastro) e do app (aluno logado). */
import { el, irPara } from '../util.js';
import { sessao } from '../estado.js';
import { icone } from './icones.js';
import { atualizarStatusServidor } from './status-servidor.js';

function marca() {
  return el('a', { className: 'marca', href: '#inicio', 'aria-label': 'PythonQuest, página inicial' },
    el('img', { src: 'img/marca/logo-gc-256.png', alt: 'Geração Caldeira', width: 40, height: 40 }),
    el('span', { className: 'marca-nome' }, 'Python', el('b', {}, 'Quest')));
}

export function layoutPublico(conteudo, { acoesTopo = [] } = {}) {
  const status = el('span', { className: 'status', role: 'status', 'data-estado': 'verificando' }, 'Verificando servidor…');
  atualizarStatusServidor(status);
  return el('div', { className: 'publico' },
    el('header', { className: 'topo' }, marca(), el('div', { className: 'acoes-topo' }, status, acoesTopo)),
    el('main', {}, conteudo),
    el('footer', { className: 'rodape' },
      el('img', { src: 'img/marca/logo-gc-256.png', alt: '', width: 24, height: 24 }),
      el('span', {}, 'Projeto do Geração Caldeira')));
}

export function layoutApp(conteudo, { ativo = 'trilha', lateral = null } = {}) {
  const sair = el('button', { className: 'menu-item', type: 'button', onclick: async () => {
    await sessao.sair();
    irPara('entrar');
  } }, icone('sair'), el('span', {}, 'Sair'));

  const menu = el('nav', { className: 'menu-lateral', 'aria-label': 'Menu principal' },
    marca(),
    el('a', { className: 'menu-item', href: '#trilha', 'aria-current': ativo === 'trilha' ? 'page' : null },
      icone('casa'), el('span', {}, 'Aprender')),
    el('div', { className: 'rodape-menu' },
      el('span', { className: 'quem' }, sessao.usuario ? sessao.usuario.nome : ''), sair));

  return el('div', { className: 'app' }, menu,
    el('header', { className: 'topo-celular' }, marca()),
    el('div', { className: 'app-corpo' },
      el('main', { className: 'coluna-centro' }, conteudo),
      lateral ? el('aside', { className: 'coluna-direita', 'aria-label': 'Seu progresso' }, lateral) : null));
}
