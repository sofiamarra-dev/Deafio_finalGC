/* Regras de pontuação. Os valores ficam em FC.CONFIG.PONTOS (js/config.js). */
window.FC = window.FC || {};

FC.pontos = {
  /* Pontos de um desafio resolvido: cada erro antes do acerto tira um pedaço, até o mínimo. Erros de treino não contam. */
  desafio(erros) {
    const P = FC.CONFIG.PONTOS;
    return Math.max(P.MINIMO, P.BASE - erros * P.PENALIDADE_ERRO);
  },
  /* Bônus ao sair da sala: proporcional ao tempo que sobrou. */
  bonusTempo(restanteMs, totalMs) {
    return Math.round(FC.CONFIG.PONTOS.BONUS_TEMPO * Math.max(0, Math.min(1, restanteMs / totalMs)));
  },
  /* Bônus por terminar as três áreas do mundo. */
  bonusMundo() { return FC.CONFIG.PONTOS.BONUS_MUNDO; }
};
