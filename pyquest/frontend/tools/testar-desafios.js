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

const passa = async (d, codigo) => { try { return (await FC.python.executarTestes(d, codigo)).every(r => r.ok); } catch (err) { return false; } };
const relatar = (rotulo, passou, esperado) => {
  if (passou === esperado) console.log('  ✔ ' + rotulo + (esperado ? ' passa (solução)' : ' falha como esperado'));
  else falhar(rotulo + (esperado ? ' deveria passar e falhou' : ' deveria falhar e passou'));
};

async function testarVersao(rotulo, d) {
  const tipo = d.tipo || 'lacuna';
  console.log(rotulo + ' (' + d.nome + ', ' + tipo + ')');
  const base = ['titulo', 'historia', 'objetivo', 'codigo', 'blocos', 'solucao', 'dica'].concat(tipo === 'prever' ? [] : ['variavel', 'testes']);
  for (const campo of base) if (d[campo] === undefined) falhar('falta o campo "' + campo + '"');
  if (d.codigo === undefined || d.blocos === undefined) return;
  if (!['lacuna', 'duplo', 'ordenar', 'prever'].includes(tipo)) { falhar('tipo desconhecido: ' + tipo); return; }
  if (tipo !== 'prever' && !new RegExp('^[ \\t]*' + d.variavel + '[ \\t]*=', 'm').test(d.codigo)) { falhar('a variável "' + d.variavel + '" não aparece no código'); return; }
  const lacunas = (d.codigo.match(/___/g) || []).length;

  if (tipo === 'lacuna') {
    if (lacunas !== 1) { falhar('o código precisa ter exatamente um ___'); return; }
    if (!d.blocos.includes(d.solucao)) { falhar('a solução "' + d.solucao + '" não está entre os blocos'); return; }
    for (const bloco of d.blocos) relatar(JSON.stringify(bloco), await passa(d, d.codigo.replace('___', bloco)), bloco === d.solucao);
  } else if (tipo === 'duplo') {
    if (lacunas < 2) { falhar('o tipo "duplo" precisa de dois ou mais ___'); return; }
    if (!Array.isArray(d.solucao) || d.solucao.length !== lacunas) { falhar('"solucao" precisa ser uma lista com um bloco para cada ___'); return; }
    if (d.solucao.some(v => !d.blocos.includes(v))) { falhar('algum bloco da solução não está na bandeja'); return; }
    if (new Set(d.blocos).size !== d.blocos.length) { falhar('há blocos repetidos na bandeja'); return; }
    const combos = [];
    (function gerar(parcial) {
      if (parcial.length === lacunas) { combos.push(parcial); return; }
      d.blocos.forEach(b => { if (!parcial.includes(b)) gerar(parcial.concat([b])); });
    })([]);
    let certas = 0;
    for (const c of combos) {
      let i = 0; const codigo = d.codigo.replace(/___/g, () => c[i++]);
      const ok = await passa(d, codigo), esperado = JSON.stringify(c) === JSON.stringify(d.solucao);
      if (ok) certas++;
      if (ok !== esperado) falhar(JSON.stringify(c) + (esperado ? ' deveria passar e falhou' : ' deveria falhar e passou'));
    }
    if (certas === 1) console.log('  ✔ só a combinação ' + JSON.stringify(d.solucao) + ' passa (' + combos.length + ' combinações testadas)');
  } else if (tipo === 'ordenar') {
    if (typeof d.prefixo !== 'string') { falhar('o tipo "ordenar" precisa de "prefixo" (as linhas fixas do começo)'); return; }
    if (!Array.isArray(d.solucao)) { falhar('"solucao" precisa ser a lista de linhas na ordem certa'); return; }
    if (d.solucao.slice().sort().join('\n') !== d.blocos.slice().sort().join('\n')) { falhar('"blocos" e "solucao" precisam ter as mesmas linhas'); return; }
    if (d.codigo !== d.prefixo + d.solucao.join('\n') + '\n') { falhar('"codigo" precisa ser o prefixo mais a solução'); return; }
    if (JSON.stringify(d.blocos) === JSON.stringify(d.solucao)) falhar('as linhas já vêm na ordem certa');
    relatar('ordem certa', await passa(d, d.codigo), true);
    relatar('ordem embaralhada do começo', await passa(d, d.prefixo + d.blocos.join('\n') + '\n'), false);
    for (let i = 0; i < d.solucao.length - 1; i++) {
      const t = d.solucao.slice(); [t[i], t[i + 1]] = [t[i + 1], t[i]];
      relatar('trocar as linhas ' + (i + 1) + ' e ' + (i + 2), await passa(d, d.prefixo + t.join('\n') + '\n'), false);
    }
  } else {
    if (lacunas) { falhar('o tipo "prever" não usa ___'); return; }
    if (!d.blocos.includes(d.solucao)) { falhar('a resposta certa não está entre as opções'); return; }
    if (new Set(d.blocos).size !== d.blocos.length) { falhar('há opções repetidas'); return; }
    let real;
    try { real = (await FC.python.rodar(d.codigo)).saida.replace(/\r/g, '').trim(); } catch (err) { falhar('o código do desafio não roda: ' + err); return; }
    for (const b of d.blocos) relatar(JSON.stringify(b.replace(/\n/g, ' / ')), b === real, b === d.solucao);
  }
}

async function testarDesafio(id, d) {
  d.nome = d.nome || id;
  await testarVersao(id, d);
  if (!d.topico) falhar(id + ': falta o campo "topico" (usado no resumo do fim do mundo)');
  if (d.narrador) {
    const n = d.narrador;
    if (!n.fala || !n.pergunta || !n.explicacao || !Array.isArray(n.opcoes) || n.opcoes.length < 3 || !(n.certa >= 0 && n.certa < n.opcoes.length) || !['cuca', 'tiao'].includes(n.quem)) falhar(id + ': campo "narrador" incompleto (fala, pergunta, opcoes com 3+ itens, certa, explicacao, quem)');
  }
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
