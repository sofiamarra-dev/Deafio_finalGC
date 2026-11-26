/* Acessórios para o avatar do perfil e para o personagem do jogo (chapéus e óculos), em pixel art.
   Cada item é uma grade de 12 colunas: chapéus têm 4 linhas e óculos 2. Cada letra é uma cor de `pal`; o ponto é transparente.
   Para criar um novo, copie um da lista e dê um id, um nome e um preço (em moedas). */
window.FC = window.FC || {};

FC.acessorios = (function () {
  const LISTA = [
    { id: 'bone', cat: 'chapeu', nome: 'Boné', preco: 150, pal: { r: '#d9544f', R: '#a83a36', w: '#f4efe4' },
      linhas: ['...rrrrrr...', '..rrrwwrrr..', '.rrrrrrrrrr.', 'RRRRRRRRRRRR'] },
    { id: 'capacete', cat: 'chapeu', nome: 'Capacete de obra', preco: 300, pal: { y: '#f2c230', Y: '#fff0a0', d: '#b8860b' },
      linhas: ['....yyyy....', '..yyYYyyyy..', '.yyyyyyyyyy.', 'dddddddddddd'] },
    { id: 'cartola', cat: 'chapeu', nome: 'Cartola', preco: 400, pal: { k: '#1c1c24', K: '#3a3a46', r: '#c0453f' },
      linhas: ['...kkkkkk...', '...kKkkkk...', '...rrrrrr...', '.kkkkkkkkkk.'] },
    { id: 'cowboy', cat: 'chapeu', nome: 'Chapéu de cowboy', preco: 450, pal: { b: '#a8743a', d: '#7a4f22', y: '#e8b04a' },
      linhas: ['...bbbbbb...', '...bddddb...', '..yyyyyyyy..', 'bbbbbbbbbbbb'] },
    { id: 'pirata', cat: 'chapeu', nome: 'Chapéu de pirata', preco: 600, pal: { k: '#1c1c24', w: '#f4efe4', g: '#e8b04a' },
      linhas: ['...kkkkkk...', '.kkkkwwkkkk.', 'kkkkkwwkkkkk', 'gkk......kkg'] },
    { id: 'coroa', cat: 'chapeu', nome: 'Coroa', preco: 900, pal: { g: '#f2b632', G: '#ffe27a', r: '#e04a3f', b: '#4a9bd1' },
      linhas: ['.g...gg...g.', '.gg.gGGg.gg.', '.gggggggggg.', '.ggrggbggrg.'] },
    { id: 'redondos', cat: 'oculos', nome: 'Óculos redondos', preco: 200, pal: { o: '#c98512' },
      linhas: ['..ooo..ooo..', '..o.o..o.o..'] },
    { id: 'escuros', cat: 'oculos', nome: 'Óculos escuros', preco: 250, pal: { k: '#14101f', w: '#6a6a80' },
      linhas: ['..kkkkkkkk..', '..kwk..kwk..'] },
    { id: 'pixel', cat: 'oculos', nome: 'Óculos pixelados', preco: 500, pal: { k: '#14101f', c: '#5ad1e6' },
      linhas: ['.kkkkkkkkkk.', '.kckk..kckk.'] }
  ];
  const porId = id => LISTA.find(a => a.id === id) || null;

  function desenhar(ctx, item, x, y, k) {
    item.linhas.forEach((linha, j) => [...linha].forEach((ch, i) => {
      if (ch === '.') return;
      ctx.fillStyle = item.pal[ch]; ctx.fillRect(x + i * k, y + j * k, k, k);
    }));
  }

  return {
    lista: LISTA,
    porId: porId,
    categorias: { chapeu: 'Chapéus', oculos: 'Óculos' },
    /* No avatar de 12×12: o chapéu cobre as 4 primeiras linhas e os óculos ficam na linha dos olhos. */
    desenharAvatar(ctx, k, equip, linhaOlhos) {
      if (!equip) return;
      const h = porId(equip.chapeu), o = porId(equip.oculos);
      if (o) desenhar(ctx, o, 0, (linhaOlhos || 4) * k, k);
      if (h) desenhar(ctx, h, 0, 0, k);
    },
    /* No personagem do jogo (pixels de 1x1): `sx, sy` é o canto da figura; hatY e eyeY variam por personagem. */
    desenharPersonagem(ctx, sx, sy, equip, hatY, eyeY) {
      if (!equip) return;
      const h = porId(equip.chapeu), o = porId(equip.oculos);
      if (o) desenhar(ctx, o, sx + 6, sy + eyeY, 1);
      if (h) desenhar(ctx, h, sx + 6, sy + hatY, 1);
    },
    /* Ícone do item, em um <canvas> (para a loja). */
    icone(id, k) {
      const item = porId(id), c = document.createElement('canvas');
      c.width = 12 * k; c.height = item.linhas.length * k; c.className = 'icone-item';
      desenhar(c.getContext('2d'), item, 0, 0, k);
      return c;
    }
  };
})();
