/* Cartão do perfil ao lado do jogo: seu avatar num quadrado, com os acessórios comprados (clique para vestir ou tirar). */
window.FC = window.FC || {};

(function () {
  const card = document.getElementById('perfilCard');

  function desenhar() {
    const j = FC.jogador.atual();
    card.innerHTML = ''; card.hidden = !j;
    if (!j) return;
    const eq = FC.carteira.equipAtual();
    const quadro = document.createElement('div'); quadro.className = 'perfil-quadro';
    const av = FC.avatares.canvas(j.avatar, 168, eq); av.classList.add('perfil-avatar');
    quadro.appendChild(av);
    const nome = document.createElement('p'); nome.className = 'perfil-card-nome'; nome.textContent = j.nome;
    const sub = document.createElement('p'); sub.className = 'perfil-card-sub'; sub.textContent = j.turma ? 'Turma ' + j.turma : 'Sem turma';
    const saldo = document.createElement('p'); saldo.className = 'perfil-saldo';
    saldo.innerHTML = '<i class="moeda" aria-hidden="true"></i> '; saldo.append(document.createTextNode(FC.carteira.saldo() + ' moedas'));
    const tit = document.createElement('h3'); tit.textContent = 'Acessórios';
    const lista = document.createElement('ul'); lista.className = 'perfil-itens';
    const meus = FC.acessorios.lista.filter(a => FC.carteira.tem(a.id));
    meus.forEach(a => {
      const vestido = eq[a.cat] === a.id;
      const li = document.createElement('li');
      const b = document.createElement('button'); b.type = 'button'; b.className = 'perfil-item' + (vestido ? ' vestido' : '');
      b.title = a.nome + (vestido ? ' (vestido, clique para tirar)' : ' (clique para vestir)');
      b.setAttribute('aria-pressed', String(vestido)); b.setAttribute('aria-label', a.nome);
      b.appendChild(FC.acessorios.icone(a.id, 3));
      b.addEventListener('click', () => { if (vestido) FC.carteira.tirar(a.cat); else FC.carteira.equipar(a.id); });
      li.appendChild(b); lista.appendChild(li);
    });
    card.append(quadro, nome, sub, saldo, tit);
    if (meus.length) card.appendChild(lista);
    else { const v = document.createElement('p'); v.className = 'perfil-vazio'; v.textContent = 'Você ainda não comprou nada.'; card.appendChild(v); }
    const loja = document.createElement('button'); loja.type = 'button'; loja.className = 'perfil-loja'; loja.textContent = 'Abrir a loja';
    loja.addEventListener('click', () => FC.loja.abrir());
    card.appendChild(loja);
  }

  FC.perfil = { desenhar: desenhar };
  FC.carteira.aoMudar(desenhar);
  desenhar();
})();
