/* Junta o projeto em um único arquivo HTML que funciona sozinho (CSS e JS embutidos, Skulpt pelo CDN).
   Uso:  npm run empacotar            -> dist/pyquest.html
         node tools/empacotar.js --artefato   -> dist/artefato.html (sem <html>/<head>/<body>, para publicar como página no Claude) */
const fs = require('fs');
const path = require('path');

const raiz = path.join(__dirname, '..');
const ler = rel => fs.readFileSync(path.join(raiz, rel), 'utf8');
const artefato = process.argv.includes('--artefato');
const CDN = 'https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/';

let html = ler('index.html');
html = html
  .replace(/<link rel="stylesheet" href="(css\/[^"]+)">/g, (m, p) => '<style>\n' + ler(p) + '\n</style>')
  .replace(/<script src="lib\/skulpt\/([^"]+)"><\/script>/g, (m, f) => '<script src="' + CDN + f + '"></script>')
  .replace(/<script src="(js\/[^"]+)"><\/script>/g, (m, p) => '<script>\n' + ler(p) + '\n</script>');

if (artefato) {
  // na página do Claude o quadro cresce com o conteúdo: altura em vh viraria laço, então a entrada usa altura fixa
  html = html.replace(/min-height:calc\(100vh - 40px\)/g, 'min-height:720px');
  const cabeca = html.match(/<head>([\s\S]*?)<\/head>/)[1]
    .replace(/<meta charset[^>]*>\s*/, '').replace(/<meta name="viewport"[^>]*>\s*/, '');
  const corpo = html.match(/<body>([\s\S]*?)<\/body>/)[1];
  html = cabeca.trim().replace('<title>', '<meta name="claude:viewport-fit-sides" content="cover">\n<title>') + '\n' + corpo.trim() + '\n';
}

fs.mkdirSync(path.join(raiz, 'dist'), { recursive: true });
const saida = path.join(raiz, 'dist', artefato ? 'artefato.html' : 'pyquest.html');
fs.writeFileSync(saida, html);
console.log('Gerado: ' + path.relative(raiz, saida) + ' (' + Math.round(html.length / 1024) + ' KB)');
