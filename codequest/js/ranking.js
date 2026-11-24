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

  function desenhar() {
    const eu = FC.jogador.atual();
    filtroRotulo.hidden = !(eu && eu.turma);
    if (filtroRotulo.hidden) filtro.checked = false;
    if (eu && eu.turma) filtroRotulo.querySelector('span').textContent = 'Só a turma ' + eu.turma;
    Array.from(abas.children).forEach(b => b.setAttribute('aria-selected', String(b.dataset.mundo === mundoAtual)));
    const linhas = lista(mundoAtual, filtro.checked && eu ? eu.turma : '');
    tabela.innerHTML = '';
    vazio.hidden = linhas.length > 0;
    tabelaEl.hidden = linhas.length === 0;
    const mostrar = linhas.slice(0, 10);
    const minha = eu ? linhas.findIndex(r => mesmo(r.nome, eu.nome)) : -1;
    if (minha >= 10) mostrar.push(linhas[minha]);
    mostrar.forEach(r => {
      const pos = linhas.indexOf(r) + 1;
      const tr = document.createElement('tr');
      if (eu && mesmo(r.nome, eu.nome)) tr.className = 'eu';
      [pos + 'º', r.nome + (r.turma ? ' (' + r.turma + ')' : '') + (eu && mesmo(r.nome, eu.nome) ? ' (você)' : ''), String(r.pontos), formatarTempo(r.segundos)].forEach((txt, i) => {
        const td = document.createElement('td');
        td.textContent = txt; if (i === 0) td.className = 'pos'; if (i >= 2) td.className = 'num';
        tr.appendChild(td);
      });
      tabela.appendChild(tr);
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
      const novo = { nome: eu.nome, turma: eu.turma || '', mundo: d.mundo, pontos: d.pontos, segundos: d.segundos, tentativas: d.tentativas, quando: Date.now() };
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
