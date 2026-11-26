/* Carteira de moedas e acessórios de cada jogador. As moedas vêm dos pontos ganhos ao terminar as áreas dos mundos
   e são gastas na loja (chapéus e óculos para o avatar e para o personagem do jogo). Guardado por jogador em FC.armazenamento. */
window.FC = window.FC || {};

FC.carteira = (function () {
  const A = FC.armazenamento;
  const ouvintes = [];
  const chave = nome => (nome || '(visitante)').toLocaleLowerCase('pt-BR');
  const todas = () => A.ler('carteira', {});
  const nomeAtual = () => { const j = FC.jogador && FC.jogador.atual(); return j ? j.nome : null; };

  function ler(nome) {
    const c = todas()[chave(nome)] || {};
    return { ganho: c.ganho || 0, gasto: c.gasto || 0, itens: c.itens || [], equip: c.equip || {} };
  }
  function gravar(nome, c) {
    const t = todas(); t[chave(nome)] = c; A.gravar('carteira', t);
    ouvintes.forEach(f => f());
  }

  return {
    saldo() { const c = ler(nomeAtual()); return c.ganho - c.gasto; },
    ganhar(n) { if (n <= 0) return; const c = ler(nomeAtual()); c.ganho += Math.round(n); gravar(nomeAtual(), c); },
    tem(id) { return ler(nomeAtual()).itens.indexOf(id) >= 0; },
    equipAtual() { return ler(nomeAtual()).equip; },
    equipDe(nome) { return ler(nome).equip; },
    /* Compra o item se houver saldo. Devolve true se comprou. */
    comprar(id) {
      const item = FC.acessorios.porId(id), c = ler(nomeAtual());
      if (!item || c.itens.indexOf(id) >= 0 || c.ganho - c.gasto < item.preco) return false;
      c.gasto += item.preco; c.itens.push(id); c.equip[item.cat] = id;
      gravar(nomeAtual(), c); return true;
    },
    equipar(id) { const item = FC.acessorios.porId(id), c = ler(nomeAtual()); if (!item || c.itens.indexOf(id) < 0) return; c.equip[item.cat] = id; gravar(nomeAtual(), c); },
    tirar(cat) { const c = ler(nomeAtual()); delete c.equip[cat]; gravar(nomeAtual(), c); },
    /* f() é chamada sempre que a carteira ou o jogador muda. */
    aoMudar(f) { ouvintes.push(f); if (FC.jogador) FC.jogador.aoMudar(() => f()); }
  };
})();
