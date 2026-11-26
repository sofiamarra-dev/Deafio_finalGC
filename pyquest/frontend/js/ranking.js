/* Ranking: a melhor pontuação de cada jogador em cada mundo. Guardado pelo FC.armazenamento. */
window.FC = window.FC || {};

(function () {
  const A = FC.armazenamento;
  const $ = id => document.getElementById(id);
  const modal = $('ranking'), abas = $('rankAbas'), tabela = $('rankCorpo'), vazio = $('rankVazio'), filtro = $('rankTurma'),
        filtroRotulo = $('rankTurmaRotulo'), fechar = $('rankFechar'), tabelaEl = $('rankTabela');
  let mundoAtual = null;

  const todos = () => A.ler('ranking', []);
  const melhor = (a, b) => b.pontos - a.pontos || a.segundos - b.segundos || a.quando - b.quando;
  const mesmo = (a, b) => a.toLocaleLowerCase('pt-BR') === b.toLocaleLowerCase('pt-BR');

  function lista(mundo, turma) {
    return todos().filter(r => r.mundo === mundo && (!turma || r.turma === turma)).sort(melhor);
  }

  function formatarTempo(seg) { return Math.floor(seg / 60) + ':' + String(seg % 60).padStart(2, '0'); }

  /* Caixa "perto de você": sua posição, quem está logo à frente e logo atrás (na turma, se você tiver uma). */
  function perto(eu) {
    const caixa = $('rankPerto'); caixa.innerHTML = ''; caixa.hidden = true;
    if (!eu) return;
    const geral = lista(mundoAtual, ''), turma = eu.turma ? lista(mundoAtual, eu.turma) : null;
    const base = turma || geral, i = base.findIndex(r => mesmo(r.nome, eu.nome));
    const linha = (cls, txt, r) => {
      const p = document.createElement('p'); p.className = cls;
      if (r) p.appendChild(FC.avatares.canvas(r.avatar, 24, FC.carteira.equipDe(r.nome)));
      p.appendChild(document.createTextNode(txt)); caixa.appendChild(p);
    };
    const t = document.createElement('h3'); t.textContent = turma ? 'Perto de você na turma ' + eu.turma : 'Perto de você'; caixa.appendChild(t);
    if (i < 0) {
      if (!base.length) return;
      linha('aviso', 'Termine este mundo para entrar no ranking. Quem lidera' + (turma ? ' a sua turma' : '') + ' tem ' + base[0].pontos + ' pontos.', null);
      caixa.hidden = false; return;
    }
    const pos = geral.findIndex(r => mesmo(r.nome, eu.nome)) + 1;
    linha('posicao', 'Você está em ' + (i + 1) + 'º' + (turma ? ' na turma e ' + pos + 'º no geral' : '') + ', com ' + base[i].pontos + ' pontos.', null);
    const acima = base[i - 1], abaixo = base[i + 1];
    if (acima) linha('acima', acima.nome + ' está ' + (acima.pontos - base[i].pontos) + ' pontos à frente' + (acima.pontos === base[i].pontos ? ' (empate: ganha no tempo)' : '') + '.', acima); else linha('lider', 'Você lidera' + (turma ? ' a sua turma' : '') + '!', null);
    if (abaixo) linha('abaixo', abaixo.nome + ' vem logo atrás, ' + (base[i].pontos - abaixo.pontos) + ' pontos abaixo.', abaixo);
    caixa.hidden = false;
  }

  function desenhar() {
    const eu = FC.jogador.atual();
    filtroRotulo.hidden = !(eu && eu.turma);
    if (filtroRotulo.hidden) filtro.checked = false;
    if (eu && eu.turma) filtroRotulo.querySelector('span').textContent = 'Só a turma ' + eu.turma;
    perto(eu);
    Array.from(abas.children).forEach(b => b.setAttribute('aria-selected', String(b.dataset.mundo === mundoAtual)));
    const linhas = lista(mundoAtual, filtro.checked && eu ? eu.turma : '');
    tabela.innerHTML = '';
    vazio.hidden = linhas.length > 0;
    podio(linhas, eu);
    const resto = linhas.slice(3, 10);
    const minha = eu ? linhas.findIndex(r => mesmo(r.nome, eu.nome)) : -1;
    if (minha >= 10) resto.push(linhas[minha]);
    tabelaEl.hidden = resto.length === 0;
    resto.forEach(r => {
      const pos = linhas.indexOf(r) + 1;
      const tr = document.createElement('tr');
      const ehEu = eu && mesmo(r.nome, eu.nome);
      if (ehEu) tr.className = 'eu';
      [pos + 'º', r.nome + (r.turma ? ' (' + r.turma + ')' : '') + (ehEu ? ' (você)' : ''), String(r.pontos), formatarTempo(r.segundos)].forEach((txt, i) => {
        const td = document.createElement('td');
        if (i === 1) { td.className = 'quem'; td.appendChild(FC.avatares.canvas(r.avatar, 36, FC.carteira.equipDe(r.nome))); td.appendChild(document.createTextNode(txt)); }
        else { td.textContent = txt; if (i === 0) td.className = 'pos'; if (i >= 2) td.className = 'num'; if (i === 2) { const m = document.createElement('i'); m.className = 'moeda'; m.setAttribute('aria-hidden', 'true'); td.insertBefore(m, td.firstChild); td.insertBefore(document.createTextNode(' '), td.childNodes[1]); } }
        tr.appendChild(td);
      });
      tabela.appendChild(tr);
    });
  }

  /* Pódio dos três primeiros: o 1º no meio e mais alto. */
  function podio(linhas, eu) {
    const ol = $('rankPodio'); ol.innerHTML = ''; ol.hidden = linhas.length === 0;
    [1, 0, 2].forEach(i => {
      const r = linhas[i]; if (!r) return;
      const li = document.createElement('li'); li.className = 'p' + (i + 1) + (eu && mesmo(r.nome, eu.nome) ? ' eu' : '');
      const av = FC.avatares.canvas(r.avatar, i === 0 ? 72 : 60, FC.carteira.equipDe(r.nome)); av.classList.add('podio-av');
      const nome = document.createElement('span'); nome.className = 'podio-nome'; nome.textContent = r.nome + (eu && mesmo(r.nome, eu.nome) ? ' (você)' : '');
      const sub = document.createElement('span'); sub.className = 'podio-sub'; sub.textContent = r.turma ? 'Turma ' + r.turma : 'Sem turma';
      const pts = document.createElement('span'); pts.className = 'podio-pts'; pts.innerHTML = '<i class="moeda" aria-hidden="true"></i> '; pts.append(document.createTextNode(r.pontos + ' · ' + formatarTempo(r.segundos)));
      const base = document.createElement('span'); base.className = 'podio-base'; base.textContent = (i + 1) + 'º';
      li.append(av, nome, sub, pts, base); ol.appendChild(li);
    });
  }

  FC.ranking = {
    aberto: false,
    /* Guarda o resultado de um mundo concluído. Só vale a melhor pontuação de cada jogador.
       Devolve { posicao, total, melhorou } ou null se ninguém estiver logado. */
    registrar(d) {
      const eu = FC.jogador.atual();
      if (!eu) return null;
      const todosOs = todos();
      const antigo = todosOs.find(r => r.mundo === d.mundo && mesmo(r.nome, eu.nome));
      const novo = { nome: eu.nome, turma: eu.turma || '', avatar: eu.avatar, mundo: d.mundo, pontos: d.pontos, segundos: d.segundos, tentativas: d.tentativas, quando: Date.now() };
      let melhorou = false;
      if (!antigo) { todosOs.push(novo); melhorou = true; }
      else if (melhor(novo, antigo) < 0) { Object.assign(antigo, novo); melhorou = true; }
      A.gravar('ranking', todosOs);
      const linhas = lista(d.mundo, '');
      return { posicao: linhas.findIndex(r => mesmo(r.nome, eu.nome)) + 1, total: linhas.length, melhorou: melhorou };
    },
    melhorDe(nome, mundo) {
      const r = todos().find(x => x.mundo === mundo && mesmo(x.nome, nome));
      return r ? r.pontos : null;
    },
    abrir(mundoId) {
      mundoAtual = mundoId || mundoAtual || FC.MUNDOS[0].id;
      abas.innerHTML = '';
      FC.MUNDOS.forEach(m => {
        const b = document.createElement('button');
        b.type = 'button'; b.setAttribute('role', 'tab'); b.dataset.mundo = m.id; b.textContent = m.nome;
        b.addEventListener('click', () => { mundoAtual = m.id; desenhar(); });
        abas.appendChild(b);
      });
      desenhar();
      modal.hidden = false; this.aberto = true;
      fechar.focus();
    },
    fechar() { modal.hidden = true; this.aberto = false; }
  };
  fechar.addEventListener('click', () => FC.ranking.fechar());
  filtro.addEventListener('change', desenhar);
  modal.addEventListener('keydown', ev => { if (ev.key === 'Escape') FC.ranking.fechar(); });
})();
