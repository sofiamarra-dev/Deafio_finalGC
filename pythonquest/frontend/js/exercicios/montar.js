/* Montar o programa: as peças (linhas de código) vêm embaralhadas. O aluno toca numa peça para colocá-la
   no programa e toca de novo para tirar. Dá para trocar a ordem com as setas ou arrastando (no computador).
   A correção é no servidor, pelos testes: qualquer ordem que funcione vale. */
import { el } from '../util.js';

export function criarMontar(exercicio, aoMudar) {
  const pecas = exercicio.blocos.map((texto, id) => ({ id, texto }));
  let programa = []; // ids das peças, na ordem montada

  const listaPrograma = el('ol', { className: 'montar-programa', 'aria-label': 'Seu programa' });
  const bandeja = el('div', { className: 'bandeja montar-bandeja', 'aria-label': 'Peças disponíveis' });
  let arrastando = null;

  function botaoPeca(peca, { noPrograma, posicao }) {
    const b = el('button', {
      type: 'button', className: 'bloco peca' + (noPrograma ? ' peca-no-programa' : ''),
      'aria-label': noPrograma ? `Tirar a linha ${posicao + 1}: ${peca.texto.trim()}` : `Colocar: ${peca.texto.trim()}`,
      onclick: () => {
        programa = noPrograma ? programa.filter(i => i !== peca.id) : [...programa, peca.id];
        desenhar(noPrograma ? null : peca.id);
      }
    }, el('code', {}, peca.texto));
    return b;
  }

  function mover(posicao, passo) {
    const destino = posicao + passo;
    if (destino < 0 || destino >= programa.length) return;
    [programa[posicao], programa[destino]] = [programa[destino], programa[posicao]];
    desenhar(programa[destino]);
  }

  function desenhar(novaId = null, avisar = true) {
    listaPrograma.replaceChildren(...(programa.length ? programa.map((id, posicao) => {
      const item = el('li', { className: 'linha-montada' + (id === novaId ? ' encaixou' : ''), draggable: 'true' },
        el('span', { className: 'linha-numero', 'aria-hidden': 'true' }, String(posicao + 1)),
        botaoPeca(pecas[id], { noPrograma: true, posicao }),
        el('span', { className: 'linha-setas' },
          el('button', { type: 'button', className: 'seta', 'aria-label': 'Subir linha', disabled: posicao === 0,
            onclick: () => mover(posicao, -1) }, '▲'),
          el('button', { type: 'button', className: 'seta', 'aria-label': 'Descer linha', disabled: posicao === programa.length - 1,
            onclick: () => mover(posicao, 1) }, '▼')));
      item.addEventListener('dragstart', e => { arrastando = posicao; e.dataTransfer.effectAllowed = 'move'; item.classList.add('arrastando'); });
      item.addEventListener('dragend', () => item.classList.remove('arrastando'));
      item.addEventListener('dragover', e => { e.preventDefault(); item.classList.add('alvo-arraste'); });
      item.addEventListener('dragleave', () => item.classList.remove('alvo-arraste'));
      item.addEventListener('drop', e => {
        e.preventDefault();
        if (arrastando === null || arrastando === posicao) return;
        const [id] = programa.splice(arrastando, 1);
        programa.splice(posicao, 0, id);
        arrastando = null;
        desenhar(id);
      });
      return item;
    }) : [el('li', { className: 'montar-vazio' }, 'Toque nas peças abaixo para montar o programa.')]));

    const livres = pecas.filter(p => !programa.includes(p.id));
    bandeja.replaceChildren(...(livres.length ? livres.map(p => botaoPeca(p, { noPrograma: false }))
      : [el('span', { className: 'bandeja-rotulo' }, 'Você usou todas as peças.')]));
    if (avisar) aoMudar();
  }
  desenhar(null, false); // na criação a página ainda não terminou de montar o botão Verificar

  const texto = () => programa.map(id => pecas[id].texto).join('\n') + '\n';
  const elemento = el('div', { className: 'montar' },
    el('p', { className: 'montar-rotulo' }, 'Seu programa'),
    el('div', { className: 'codigo-bloco montar-area' }, listaPrograma),
    el('p', { className: 'montar-rotulo' }, 'Peças'),
    bandeja);
  return {
    elemento, tipo: 'codigo',
    resposta: texto,
    pronta: () => programa.length > 0,
    programa: texto,
    focar: () => bandeja.querySelector('button')?.focus()
  };
}
