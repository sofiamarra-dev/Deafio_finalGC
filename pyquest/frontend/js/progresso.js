/* Progresso entre mundos: quais mundos o jogador atual concluiu (cada jogador tem o seu; sem login vale o do visitante). */
window.FC = window.FC || {};

FC.progresso = (function () {
  const A = FC.armazenamento;
  const chave = () => 'concluidos:' + (FC.jogador && FC.jogador.atual() ? FC.jogador.atual().nome.toLocaleLowerCase('pt-BR') : '(visitante)');
  const ler = () => { const v = A.ler(chave(), []); return Array.isArray(v) ? v : []; };
  const gravar = lista => A.gravar(chave(), lista);
  return {
    concluidos: ler,
    concluido(id) { return ler().indexOf(id) !== -1; },
    concluir(id) { const l = ler(); if (l.indexOf(id) === -1) { l.push(id); gravar(l); } },
    /* O primeiro mundo é sempre livre; os outros abrem quando o anterior for concluído. */
    desbloqueado(id) {
      if (FC.CONFIG.DESBLOQUEAR_TUDO) return true;
      const i = FC.MUNDOS.findIndex(m => m.id === id);
      return i <= 0 || this.concluido(FC.MUNDOS[i - 1].id);
    },
    limpar() { gravar([]); }
  };
})();
