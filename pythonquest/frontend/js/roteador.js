/* Rotas por #hash. Cada rota desenha a página inteira dentro de #conteudo.
   "acesso" só decide para onde mandar na interface; quem protege os dados é o servidor. */
import { sessao } from './estado.js';

const rotas = new Map();
let rotaPadrao = null;
let geracao = 0;

export function registrarRota(nome, desenhar, { padrao = false, acesso = 'todos' } = {}) {
  rotas.set(nome, { desenhar, acesso });
  if (padrao) rotaPadrao = nome;
}

function rotaAtual() {
  const [nome, ...parametros] = location.hash.replace(/^#\/?/, '').split('/').map(decodeURIComponent);
  return { nome: rotas.has(nome) ? nome : rotaPadrao, parametros };
}

function destinoInicial(usuario) {
  if (!usuario) return 'inicio';
  return usuario.papel === 'professor' ? 'professor' : 'trilha';
}

async function desenhar() {
  const minhaGeracao = ++geracao;
  const principal = document.getElementById('conteudo');
  const { nome, parametros } = rotaAtual();
  const { desenhar: pagina, acesso } = rotas.get(nome);
  const usuario = sessao.usuario;

  if (acesso === 'visitante' && usuario) { location.replace('#' + destinoInicial(usuario)); return; }
  if ((acesso === 'aluno' || acesso === 'professor') && !usuario) { location.replace('#entrar'); return; }
  if ((acesso === 'aluno' || acesso === 'professor') && usuario.papel !== acesso) {
    location.replace('#' + destinoInicial(usuario)); return;
  }

  const conteudo = await pagina(...parametros);
  if (minhaGeracao !== geracao) return; // o usuário já foi para outra página
  document.getElementById('camada-modal').replaceChildren();
  principal.replaceChildren(conteudo);
  window.scrollTo(0, 0);
  principal.focus({ preventScroll: true });
}

export function iniciarRoteador() {
  window.addEventListener('hashchange', desenhar);
  return desenhar();
}
