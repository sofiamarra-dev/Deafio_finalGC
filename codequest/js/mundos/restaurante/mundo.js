/* Mundo 1: o restaurante do rato cozinheiro. Assunto: condicionais. */
FC.registrarMundo({
  id: 'restaurante',
  nome: 'O Restaurante',
  personagem: 'rato',
  conceito: 'condicional',
  assunto: 'Condicionais: if, elif, else, comparações, and, or, not, in',
  descricao: 'Um rato cozinheiro foge de três áreas antes que tudo exploda.',
  cor: '#e0482f',
  aviso: 'Está acabando! O gás está vazando e a sala vai explodir!',
  falhaIntro: 'Bum! {sala} foi pelos ares.',
  vitoriaTitulo: 'O rato escapou!',
  vitoriaIntro: 'O rato escapou!',
  falha: 'explosao'
});
FC.PERSONAGENS = FC.PERSONAGENS || {};
FC.PERSONAGENS.rato = function (ctx, jogador, frame, andando, olhando) { FC.desenharRato(ctx, jogador, frame, andando, olhando); };
