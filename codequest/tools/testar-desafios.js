/* Confere todos os desafios e salas sem abrir o navegador.  Uso: npm run testar
   Para cada desafio: só o bloco de "solucao" pode passar em todos os testes; qualquer outro bloco precisa falhar. */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const raiz = path.join(__dirname, '..');
const ctx = { console, setTimeout, clearTimeout, Promise, location: { search: '', hash: '' } };
ctx.window = ctx; ctx.self = ctx;
vm.createContext(ctx);
const carregar = rel => vm.runInContext(fs.readFileSync(path.join(raiz, rel), 'utf8'), ctx, { filename: rel });

['lib/skulpt/skulpt.min.js', 'lib/skulpt/skulpt-stdlib.js', 'js/config.js', 'js/desenho/util.js', 'js/python.js']
  .forEach(carregar);
const lista = dir => fs.readdirSync(path.join(raiz, dir), { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name));
['js/mundos.js', 'js/pontos.js'].forEach(carregar);
lista('js/mundos').filter(m => m.isDirectory()).forEach(m => {
  const base = 'js/mundos/' + m.name;
  ['personagem.js', 'mundo.js'].forEach(f => { if (fs.existsSync(path.join(raiz, base, f))) carregar(base + '/' + f); });
  ['desafios', 'salas'].forEach(sub => lista(base + '/' + sub).filter(f => f.name.endsWith('.js')).forEach(f => carregar(base + '/' + sub + '/' + f.name)));
});

const FC = ctx.FC;
let erros = 0;
const falhar = msg => { erros++; console.log('  ✘ ' + msg); };

async function testarVersao(rotulo, d) {
  console.log(rotulo + ' (' + d.nome + ')');
  for (const campo of ['titulo', 'historia', 'objetivo', 'codigo', 'variavel', 'blocos', 'solucao', 'testes', 'dica']) {
    if (d[campo] === undefined) falhar('falta o campo "' + campo + '"');
  }
  if (d.codigo === undefined) return;
  if ((d.codigo.match(/___/g) || []).length !== 1) { falhar('o código precisa ter exatamente um ___'); return; }
  if (!d.blocos.includes(d.solucao)) { falhar('a solução "' + d.solucao + '" não está entre os blocos'); return; }
  if (!new RegExp('^[ \\t]*' + d.variavel + '[ \\t]*=', 'm').test(d.codigo)) { falhar('a variável "' + d.variavel + '" não aparece no código'); return; }

  for (const bloco of d.blocos) {
    const codigo = d.codigo.replace('___', bloco);
    let passou;
    try { passou = (await FC.python.executarTestes(d, codigo)).every(r => r.ok); } catch (err) { passou = false; }
    const esperado = bloco === d.solucao;
    if (passou === esperado) console.log('  ✔ ' + JSON.stringify(bloco) + (esperado ? ' passa (solução)' : ' falha como esperado'));
    else falhar(JSON.stringify(bloco) + (esperado ? ' deveria passar e falhou' : ' deveria falhar e passou'));
  }
}

async function testarDesafio(id, d) {
  d.nome = d.nome || id;
  await testarVersao(id, d);
  const treino = FC.treinoDe(d);
  if (!treino) { falhar(id + ': falta a versão de treino (campo "treino")'); return; }
  await testarVersao(id + ' / treino', treino);
}

function testarSalas() {
  console.log('\nsalas');
  FC.SALAS.forEach((s, i) => {
    const ids = s.estacoes.map(e => e.id);
    ids.forEach(id => { if (!FC.DESAFIOS[id]) falhar(s.id + ': a estação "' + id + '" não tem desafio'); });
    if (!s.estacoes[s.estacoes.length - 1].saida) falhar(s.id + ': a última estação precisa ser a saída');
    if (s.estacoes.filter(e => e.saida).length !== 1) falhar(s.id + ': precisa de exatamente uma saída');
    const T = FC.CONFIG.T;
    const livre = !s.obstaculos.some(o => s.inicio.x + 14 > o.x && s.inicio.x < o.x + o.w && s.inicio.y + 10 > o.y && s.inicio.y < o.y + o.h);
    if (!livre) falhar(s.id + ': o rato começa dentro de um móvel');
    const b = s.bancada;
    if (!b) falhar(s.id + ': falta a bancada de treino (campo "bancada")');
    else {
      if (b.x < 8 || b.x + b.w > 472 || b.y < T || b.y + b.h > 314) falhar(s.id + ': a bancada está fora da sala');
      if (s.obstaculos.some(o => b.x < o.x + o.w && b.x + b.w > o.x && b.y < o.y + o.h && b.y + b.h > o.y)) falhar(s.id + ': a bancada bate em um móvel');
      if (s.inicio.x + 14 > b.x && s.inicio.x < b.x + b.w && s.inicio.y + 10 > b.y && s.inicio.y < b.y + b.h) falhar(s.id + ': a bancada fica em cima do ponto de partida');
    }
    const mundo = FC.mundo(s.mundo);
    if (!mundo) falhar(s.id + ': o mundo "' + s.mundo + '" não existe');
    else s.estacoes.forEach(e => { const d = FC.DESAFIOS[e.id]; if (d && d.conceito !== mundo.conceito) falhar(s.id + ': o desafio "' + e.id + '" é de "' + d.conceito + '", mas o mundo ' + mundo.id + ' só ensina "' + mundo.conceito + '"'); });
    if (s.apagao && !(s.apagao.escuridao > 0 && s.apagao.escuridao <= 1)) falhar(s.id + ': apagao.escuridao precisa estar entre 0 e 1');
    console.log('  ' + (i + 1) + '. ' + s.nome + ': ' + ids.length + ' desafios' + (s.apagao ? ', com apagão' : '') + ', porta em x=' + s.porta.x / T + ' ladrilhos');
  });
}

function testarPontos() {
  console.log('\npontos');
  const P = FC.CONFIG.PONTOS;
  const g = (a, b, msg) => { if (a !== b) falhar(msg + ': esperado ' + b + ', veio ' + a); };
  // não carrega js/pontos.js no vm de outro jeito: lê o arquivo e roda
  g(FC.pontos.desafio(0), P.BASE, 'sem erros dá a pontuação cheia');
  g(FC.pontos.desafio(1), P.BASE - P.PENALIDADE_ERRO, 'um erro tira uma penalidade');
  g(FC.pontos.desafio(99), P.MINIMO, 'nunca fica abaixo do mínimo');
  g(FC.pontos.bonusTempo(360000, 360000), P.BONUS_TEMPO, 'bônus máximo com o tempo todo');
  g(FC.pontos.bonusTempo(0, 360000), 0, 'sem bônus com o tempo zerado');
  console.log('  ✔ regras de pontuação');
}

(async () => {
  for (const id of Object.keys(FC.DESAFIOS)) await testarDesafio(id, FC.DESAFIOS[id]);
  testarSalas();
  testarPontos();
  console.log(erros ? '\n' + erros + ' problema(s).' : '\nTudo certo.');
  process.exit(erros ? 1 : 0);
})();
