/* Página #mundos: um mapa ilustrado. Cada mundo é um lugar (restaurante, prisão...) ligado ao próximo por uma estrada.
   O jogador aparece num carrinho: clique num lugar e ele vai até lá; ao concluir um mundo, ele segue sozinho pela estrada até o próximo.
   Para um mundo novo aparecer no mapa, basta registrá-lo (FC.registrarMundo): o lugar é desenhado por FC.LUGARES[id] ou por um desenho padrão. */
window.FC = window.FC || {};

(function () {
  const NS = 'http://www.w3.org/2000/svg';
  const $ = id => document.getElementById(id);
  const A = FC.armazenamento;
  const L = 320, H = 140;                                   // tamanho do mapa em "pixels" do desenho
  const reduzir = () => window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Canvas com o personagem do mundo em pixel art (usado no painel de informações). */
  FC.previa = function (m, escala, equip) {
    const c = document.createElement('canvas');
    c.width = 40 * escala; c.height = 46 * escala; c.className = 'previa';
    const g = c.getContext('2d');
    g.imageSmoothingEnabled = false;
    g.scale(escala, escala);
    if (FC.PERSONAGENS[m.personagem]) FC.PERSONAGENS[m.personagem](g, { x: 13, y: 33, w: 14, h: 10 }, 0, false, 1, equip);
    return c;
  };

  const r = (x, y, w, h, c, extra) => '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + c + '"' + (extra || '') + '/>';

  /* Desenhos dos lugares, centrados em (0,0) = o chão do lugar. */
  FC.LUGARES = FC.LUGARES || {};
  FC.LUGARES.restaurante = function () {
    let ripas = '', toldo = '';
    for (let y = -35; y < -25; y += 3) ripas += r(-26 + (y % 2 ? 0 : 0), y, 52, 1, '#9a3526');
    for (let i = 0; i < 13; i++) {
      const x = -26 + i * 4, cor = i % 2 ? '#f4efe4' : '#d14a3a';
      toldo += r(x, -14, 4, 5, cor) + r(x, -9, 4, 2, cor) + r(x + (i % 2 ? 0 : 1), -7, 2, 1, cor);
    }
    const vaso = (x, cor) => r(x, 0, 6, 3, '#6b4433') + r(x + 1, -2, 1, 2, '#2d7a52') + r(x + 3, -3, 1, 3, '#2d7a52') + r(x, -2, 1, 1, cor) + r(x + 2, -3, 1, 1, cor) + r(x + 4, -2, 1, 1, cor) + r(x + 5, -1, 1, 1, cor);
    return r(-34, 4, 68, 3, '#000', ' opacity=".28"') +
      // mesa com guarda-sol, à esquerda
      r(-44, -12, 1, 14, '#5a3a24') + '<polygon points="-50,-12 -38,-12 -44,-18" fill="#e8b04a"/><polygon points="-44,-18 -38,-12 -44,-12" fill="#c98f2c"/>' + r(-47, -1, 7, 1, '#e8e2d2') + r(-44, 0, 1, 4, '#5a3a24') + r(-48, 4, 2, 0.01, '#000') +
      // paredes
      r(-24, -26, 48, 30, '#ecd9ac') + r(-24, -26, 3, 30, '#d9c28f') + r(21, -26, 3, 30, '#d9c28f') + r(-24, 0, 48, 4, '#9a6a45') +
      // telhado
      '<polygon points="-30,-26 -21,-41 21,-41 30,-26" fill="#b3402f"/><polygon points="-30,-26 -21,-41 -21,-26" fill="#c9503c"/>' + ripas + r(-22, -42, 44, 2, '#8f3022') +
      // chaminé
      r(12, -50, 7, 11, '#8a5a44') + r(11, -51, 9, 2, '#6b4433') + r(13, -46, 5, 1, '#a87050') +
      // placa
      r(-15, -25, 30, 9, '#2a1a12') + r(-14, -24, 28, 7, '#5a3a24') + r(-13, -23, 26, 5, '#3a2418') +
      r(-3, -24, 6, 1, '#fff') + r(-4, -23, 8, 2, '#fff') + r(-3, -21, 6, 1, '#e8e2d2') +
      r(-11, -22, 4, 1, '#ffd66b') + r(-10, -23, 1, 3, '#ffd66b') + r(8, -23, 1, 3, '#ffd66b') + r(7, -23, 1, 1, '#ffd66b') + r(10, -23, 1, 1, '#ffd66b') + r(9, -22, 1, 1, '#ffd66b') +
      // toldo listrado
      toldo + r(-27, -15, 54, 1, '#8f2f24') +
      // janelas acesas
      r(-21, -6, 11, 8, '#5a3a24') + r(-20, -5, 9, 6, '#ffd66b', ' class="luz"') + r(-16, -5, 1, 6, '#5a3a24') + r(-20, -2, 9, 1, '#d9a93a') +
      r(10, -6, 11, 8, '#5a3a24') + r(11, -5, 9, 6, '#ffd66b', ' class="luz"') + r(15, -5, 1, 6, '#5a3a24') + r(11, -2, 9, 1, '#d9a93a') +
      // porta
      r(-5, -8, 10, 12, '#4a2e1c') + r(-4, -9, 8, 1, '#4a2e1c') + r(-4, -7, 3, 5, '#ffd66b') + r(1, -7, 3, 5, '#ffd66b') + r(0, -8, 1, 12, '#4a2e1c') + r(2, -1, 1, 1, '#fff2b0') +
      // vasos de flores
      vaso(-22, '#ff6b8a') + vaso(16, '#ffb347') +
      // lanterna
      r(-9, -10, 1, 2, '#2a1a12') + r(-10, -8, 3, 3, '#ffd66b', ' class="luz"') + r(8, -10, 1, 2, '#2a1a12') + r(7, -8, 3, 3, '#ffd66b', ' class="luz"') +
      '<g class="fumaca"><rect x="14" y="-54" width="3" height="3" fill="#f4efe4"/><rect x="16" y="-60" width="4" height="4" fill="#f4efe4"/><rect x="13" y="-67" width="5" height="5" fill="#f4efe4"/></g>';
  };
  FC.LUGARES.prisao = function () {
    let arame = ''; for (let x = -28; x < 22; x += 4) arame += r(x, -21, 1, 3, '#9aa3ad') + r(x + 2, -22, 1, 3, '#9aa3ad');
    return r(-30, 4, 60, 3, '#000', ' opacity=".25"') +
      '<polygon class="feixe" points="22,-34 -34,6 6,6" fill="#ffd66b" opacity=".18"/>' +
      r(-28, -17, 46, 22, '#7d8590') + r(-28, -17, 46, 2, '#98a1ab') + arame +
      r(-28, -20, 6, 3, '#7d8590') + r(-18, -20, 6, 3, '#7d8590') + r(-8, -20, 6, 3, '#7d8590') + r(2, -20, 6, 3, '#7d8590') +
      r(-8, -9, 14, 14, '#2a2f38') + r(-5, -9, 1, 14, '#7d8590') + r(-1, -9, 1, 14, '#7d8590') + r(3, -9, 1, 14, '#7d8590') +
      r(-24, -11, 6, 4, '#1c2230') + r(10, -11, 6, 4, '#1c2230') +
      r(16, -36, 14, 40, '#5f6670') + r(14, -40, 18, 6, '#3a3f4a') + r(18, -38, 10, 3, '#ffd66b', ' class="lampada"') + r(16, -36, 2, 40, '#6f7882');
  };
  FC.LUGARES.padrao = function () {
    return r(-8, 4, 16, 3, '#000', ' opacity=".25"') + r(-1, -30, 2, 34, '#5a3a24') + '<polygon points="1,-30 20,-24 1,-18" fill="#e8b04a"/>';
  };

  /* ---- ilustração do mapa ---- */
  function aleatorio(semente) { let a = semente; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const el = (tag, attrs) => { const e = document.createElementNS(NS, tag); Object.keys(attrs || {}).forEach(k => e.setAttribute(k, attrs[k])); return e; };

  let nos = [], trechos = [];         // posições dos lugares e os <path> de cada trecho da estrada

  function posicoes(n) {
    return FC.MUNDOS.map((m, i) => [n === 1 ? L / 2 : Math.round(56 + (L - 112) * i / (n - 1)), i % 2 ? 50 : 98]);
  }

  function desenharMapa() {
    const svg = $('mapaSvg'); svg.innerHTML = '';
    const n = FC.MUNDOS.length; nos = posicoes(n); trechos = [];
    const rnd = aleatorio(7);
    let fundo = r(0, 0, L, H, '#2f4a3a');
    for (let i = 0; i < 320; i++) fundo += r(Math.floor(rnd() * L), Math.floor(rnd() * H), 2, 1, rnd() < .5 ? '#3a5e47' : '#274a38');
    svg.insertAdjacentHTML('beforeend', fundo);
    // estrada: um trecho curvo entre cada par de lugares
    const g = el('g'); svg.appendChild(g);
    for (let i = 0; i < n - 1; i++) {
      const [x1, y1] = nos[i], [x2, y2] = nos[i + 1];
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy) || 1, sinal = i % 2 ? 1 : -1;
      const cx = mx + (-dy / len) * 26 * sinal, cy = my + (dx / len) * 26 * sinal;
      const d = 'M' + x1 + ',' + (y1 + 2) + ' Q' + cx + ',' + cy + ' ' + x2 + ',' + (y2 + 2);
      const p = el('path', { d: d, fill: 'none', 'stroke-linecap': 'square' }); trechos.push(p);
      g.appendChild(el('path', { d: d, fill: 'none', stroke: '#5a4430', 'stroke-width': 10, 'stroke-linecap': 'square' }));
      g.appendChild(el('path', { d: d, fill: 'none', stroke: '#b89a6a', 'stroke-width': 7, 'stroke-linecap': 'square' }));
      g.appendChild(el('path', { d: d, fill: 'none', stroke: '#d8c08a', 'stroke-width': 1, 'stroke-dasharray': '3 3' }));
      svg.appendChild(p); p.setAttribute('stroke', 'none');
    }
    // cenário: lago, árvores, arbustos, flores, pedras, cercas e postes de luz
    const pontos = []; trechos.forEach(p => { const t = p.getTotalLength(); for (let s = 0; s <= t; s += 5) { const q = p.getPointAtLength(s); pontos.push([q.x, q.y]); } });
    const longeDosLugares = (x, y, d) => nos.every(q => Math.hypot(q[0] - x, (q[1] - 12) - y) > d);
    const longeDaEstrada = (x, y, d) => pontos.every(q => Math.hypot(q[0] - x, q[1] - y) > d);
    const livre = (x, y, dl, de) => longeDosLugares(x, y, dl) && longeDaEstrada(x, y, de);
    let deco = '';
    // manchas de grama mais clara e mais escura
    for (let i = 0; i < 26; i++) {
      const x = Math.floor(rnd() * (L - 30)), y = Math.floor(rnd() * (H - 14)), w = 14 + Math.floor(rnd() * 22), clara = rnd() < .55;
      deco += r(x, y, w, 7, clara ? '#37573f' : '#2a4333', ' opacity=".55"') + r(x + 3, y - 2, w - 6, 2, clara ? '#37573f' : '#2a4333', ' opacity=".55"') + r(x + 3, y + 7, w - 6, 2, clara ? '#37573f' : '#2a4333', ' opacity=".55"');
    }
    // lago com margem e brilho
    const lx = L / 2 + 4, ly = 118;
    if (livre(lx, ly, 40, 16)) {
      deco += r(lx - 22, ly - 8, 44, 16, '#c9b68a') + r(lx - 18, ly - 12, 36, 24, '#c9b68a') +
        r(lx - 20, ly - 6, 40, 12, '#3f7fb8') + r(lx - 16, ly - 10, 32, 20, '#3f7fb8') + r(lx - 12, ly - 8, 24, 16, '#5a9bd0') +
        r(lx - 8, ly - 4, 7, 1, '#cfe6f7') + r(lx + 2, ly + 2, 8, 1, '#cfe6f7') + r(lx - 14, ly + 4, 4, 1, '#cfe6f7') +
        r(lx + 14, ly - 12, 1, 6, '#3d7a4a') + r(lx + 16, ly - 14, 1, 8, '#3d7a4a') + r(lx + 18, ly - 11, 1, 5, '#3d7a4a') + r(lx + 15, ly - 15, 3, 2, '#7a5236');
    }
    // flores e tufos
    for (let i = 0, f = 0; i < 400 && f < 60; i++) {
      const x = 4 + Math.floor(rnd() * (L - 8)), y = 6 + Math.floor(rnd() * (H - 10));
      if (!livre(x, y, 22, 8) || (Math.abs(x - lx) < 26 && Math.abs(y - ly) < 16)) continue;
      const cor = ['#ff8fa3', '#ffd66b', '#f4efe4', '#a98bff'][Math.floor(rnd() * 4)];
      deco += r(x, y + 1, 1, 2, '#244e33') + r(x - 1, y, 3, 1, cor) + r(x, y - 1, 1, 1, '#ffd66b'); f++;
    }
    // pedras
    for (let i = 0, f = 0; i < 200 && f < 8; i++) {
      const x = 6 + Math.floor(rnd() * (L - 14)), y = 8 + Math.floor(rnd() * (H - 16));
      if (!livre(x, y, 26, 10) || (Math.abs(x - lx) < 28 && Math.abs(y - ly) < 18)) continue;
      deco += r(x, y + 3, 7, 1, '#000', ' opacity=".25"') + r(x, y, 7, 3, '#8d949c') + r(x + 1, y - 1, 5, 1, '#aab1b8') + r(x + 1, y + 1, 2, 1, '#6e757d'); f++;
    }
    // árvores: pinheiros e carvalhos, ordenadas por y para a de baixo ficar na frente
    const arvores = [];
    for (let i = 0; i < 500 && arvores.length < 22; i++) {
      const x = 8 + Math.floor(rnd() * (L - 20)), y = 16 + Math.floor(rnd() * (H - 22));
      if (!livre(x, y, 34, 13) || (Math.abs(x - lx) < 30 && Math.abs(y - ly) < 20) || arvores.some(q => Math.hypot(q[0] - x, q[1] - y) < 12)) continue;
      arvores.push([x, y, rnd() < .5]);
    }
    arvores.sort((m, n) => m[1] - n[1]).forEach(([x, y, pinheiro]) => {
      deco += r(x - 2, y + 7, 12, 2, '#000', ' opacity=".25"');
      if (pinheiro) deco += r(x + 3, y + 4, 2, 4, '#5a3a24') + r(x, y + 2, 8, 3, '#1b5239') + r(x + 1, y - 1, 6, 3, '#236346') + r(x + 2, y - 4, 4, 3, '#2d7a52') + r(x + 3, y - 6, 2, 2, '#3a9363');
      else deco += r(x + 3, y + 3, 2, 5, '#6b4433') + r(x - 1, y - 2, 10, 6, '#2f7a3f') + r(x + 1, y - 4, 6, 3, '#3a9150') + r(x, y - 2, 3, 2, '#4fae63') + r(x + 5, y, 4, 3, '#256633');
    });
    // arbustos
    for (let i = 0, f = 0; i < 300 && f < 10; i++) {
      const x = 6 + Math.floor(rnd() * (L - 16)), y = 10 + Math.floor(rnd() * (H - 16));
      if (!livre(x, y, 26, 9) || (Math.abs(x - lx) < 28 && Math.abs(y - ly) < 18)) continue;
      deco += r(x - 1, y + 4, 9, 1, '#000', ' opacity=".25"') + r(x, y, 7, 4, '#2c7040') + r(x + 1, y - 1, 5, 1, '#3a9150') + r(x + 5, y + 1, 1, 1, '#ff8fa3') + r(x + 2, y + 2, 1, 1, '#ff8fa3'); f++;
    }
    // postes de luz ao longo da estrada e cerquinhas
    trechos.forEach((p, k) => {
      const t = p.getTotalLength();
      [.25, .5, .75].forEach((f, j) => {
        const q = p.getPointAtLength(t * f), lado = (j + k) % 2 ? 1 : -1, x = Math.round(q.x), y = Math.round(q.y) + lado * 9;
        if (j === 1) deco += r(x - 3, y + 2, 7, 1, '#000', ' opacity=".25"') + r(x, y - 9, 1, 11, '#3a3f4a') + r(x - 1, y - 12, 3, 3, '#ffd66b', ' class="luz"') + r(x - 2, y - 13, 5, 1, '#3a3f4a');
        else for (let d = -5; d <= 5; d += 5) deco += r(x + d, y - 3, 1, 4, '#8a5a33') + r(x + d - 2, y - 2, 6, 1, '#a87443');
      });
    });
    svg.insertAdjacentHTML('beforeend', deco);
    // os lugares
    FC.MUNDOS.forEach((m, i) => {
      const grupo = el('g', { transform: 'translate(' + nos[i][0] + ' ' + nos[i][1] + ')', 'data-mundo': m.id, class: 'lugar' });
      grupo.innerHTML = (FC.LUGARES[m.id] || FC.LUGARES.padrao)();
      svg.appendChild(grupo);
    });
  }

  /* ---- jogador no carrinho ---- */
  const chaveLugar = () => 'mapa-lugar:' + (FC.jogador.atual() ? FC.jogador.atual().nome.toLocaleLowerCase('pt-BR') : '(visitante)');
  let lugar = 0, selecionado = 0, andando = false;

  /* O jogador anda pelo mapa em pé: cabeça = o avatar escolhido, com um corpinho em pixel art por baixo. */
  function montarViajante() {
    const v = $('viajante'); v.innerHTML = '';
    const eu = FC.jogador.atual(), id = eu ? eu.avatar : FC.avatares.padrao;
    const av = FC.avatares.lista.find(x => x.id === id) || FC.avatares.lista[0];
    const camisa = av.bg, calca = '#2c3350';
    const corpo = '<svg class="corpo" viewBox="0 0 12 10" shape-rendering="crispEdges" aria-hidden="true">' +
      '<rect x="1" y="0" width="2" height="5" fill="' + camisa + '"/><rect x="9" y="0" width="2" height="5" fill="' + camisa + '"/><rect x="1" y="5" width="2" height="1" fill="#e8b48a"/><rect x="9" y="5" width="2" height="1" fill="#e8b48a"/>' +
      '<rect x="3" y="0" width="6" height="6" fill="' + camisa + '"/><rect x="3" y="0" width="6" height="1" fill="#000" opacity=".2"/>' +
      '<g class="perna a"><rect x="3" y="6" width="3" height="3" fill="' + calca + '"/><rect x="3" y="9" width="3" height="1" fill="#14101f"/></g>' +
      '<g class="perna b"><rect x="6" y="6" width="3" height="3" fill="' + calca + '"/><rect x="6" y="9" width="3" height="1" fill="#14101f"/></g></svg>';
    v.insertAdjacentHTML('beforeend', '<span class="sombra"></span><span class="poeira"></span>');
    const fig = document.createElement('div'); fig.className = 'figura';
    const cv = FC.avatares.canvas(id, 48, eu ? FC.carteira.equipDe(eu.nome) : null, true); cv.className = 'avatar viaj-avatar';
    fig.appendChild(cv); fig.insertAdjacentHTML('beforeend', corpo);
    v.appendChild(fig);
  }

  function pontoNoTrecho(i, t) { const p = trechos[i], q = p.getPointAtLength(p.getTotalLength() * (.2 + .6 * t)); return [q.x, q.y]; }   // o carrinho para ao lado do lugar, na estrada
  let pos = [0, 0], livre = false, perto = -1;   // posição do personagem (em pixels do desenho do mapa); livre = andou com o teclado; perto = índice do lugar ao alcance
  function colocar(x, y) {
    pos = [x, y];
    const v = $('viajante'); v.style.left = (x / L * 100) + '%'; v.style.top = ((y - 2) / H * 100) + '%';
    const d = $('mapaDica'); if (d) { d.style.left = (x / L * 100) + '%'; d.style.top = ((y - 2) / H * 100) + '%'; }
  }
  function colocarNoLugar(i) { if (!trechos.length) colocar(nos[i][0], nos[i][1] + 6); else { const [x, y] = i < trechos.length ? pontoNoTrecho(i, 0) : pontoNoTrecho(i - 1, 1); colocar(x, y + 2); } }

  /* Anda pela estrada do lugar `de` até o lugar `para` (passando pelos lugares do meio), devolve uma Promise. */
  function viajar(de, para) {
    if (de === para) return Promise.resolve();
    const v = $('viajante'), passo = de < para ? 1 : -1, etapas = [];
    for (let i = de; i !== para; i += passo) etapas.push(passo > 0 ? [i, false] : [i - 1, true]);
    andando = true; v.classList.add('andando');
    return etapas.reduce((anterior, [trecho, volta]) => anterior.then(() => new Promise(fim => {
      const dur = reduzir() ? 900 : 1500, ini = performance.now();
      (function quadro(agora) {
        const t = Math.min(1, (agora - ini) / dur), e = t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        const [x, y] = pontoNoTrecho(trecho, volta ? 1 - e : e);
        const [x2, y2] = pontoNoTrecho(trecho, volta ? Math.max(0, 1 - e - .02) : Math.min(1, e + .02));
        v.classList.toggle('esquerda', x2 < x - .01);
        colocar(x, y);
        if (t < 1) requestAnimationFrame(quadro); else fim();
      })(ini);
    })), Promise.resolve()).then(() => { andando = false; v.classList.remove('andando'); lugar = para; A.gravar(chaveLugar(), para); });
  }

  /* ---- lugares clicáveis e painel de informações ---- */
  function desenharNos() {
    const ul = $('mapaNos'); ul.innerHTML = '';
    FC.MUNDOS.forEach((m, i) => {
      const livre = FC.progresso.desbloqueado(m.id), feito = FC.progresso.concluido(m.id);
      const li = document.createElement('li');
      li.style.left = (nos[i][0] / L * 100) + '%'; li.style.top = (nos[i][1] / H * 100) + '%';
      li.style.setProperty('--cor', m.cor);
      const b = document.createElement('button'); b.type = 'button';
      b.className = 'no' + (livre ? '' : ' bloqueado') + (feito ? ' concluido' : '') + (i === selecionado ? ' selecionado' : '');
      b.dataset.i = i;
      b.setAttribute('aria-label', m.nome + ': ' + (feito ? 'concluído' : livre ? 'disponível' : 'bloqueado'));
      b.innerHTML = '<span class="rotulo"></span><span class="estado"></span>';
      b.querySelector('.rotulo').textContent = m.nome;
      b.querySelector('.estado').textContent = feito ? 'Concluído' : livre ? 'Disponível' : 'Bloqueado';
      b.addEventListener('click', () => clicar(i));
      li.appendChild(b); ul.appendChild(li);
      const g = $('mapaSvg').querySelector('[data-mundo="' + m.id + '"]'); if (g) g.setAttribute('class', 'lugar' + (livre ? '' : ' trancado'));
    });
  }

  function desenharInfo() {
    const m = FC.MUNDOS[selecionado], box = $('mundoInfo'); box.innerHTML = '';
    const livre = FC.progresso.desbloqueado(m.id), feito = FC.progresso.concluido(m.id);
    box.style.setProperty('--cor', m.cor);
    const prev = FC.previa(m, 2); if (!livre) prev.classList.add('trancada'); box.appendChild(prev);
    const txt = document.createElement('div'); txt.className = 'info-txt';
    const salas = FC.salasDoMundo(m.id), anterior = FC.MUNDOS[selecionado - 1];
    txt.innerHTML = '<h2></h2><p class="assunto"></p><p class="desc"></p><p class="status"></p>';
    txt.children[0].textContent = m.nome;
    txt.children[1].textContent = 'Assunto: ' + m.assunto;
    txt.children[2].textContent = m.descricao + ' (' + salas.length + ' áreas, ' + salas.reduce((n, s) => n + s.estacoes.length, 0) + ' desafios)';
    const eu = FC.jogador.atual(), pts = eu ? FC.ranking.melhorDe(eu.nome, m.id) : null;
    txt.children[3].textContent = feito ? 'Concluído' + (pts !== null ? ', melhor pontuação: ' + pts : '') : livre ? 'Disponível' : 'Bloqueado: conclua "' + anterior.nome + '" para abrir a estrada.';
    const b = document.createElement('button'); b.className = 'jogar'; b.id = 'mundoJogar';
    b.textContent = feito ? 'Jogar de novo' : 'Jogar'; b.disabled = !livre || andando;
    b.addEventListener('click', () => { if (livre && !andando) FC.jogo.jogar(m.id); });
    txt.appendChild(b); box.appendChild(txt);
  }

  /* Anda em linha reta da posição atual até (x, y). */
  function caminharReto(alvo) {
    const v = $('viajante'), de = pos.slice(), dist = Math.hypot(alvo[0] - de[0], alvo[1] - de[1]), dur = Math.max(300, dist / (reduzir() ? 110 : 75) * 1000);
    andando = true; v.classList.add('andando'); v.classList.toggle('esquerda', alvo[0] < de[0] - .01); atualizarDica();
    return new Promise(fim => {
      const ini = performance.now();
      (function quadro(agora) {
        const t = Math.min(1, (agora - ini) / dur);
        colocar(de[0] + (alvo[0] - de[0]) * t, de[1] + (alvo[1] - de[1]) * t);
        if (t < 1) requestAnimationFrame(quadro); else { andando = false; v.classList.remove('andando'); fim(); }
      })(ini);
    });
  }

  function clicar(i) {
    if (andando) return;
    const m = FC.MUNDOS[i];
    if (i === lugar && FC.progresso.desbloqueado(m.id)) { selecionado = i; FC.jogo.jogar(m.id); return; }   // já está lá: entra
    selecionado = i; desenharNos(); desenharInfo();
    if (!FC.progresso.desbloqueado(m.id)) { const g = $('mapaSvg').querySelector('[data-mundo="' + m.id + '"]'); if (g) { g.classList.remove('treme'); void g.getBoundingClientRect(); g.classList.add('treme'); } return; }
    (livre ? caminharReto(alvoDoLugar(i)).then(() => { lugar = i; }) : viajar(lugar, i)).then(() => { livre = false; perto = i; atualizarDica(); desenharNos(); desenharInfo(); const j = $('mundoJogar'); if (j && !j.disabled) j.focus({ preventScroll: true }); });   // um clique em outro lugar: o personagem anda até lá e para; clique de novo (ou em Jogar) para entrar
  }

  /* Ao abrir o mapa: o carrinho aparece onde o jogador parou e, se um mundo novo foi aberto, segue sozinho até ele. */
  FC.paginas.aoEntrar('mundos', () => {
    desenharMapa(); montarViajante(); livre = false; perto = -1; iniciarLoop();
    const n = FC.MUNDOS.length;
    let alvo = FC.MUNDOS.findIndex(m => FC.progresso.desbloqueado(m.id) && !FC.progresso.concluido(m.id));
    if (alvo < 0) alvo = n - 1;
    const salvo = A.ler(chaveLugar(), 0);
    lugar = Math.min(Math.max(0, +salvo || 0), n - 1);
    selecionado = alvo; andando = false;
    colocarNoLugar(lugar); desenharNos(); desenharInfo();
    if (lugar !== alvo) { setTimeout(() => { viajar(lugar, alvo).then(() => { desenharNos(); desenharInfo(); const j = $('mundoJogar'); if (j && !j.disabled) j.focus({ preventScroll: true }); }); desenharInfo(); }, 700); }
    else { const j = $('mundoJogar'); if (j && !j.disabled) j.focus({ preventScroll: true }); }
  });
  /* Troca só o avatar do carrinho e o desenho do painel (depois de comprar ou vestir algo na loja). */
  FC.mapa = { atualizar() { if (!$('viajante').firstChild) return; const x = $('viajante').style.left, y = $('viajante').style.top; montarViajante(); $('viajante').style.left = x; $('viajante').style.top = y; desenharInfo(); } };
  /* ---- andar com WASD / setas ---- */
  const teclas = {}, VEL = 62;                         // pixels do mapa por segundo
  const alvoDoLugar = i => (!trechos.length ? [nos[i][0], nos[i][1] + 8] : (() => { const [x, y] = i < trechos.length ? pontoNoTrecho(i, 0) : pontoNoTrecho(i - 1, 1); return [x, y + 2]; })());
  const modalAberto = () => !!document.querySelector('.modal:not([hidden])');
  const tipoTecla = ev => ({ w: 'c', ArrowUp: 'c', s: 'b', ArrowDown: 'b', a: 'e', ArrowLeft: 'e', d: 'd', ArrowRight: 'd' })[ev.key.length === 1 ? ev.key.toLowerCase() : ev.key];

  function lugarAoAlcance() {
    let melhor = -1, dmin = 1;
    nos.forEach((n, i) => { const d = Math.hypot((pos[0] - n[0]) / 52, (pos[1] - (n[1] + 6)) / 30); if (d < dmin) { dmin = d; melhor = i; } });
    return melhor;
  }
  function atualizarDica() {
    const d = $('mapaDica'); if (!d) return;
    if (perto < 0 || andando) { d.hidden = true; return; }
    const livreMundo = FC.progresso.desbloqueado(FC.MUNDOS[perto].id);
    d.textContent = livreMundo ? 'Aperte E para entrar' : 'Bloqueado: conclua o mundo anterior';
    d.className = 'mapa-dica' + (livreMundo ? '' : ' bloqueada'); d.hidden = false;
  }
  function checarAlcance() {
    const i = lugarAoAlcance();
    if (i === perto) return;
    perto = i;
    if (i >= 0) { lugar = i; selecionado = i; desenharNos(); desenharInfo(); }
    atualizarDica();
  }

  let ultimo = 0, rodando = false;
  function passo(agora) {
    if (FC.paginas.atual() !== 'mundos') { rodando = false; return; }
    const dt = Math.min(.05, (agora - ultimo) / 1000); ultimo = agora;
    const v = $('viajante');
    let dx = (teclas.d ? 1 : 0) - (teclas.e ? 1 : 0), dy = (teclas.b ? 1 : 0) - (teclas.c ? 1 : 0);
    if ((dx || dy) && !andando && !modalAberto()) {
      const n = Math.hypot(dx, dy); dx /= n; dy /= n;
      colocar(Math.min(L - 6, Math.max(6, pos[0] + dx * VEL * dt)), Math.min(H - 4, Math.max(26, pos[1] + dy * VEL * dt * .8)));
      livre = true;
      if (dx) v.classList.toggle('esquerda', dx < 0);
      v.classList.add('andando'); v.dataset.tecla = '1';
      checarAlcance();
    } else { if (v.dataset.tecla) { v.classList.remove('andando'); delete v.dataset.tecla; } if (!andando) checarAlcance(); }
    requestAnimationFrame(passo);
  }
  function iniciarLoop() { if (rodando) return; rodando = true; ultimo = performance.now(); requestAnimationFrame(passo); }

  document.addEventListener('keydown', ev => {
    if (FC.paginas.atual() !== 'mundos' || ev.altKey || ev.ctrlKey || ev.metaKey || modalAberto()) return;
    const t = tipoTecla(ev);
    if (t) { teclas[t] = true; ev.preventDefault(); return; }
    const tag = (document.activeElement && document.activeElement.tagName) || '';
    if ((ev.key === 'e' || ev.key === 'E' || (ev.key === 'Enter' && tag !== 'BUTTON')) && perto >= 0 && !andando) { ev.preventDefault(); clicar(perto); }
  });
  document.addEventListener('keyup', ev => { const t = tipoTecla(ev); if (t) teclas[t] = false; });
  window.addEventListener('blur', () => { Object.keys(teclas).forEach(k => { teclas[k] = false; }); });

  $('mundosRanking').addEventListener('click', () => FC.ranking.abrir());
  $('mundosTrocar').addEventListener('click', () => FC.paginas.ir('entrar'));
})();
