/* Avatares do perfil: figurinhas de pixel art de 12×12 para escolher no login e aparecer no ranking.
   Para criar um novo, copie um da lista: cada letra de `linhas` é uma cor de `pal` (o ponto é transparente, mostra o fundo `bg`). */
window.FC = window.FC || {};

FC.avatares = (function () {
  const PELE1 = '#e0ac84', PELE2 = '#8d5a3b', PELE3 = '#f1cfae', PELE4 = '#5e3a26';
  const L = [
    { id: 'hacker', nome: 'Hacker', bg: '#17454b',
      pal: { h: '#3b4170', s: PELE1, c: '#5ad1e6', m: '#8a4b38', w: '#e8e6e0' },
      linhas: ['...hhhhhh...', '..hhhhhhhh..', '.hhsssssshh.', '.hssssssssh.', '.hccsssscch.', '.hssssssssh.', '.hssssssssh.', '.hsssmmsssh.', '..hssssssh..', '..hhhhhhhh..', '.hhhhwwhhhh.', 'hhhhhhhhhhhh'] },
    { id: 'detetive', nome: 'Detetive', bg: '#3d4652',
      pal: { f: '#6b4a2f', b: '#c0453f', s: PELE3, d: '#2a2a30', n: '#5a3a24', k: '#4a4f5c', w: '#f4f2ee', r: '#c0453f' },
      linhas: ['...ffffff...', '...bbbbbb...', '.ffffffffff.', '..ssssssss..', '..sdssssds..', '..ssssssss..', '..snnnnnns..', '...ssssss...', '....ssss....', '.kkkkwwkkkk.', '.kkkkwrrwkk.', 'kkkkkkrrkkkk'] },
    { id: 'ninja', nome: 'Ninja', bg: '#2d5a7a',
      pal: { k: '#1c1c24', r: '#c0453f', s: PELE1, d: '#14110f' },
      linhas: ['...kkkkkk...', '..kkkkkkkk..', '..rrrrrrrr..', '..kkkkkkkk..', '..kssssssk..', '..ksdssdsk..', '..kkkkkkkk..', '..kkkkkkkk..', '...kkkkkk...', '.kkkkkkkkkk.', 'kkkkkkkkkkrr', 'kkkkkkkkkkkk'] },
    { id: 'cientista', nome: 'Cientista', bg: '#4d4380',
      pal: { h: '#cfcfd6', s: PELE4, l: '#bfe9ff', d: '#14110f', m: '#2a1a12', w: '#f4f2ee', p: '#4a9bd1' },
      linhas: ['..hhhhhhhh..', '.hhhhhhhhhh.', '.hhsssssshh.', '.hssssssssh.', '.hldlssldlh.', '.hssssssssh.', '..ssssssss..', '..sssmmsss..', '...ssssss...', '.wwwwssswwww', '.wwwwwwpwwww', 'wwwwwwwwwwww'] },
    { id: 'piloto', nome: 'Piloto', bg: '#23506f', olhos: 5,
      pal: { c: '#7a4a2a', g: '#e8b04a', l: '#7dd3fc', s: PELE3, d: '#2a2a30', m: '#a05a4a', r: '#c0453f', j: '#6b4a2f' },
      linhas: ['...cccccc...', '..cccccccc..', '.cggccccggc.', '.cllccccllc.', '.cssssssssc.', '.cssdssdssc.', '..ssssssss..', '..sssmmsss..', '...ssssss...', '..rrrrrrrr..', '.jjjrrrrjjj.', 'jjjjjjjjjjjj'] },
    { id: 'mecanica', nome: 'Mecânica', bg: '#2a6e62',
      pal: { h: '#3a2418', b: '#e86a5c', s: PELE2, d: '#14110f', m: '#3a1f14', w: '#f4f2ee', o: '#3a6ea5' },
      linhas: ['...hhhhhh...', '..hhhhhhhh..', '.bbbbbbbbbb.', '.hssssssssh.', '.hsdssssdsh.', '..ssssssss..', '..sssmmsss..', '...ssssss...', '....ssss....', '..wwwwwwww..', '.oowwwwwwoo.', '.oooooooooo.'] },
    { id: 'exploradora', nome: 'Exploradora', bg: '#4b3a66',
      pal: { f: '#c9a85a', h: '#1c1612', s: PELE1, d: '#2a2a30', m: '#9a4a3a', g: '#5a8a4a' },
      linhas: ['....ffff....', '...ffffff...', '.ffffffffff.', '..hssssssh..', '..sdssssds..', '..ssssssss..', '..sssmmsss..', '...ssssss...', '....ssss....', '.gggssssggg.', '.gggggggggg.', 'gggggggggggg'] },
    { id: 'programadora', nome: 'Programadora', bg: '#4a2f55',
      pal: { h: '#8a3a1f', p: '#2a2a30', q: '#e86a5c', s: PELE3, d: '#2a2a30', m: '#b5524a', t: '#3b4170' },
      linhas: ['...hhhhhh...', '..hhhhhhhh..', '.phhhhhhhhp.', 'qhssssssssh' + 'q', 'qhsdssssdshq', '.hssssssssh.', '.hsssmmsssh.', '.hhsssssshh.', '.hhhsssshhh.', '.hhtttttthh' + '.', '.httttttttth', 'tttttttttttt'] },
    { id: 'doutora', nome: 'Doutora', bg: '#2d5a5a',
      pal: { b: '#2a1a12', s: PELE2, d: '#14110f', m: '#a8474f', w: '#f4f2ee', g: '#9aa3ad' },
      linhas: ['....bbbb....', '...bbbbbb...', '..bbbbbbbb..', '..bssssssb..', '..bsdssdsb..', '..ssssssss..', '..sssmmsss..', '...ssssss...', '....ssss....', '.wwwwssswwww', '.wwgwwwwgwww', 'wwwgwwwwgwww'] },
    { id: 'artista', nome: 'Artista', bg: '#5a3a3a',
      pal: { h: '#3a7fd0', s: PELE1, d: '#2a2a30', m: '#b5524a', e: '#e8b04a', k: '#1c1c24' },
      linhas: ['...hhhhhh...', '..hhhhhhhh..', '.hhhhhhhhhh.', '.hhsssssshh.', '.hsdssssdsh.', '.hssssssssh.', '.hsssmmsssh.', '.hhsssssshh.', '.e..ssss..e.', '..kkkssskkk.', '.kkkkkkkkkk.', 'kkkkkkkkkkkk'] },
    { id: 'viajante', nome: 'Viajante', bg: '#3a4a2a',
      pal: { c: '#d49a2a', h: '#1c1612', s: PELE4, d: '#0e0b09', m: '#9a4a4a', r: '#2a8a7a', j: '#3a3f4a' },
      linhas: ['...cccccc...', '..cccccccc..', '.cccccccccc.', '.hhsssssshh.', '.hsdssssdsh.', '.hssssssssh.', '.hsssmmsssh.', '.hhsssssshh.', '.hh.ssss.hh.', '.hhrrrrrrhh.', '..rrrrrrrr..', '.jjjjjjjjjj.'] },
    { id: 'preso', nome: 'Preso', bg: '#363a44',
      pal: { s: '#e0ac84', h: '#4a3322', o: '#e2872f', d: '#2a2a30', b: '#c9a07a', w: '#f4efe4' },
      linhas: ['...hhhhhh...', '..hhhhhhhh..', '..hhhhhhhh..', '..ssssssss..', '..sdssssds..', '..ssssssss..', '..sbbbbbbs..', '...ssssss...', '....ssss....', '..oooooooo..', '.oooowwoooo.', 'oooooooooooo'] }
  ];
  const ORDEM = ['hacker', 'programadora', 'detetive', 'doutora', 'ninja', 'artista', 'cientista', 'viajante', 'piloto', 'mecanica', 'exploradora', 'preso'];
  L.sort((a, b) => ORDEM.indexOf(a.id) - ORDEM.indexOf(b.id));
  const porId = id => L.find(a => a.id === id) || L[0];

  return {
    lista: L,
    padrao: L[0].id,
    existe: id => L.some(a => a.id === id),
    nome: id => porId(id).nome,
    /* Desenha o avatar num <canvas> de `px` pixels (use múltiplo de 12 para ficar nítido), com os acessórios `equip` ({ chapeu, oculos }). */
    canvas(id, px, equip, suave) {
      /* `suave`: para tamanhos que mudam com a tela. Desenha grande e deixa o navegador reduzir por igual (sem pixels de tamanhos diferentes). */
      const a = porId(id), c = document.createElement('canvas'), k = suave ? 16 : (px || 48) / 12;
      c.width = c.height = 12 * k; c.className = 'avatar' + (suave ? ' suave' : ''); c.setAttribute('aria-hidden', 'true');
      const x = c.getContext('2d');
      x.fillStyle = a.bg; x.fillRect(0, 0, c.width, c.height);
      a.linhas.forEach((linha, j) => [...linha].forEach((ch, i) => {
        if (ch === '.') return;
        x.fillStyle = a.pal[ch]; x.fillRect(i * k, j * k, k, k);
      }));
      if (equip && FC.acessorios) FC.acessorios.desenharAvatar(x, k, equip, a.olhos);
      return c;
    }
  };
})();
