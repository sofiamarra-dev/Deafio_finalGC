/* Configurações do jogo e listas compartilhadas. Mude os números aqui sem mexer no resto. */
window.FC = window.FC || {};

FC.CONFIG = {
  NOME_DO_SITE: 'CodeQuest',   // aparece na página de entrada, no topo das outras e na aba do navegador
  LARGURA: 480,        // tamanho do desenho em pixels
  ALTURA: 320,
  T: 32,               // tamanho de um "ladrilho" do piso
  COLUNAS: 15,
  LINHAS: 10,
  VELOCIDADE: 1.8,     // quanto o rato anda por quadro
  TEMPO_SEGUNDOS: 360, // tempo de cada sala antes da explosão (360 = 6 minutos)
  SALA_INICIAL: 0,     // área inicial dentro do mundo (0 = primeira)
  MUNDO_INICIAL: null, // id do mundo ('restaurante' ou 'prisao'); null = mostra o mapa de mundos
  PULAR_MAPA: false,   // true = começa direto no jogo, sem escolher mundo
  DESBLOQUEAR_TUDO: false, // true = todos os mundos liberados (para testar)
  // pontos: BASE por desafio, menos PENALIDADE_ERRO por erro antes do acerto (nunca abaixo de MINIMO);
  // BONUS_TEMPO (no máximo) ao sair da sala com tempo sobrando; BONUS_MUNDO ao terminar o mundo
  PONTOS: { BASE: 100, PENALIDADE_ERRO: 20, MINIMO: 40, BONUS_TEMPO: 60, BONUS_MUNDO: 200 },
  ERROS_PARA_TREINO: 3 // erros seguidos no mesmo desafio para a bancada de treino aparecer
};

/* Atalhos para testar uma sala sem jogar as anteriores:
   index.html?sala=2&tempo=120   ou   index.html#sala-2-tempo-120
   index.html?mundo=prisao&sala=3   abre a terceira área da prisão
   index.html?livre   libera todos os mundos no mapa */
(function () {
  const busca = location.search + ' ' + location.hash;
  let m = busca.match(/sala[=-](\d+)/i);
  if (m) { FC.CONFIG.SALA_INICIAL = Math.max(0, parseInt(m[1], 10) - 1); FC.CONFIG.PULAR_MAPA = true; }
  m = busca.match(/mundo[=-]([a-z]+)/i);
  if (m) { FC.CONFIG.MUNDO_INICIAL = m[1].toLowerCase(); FC.CONFIG.PULAR_MAPA = true; }
  if (/livre/i.test(busca)) FC.CONFIG.DESBLOQUEAR_TUDO = true;
  m = busca.match(/tempo[=-](\d+)/i);
  if (m) FC.CONFIG.TEMPO_SEGUNDOS = Math.max(5, parseInt(m[1], 10));
})();

FC.SALAS = [];     // preenchida por js/mundos/*/salas/*.js; cada sala tem o campo "mundo"
FC.DESAFIOS = {};  // preenchida por js/mundos/*/desafios/*.js, uma entrada por desafio

/* Versão de treino (mais fácil) de um desafio, no mesmo formato. Devolve null se o desafio não tiver treino. */
FC.treinoDe = function (desafio) {
  return desafio.treino ? Object.assign({ nome: 'Treino: ' + desafio.nome }, desafio.treino) : null;
};

/* Estação da porta de saída de uma sala (o balão e a área de interação ficam logo abaixo da porta). */
FC.estacaoSaida = function (id, portaX) {
  const T = FC.CONFIG.T;
  return { id: id, rotulo: 'Saída', saida: true, x: portaX + 16, y: T + 8, raio: 40, balao: { x: portaX + 16, y: 46 } };
};
