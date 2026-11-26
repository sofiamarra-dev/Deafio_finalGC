/* Páginas do jogo: entrar (login), mundos (escolha do mundo) e jogo. Cada uma é uma tela inteira, com seu endereço
   (#entrar, #mundos, #jogo), então o botão voltar do navegador funciona e dá para mandar o link direto.
   Regras: só entra em #mundos quem já se identificou (com nome ou como visitante), e só entra em #jogo quem escolheu um mundo. */
window.FC = window.FC || {};

FC.paginas = (function () {
  const NOMES = ['entrar', 'mundos', 'jogo'];
  const ouvintes = {};
  let atual = null;

  const pagina = n => document.getElementById('pag-' + n);
  const rotaDoHash = () => { const t = (location.hash || '').slice(1).split('-')[0]; return NOMES.indexOf(t) >= 0 ? t : null; };
  const identificado = () => !!(FC.jogador && FC.jogador.identificado());
  const permitido = n => n === 'entrar' || (identificado() && (n !== 'jogo' || FC.jogo.temPartida()));
  const alternativa = () => identificado() ? 'mundos' : 'entrar';

  /* O nome do site vem de FC.CONFIG.NOME_DO_SITE (js/config.js). */
  function aplicarNome() {
    document.title = FC.CONFIG.NOME_DO_SITE;
    Array.prototype.forEach.call(document.querySelectorAll('[data-site]'), el => { el.textContent = FC.CONFIG.NOME_DO_SITE; });
  }

  function mostrar(n) {
    NOMES.forEach(x => { pagina(x).hidden = x !== n; });
    atual = n;
    document.body.dataset.pagina = n; document.documentElement.dataset.pagina = n;
    if (n !== 'jogo') document.documentElement.style.removeProperty('--accent'); // cor padrão fora do jogo
    (ouvintes[n] || []).forEach(f => f());
    window.scrollTo(0, 0);
    const titulo = pagina(n).querySelector('h1');
    if (titulo) { titulo.tabIndex = -1; titulo.focus({ preventScroll: true }); }
  }

  function aoMudarHash() {
    let n = rotaDoHash() || 'entrar';
    if (!permitido(n)) { n = alternativa(); location.replace('#' + n); }
    mostrar(n);
  }

  window.addEventListener('hashchange', aoMudarHash);

  return {
    atual() { return atual; },
    aoEntrar(nome, f) { (ouvintes[nome] = ouvintes[nome] || []).push(f); },
    ir(n) {
      if (!permitido(n)) n = alternativa();
      if (rotaDoHash() === n) mostrar(n); else location.hash = n;
    },
    /* Abre a página do endereço atual (ou a de entrar, se não houver). */
    iniciar() { aplicarNome(); aoMudarHash(); }
  };
})();
