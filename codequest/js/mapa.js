/* Página #mundos: um cartão por mundo, com o assunto, o personagem e o estado (disponível, concluído, bloqueado).
   O próximo mundo só abre quando o anterior for concluído. */
window.FC = window.FC || {};

(function () {
  const $ = id => document.getElementById(id);
  const lista = $('mundos');

  /* Canvas com o personagem do mundo em pixel art. escala 2 = cartão, 4 = vitrine da tela de entrada. */
  FC.previa = function (m, escala) {
    const c = document.createElement('canvas');
    c.width = 40 * escala; c.height = 46 * escala; c.className = 'previa';
    const g = c.getContext('2d');
    g.imageSmoothingEnabled = false;
    g.scale(escala, escala);
    if (FC.PERSONAGENS[m.personagem]) FC.PERSONAGENS[m.personagem](g, { x: 13, y: 33, w: 14, h: 10 }, 0, false, 1);
    return c;
  };

  function cartao(m) {
    const livre = FC.progresso.desbloqueado(m.id), feito = FC.progresso.concluido(m.id);
    const li = document.createElement('li');
    li.className = 'mundo' + (livre ? '' : ' bloqueado') + (feito ? ' concluido' : '');
    li.style.setProperty('--cor', m.cor);
    li.appendChild(FC.previa(m, 2));
    const txt = document.createElement('div');
    txt.className = 'mundo-txt';
    const salas = FC.salasDoMundo(m.id);
    const anterior = FC.MUNDOS[FC.MUNDOS.indexOf(m) - 1];
    txt.innerHTML = '<h2></h2><p class="assunto"></p><p class="desc"></p><p class="status"></p>';
    txt.children[0].textContent = m.nome;
    txt.children[1].textContent = 'Assunto: ' + m.assunto;
    txt.children[2].textContent = m.descricao + ' (' + salas.length + ' áreas, ' + salas.reduce((n, s) => n + s.estacoes.length, 0) + ' desafios)';
    const eu = FC.jogador.atual(), pts = eu ? FC.ranking.melhorDe(eu.nome, m.id) : null;
    txt.children[3].textContent = feito ? 'Concluído' + (pts !== null ? ', melhor pontuação: ' + pts : '') : livre ? 'Disponível' : 'Bloqueado: conclua "' + anterior.nome + '" para abrir.';
    const b = document.createElement('button');
    b.className = 'primary'; b.textContent = feito ? 'Jogar de novo' : 'Jogar'; b.disabled = !livre;
    b.addEventListener('click', () => { if (livre) FC.jogo.jogar(m.id); });
    txt.appendChild(b);
    li.appendChild(txt);
    return li;
  }

  FC.paginas.aoEntrar('mundos', () => {
    lista.innerHTML = '';
    FC.MUNDOS.forEach(m => lista.appendChild(cartao(m)));
    const primeiro = lista.querySelector('button:not([disabled])');
    if (primeiro) primeiro.focus({ preventScroll: true });
  });
  $('mundosRanking').addEventListener('click', () => FC.ranking.abrir());
  $('mundosTrocar').addEventListener('click', () => FC.paginas.ir('entrar'));

  /* Vitrine da página de entrada: os personagens de cada mundo, parados no chão. */
  FC.paginas.aoEntrar('entrar', () => {
    const palco = $('elenco');
    if (palco.children.length) return;
    FC.MUNDOS.forEach(m => { const f = document.createElement('div'); f.className = 'figura'; f.style.setProperty('--cor', m.cor); f.appendChild(FC.previa(m, 4)); palco.appendChild(f); });
  });
})();
