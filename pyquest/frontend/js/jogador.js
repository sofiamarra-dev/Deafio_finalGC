/* "Login": quem está jogando. Não tem senha, o nome só identifica o aluno neste navegador
   (serve para o ranking e para guardar o progresso de cada um). A tela fica em #entrar (veja js/paginas.js). */
window.FC = window.FC || {};

(function () {
  const A = FC.armazenamento;
  const $ = id => document.getElementById(id);
  const lista = $('jogadores'), continuar = $('continuar'), form = $('loginForm'), campoNome = $('loginNome'),
        campoTurma = $('loginTurma'), avatares = $('loginAvatares'), erro = $('loginErro'), visitante = $('loginVisitante');
  let atual = A.ler('jogador-atual', null);   // { nome, turma, avatar } ou null
  if (atual && !FC.avatares.existe(atual.avatar)) atual.avatar = FC.avatares.padrao;
  let comoVisitante = false;
  const ouvintes = [];

  const jogadores = () => A.ler('jogadores', []);
  const igual = (a, b) => a.toLocaleLowerCase('pt-BR') === b.toLocaleLowerCase('pt-BR');
  const avisar = () => ouvintes.forEach(f => f(atual));

  function definir(j) {
    atual = j;
    if (j) comoVisitante = false;
    A.gravar('jogador-atual', j);
    avisar();
  }

  /* Devolve uma mensagem de erro, ou null se entrou. */
  function entrar(nome, turma, avatar) {
    nome = nome.trim().replace(/\s+/g, ' '); turma = (turma || '').trim();
    if (nome.length < 2 || nome.length > 16) return 'O nome precisa ter de 2 a 16 letras ou números.';
    if (!/^[\p{L}\p{N} ._-]+$/u.test(nome)) return 'Use só letras, números, espaço, ponto, hífen ou sublinhado no nome.';
    if (turma.length > 12) return 'A turma pode ter no máximo 12 caracteres.';
    const todos = jogadores();
    let j = todos.find(x => igual(x.nome, nome));
    if (j) { if (turma) j.turma = turma; } else { j = { nome: nome, turma: turma }; todos.push(j); }
    if (FC.avatares.existe(avatar)) j.avatar = avatar;
    if (!FC.avatares.existe(j.avatar)) j.avatar = FC.avatares.padrao;
    A.gravar('jogadores', todos);
    definir({ nome: j.nome, turma: j.turma || '', avatar: j.avatar });
    return null;
  }

  function desenharLista() {
    lista.innerHTML = '';
    jogadores().forEach(j => {
      const li = document.createElement('li');
      const b = document.createElement('button');
      b.type = 'button';
      b.appendChild(FC.avatares.canvas(j.avatar, 24, FC.carteira.equipDe(j.nome)));
      b.appendChild(document.createTextNode(' ' + j.nome + (j.turma ? ' (' + j.turma + ')' : '')));
      b.addEventListener('click', () => { entrar(j.nome, j.turma, j.avatar); FC.paginas.ir('mundos'); });
      li.appendChild(b); lista.appendChild(li);
    });
    continuar.hidden = !lista.children.length;
  }

  /* Monta a fileira de avatares (um botão de rádio com a figurinha dentro). */
  function montarAvatares() {
    FC.avatares.lista.forEach(a => {
      const rot = document.createElement('label'); rot.className = 'av'; rot.title = a.nome;
      const r = document.createElement('input'); r.type = 'radio'; r.name = 'avatar'; r.value = a.id;
      const nome = document.createElement('span'); nome.className = 'sr'; nome.textContent = a.nome;
      rot.append(r, FC.avatares.canvas(a.id, 48), nome); avatares.appendChild(rot);
    });
  }
  function escolherAvatar(id) {
    const r = avatares.querySelector('input[value="' + (FC.avatares.existe(id) ? id : FC.avatares.padrao) + '"]');
    if (r) r.checked = true;
  }
  const avatarEscolhido = () => { const r = avatares.querySelector('input:checked'); return r ? r.value : FC.avatares.padrao; };
  montarAvatares();

  FC.jogador = {
    atual() { return atual; },
    /* Já disse quem é: com nome ou como visitante (sem ranking). */
    identificado() { return !!atual || comoVisitante; },
    entrarComoVisitante() { if (atual) definir(null); comoVisitante = true; avisar(); },
    /* Chama f(jogador) agora e toda vez que o jogador mudar (entrar, trocar, visitante). */
    aoMudar(f) { ouvintes.push(f); f(atual); }
  };

  FC.paginas.aoEntrar('entrar', () => {
    form.reset(); erro.hidden = true;
    escolherAvatar(atual ? atual.avatar : null);
    desenharLista();
    campoNome.focus();
  });
  form.addEventListener('submit', ev => {
    ev.preventDefault();
    const msg = entrar(campoNome.value, campoTurma.value, avatarEscolhido());
    if (msg) { erro.textContent = msg; erro.hidden = false; campoNome.focus(); return; }
    FC.paginas.ir('mundos');
  });
  visitante.addEventListener('click', () => { FC.jogador.entrarComoVisitante(); FC.paginas.ir('mundos'); });
})();
