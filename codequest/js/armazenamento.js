/* Único lugar que guarda dados (jogadores, progresso, ranking). Hoje usa o localStorage do navegador,
   com cópia em memória se ele não estiver disponível.
   Para um ranking compartilhado entre computadores, é aqui que entra um servidor:
   troque ler/gravar por chamadas à sua API (o resto do jogo não precisa mudar). */
window.FC = window.FC || {};

FC.armazenamento = (function () {
  const PREFIXO = 'fuga-codigo:';
  const memoria = {};
  return {
    ler(chave, padrao) {
      try {
        const bruto = localStorage.getItem(PREFIXO + chave);
        if (bruto !== null) return JSON.parse(bruto);
      } catch (err) { /* sem acesso ao armazenamento: usa a memória */ }
      return chave in memoria ? JSON.parse(memoria[chave]) : padrao;
    },
    gravar(chave, valor) {
      const texto = JSON.stringify(valor);
      memoria[chave] = texto;
      try { localStorage.setItem(PREFIXO + chave, texto); } catch (err) { /* continua só na memória */ }
    }
  };
})();
