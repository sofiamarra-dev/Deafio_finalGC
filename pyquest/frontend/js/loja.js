/* Loja de acessórios: gasta as moedas da carteira em chapéus e óculos, que aparecem no avatar, no ranking e no jogo. */
window.FC = window.FC || {};

(function () {
  const $ = id => document.getElementById(id);
  const modal = $('loja'), itens = $('lojaItens'), msg = $('lojaMsg'), prev = $('lojaPrev');

  function saldo() { const n = FC.carteira.saldo(); $('lojaSaldo').textContent = n; $('lojaSaldo2').textContent = n; }

  function desenharPrevia() {
    prev.innerHTML = '';
    const eu = FC.jogador.atual(), eq = FC.carteira.equipAtual();
    const av = FC.avatares.canvas(eu ? eu.avatar : FC.avatares.padrao, 96, eq); av.className = 'avatar loja-av';
    prev.appendChild(av);
  }

  function desenhar() {
    saldo(); desenharPrevia();
    const n = FC.carteira.saldo(), eq = FC.carteira.equipAtual();
    itens.innerHTML = '';
    Object.keys(FC.acessorios.categorias).forEach(cat => {
      const h = document.createElement('h3'); h.textContent = FC.acessorios.categorias[cat]; itens.appendChild(h);
      const ul = document.createElement('ul'); ul.className = 'loja-lista';
      FC.acessorios.lista.filter(a => a.cat === cat).forEach(a => {
        const tem = FC.carteira.tem(a.id), vestido = eq[cat] === a.id;
        const li = document.createElement('li'); if (vestido) li.className = 'vestido';
        const ic = FC.acessorios.icone(a.id, 5);
        const nome = document.createElement('span'); nome.className = 'loja-nome'; nome.textContent = a.nome;
        const b = document.createElement('button'); b.type = 'button';
        if (vestido) { b.textContent = 'Tirar'; b.addEventListener('click', () => { FC.carteira.tirar(cat); msg.textContent = a.nome + ' guardado.'; }); }
        else if (tem) { b.textContent = 'Vestir'; b.addEventListener('click', () => { FC.carteira.equipar(a.id); msg.textContent = 'Você vestiu: ' + a.nome + '.'; }); }
        else {
          b.className = 'compra'; b.innerHTML = '<i class="moeda" aria-hidden="true"></i> ' + a.preco; b.disabled = n < a.preco;
          b.setAttribute('aria-label', 'Comprar ' + a.nome + ' por ' + a.preco + ' moedas');
          if (n < a.preco) b.title = 'Faltam ' + (a.preco - n) + ' moedas';
          b.addEventListener('click', () => { if (FC.carteira.comprar(a.id)) { if (FC.musica) FC.musica.efeito('moeda'); msg.textContent = 'Comprado e vestido: ' + a.nome + '!'; } });
        }
        li.append(ic, nome, b); ul.appendChild(li);
      });
      itens.appendChild(ul);
    });
  }

  FC.loja = {
    abrir() { msg.textContent = ''; desenhar(); modal.hidden = false; $('lojaFechar').focus(); },
    fechar() { modal.hidden = true; }
  };
  $('lojaFechar').addEventListener('click', () => FC.loja.fechar());
  modal.addEventListener('keydown', ev => { if (ev.key === 'Escape') FC.loja.fechar(); });
  $('mundosLoja').addEventListener('click', () => FC.loja.abrir());
  FC.carteira.aoMudar(() => { saldo(); if (!modal.hidden) desenhar(); if (FC.ui) FC.ui.mostrarJogador(FC.jogador.atual()); if (FC.mapa && FC.mapa.atualizar) FC.mapa.atualizar(); });
  saldo();
})();
