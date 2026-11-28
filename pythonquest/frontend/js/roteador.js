/* Rotas por #hash: cada rota aponta para uma função que desenha a página dentro de <main>.
   Isto só organiza a interface. Quem decide o que cada pessoa pode ver é sempre o servidor. */

const rotas = new Map();
let rotaPadrao = null;

export function registrarRota(nome, desenhar, { padrao = false } = {}) {
  rotas.set(nome, desenhar);
  if (padrao) rotaPadrao = nome;
}

function rotaAtual() {
  const [nome, ...parametros] = location.hash.replace(/^#\/?/, '').split('/');
  return { nome: rotas.has(nome) ? nome : rotaPadrao, parametros };
}

function desenhar() {
  const principal = document.getElementById('conteudo');
  const { nome, parametros } = rotaAtual();
  principal.replaceChildren(rotas.get(nome)(...parametros));
  principal.focus({ preventScroll: true });
}

export function iniciarRoteador() {
  window.addEventListener('hashchange', desenhar);
  desenhar();
}
