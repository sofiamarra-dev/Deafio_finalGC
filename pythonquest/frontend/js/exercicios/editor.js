/* Editor de código simples: números de linha, Tab = 4 espaços, Enter mantém a indentação
   (e acrescenta 4 espaços depois de ":"). */
import { el } from '../util.js';

const RECUO = '    ';

export function criarEditor(exercicio, aoMudar) {
  const inicial = (exercicio.codigo_inicial || '').replace(/\n$/, '');
  const numeros = el('div', { className: 'editor-linhas', 'aria-hidden': 'true' });
  const area = el('textarea', { className: 'editor-texto', spellcheck: false, autocomplete: 'off', autocapitalize: 'off',
    'aria-label': 'Seu código Python', value: inicial, wrap: 'off' });

  function atualizarNumeros() {
    const total = area.value.split('\n').length;
    numeros.textContent = Array.from({ length: total }, (_, i) => i + 1).join('\n');
    area.rows = Math.max(8, total + 1);
    numeros.scrollTop = area.scrollTop;
  }
  function inserir(texto) {
    const { selectionStart: ini, selectionEnd: fim, value } = area;
    area.value = value.slice(0, ini) + texto + value.slice(fim);
    area.selectionStart = area.selectionEnd = ini + texto.length;
  }
  area.addEventListener('keydown', evento => {
    if (evento.key === 'Tab' && !evento.ctrlKey && !evento.metaKey) {
      // Shift+Tab ou Esc liberam o foco para quem navega pelo teclado
      if (evento.shiftKey) return;
      evento.preventDefault(); inserir(RECUO);
    } else if (evento.key === 'Enter') {
      evento.preventDefault();
      const linha = area.value.slice(0, area.selectionStart).split('\n').pop();
      const recuo = linha.match(/^\s*/)[0] + (linha.trimEnd().endsWith(':') ? RECUO : '');
      inserir('\n' + recuo);
    } else if (evento.key === 'Escape') {
      area.blur();
      return;
    } else return;
    atualizarNumeros(); aoMudar();
  });
  area.addEventListener('input', () => { atualizarNumeros(); aoMudar(); });
  area.addEventListener('scroll', () => { numeros.scrollTop = area.scrollTop; });

  const restaurar = el('button', { type: 'button', className: 'link-botao', onclick: () => {
    area.value = inicial; atualizarNumeros(); aoMudar(); area.focus();
  } }, 'Restaurar código inicial');

  atualizarNumeros();
  return {
    elemento: el('div', { className: 'editor-bloco' },
      el('div', { className: 'editor' }, numeros, area),
      el('div', { className: 'editor-rodape' }, el('span', {}, 'Tab = 4 espaços · Esc sai do editor'), restaurar)),
    tipo: 'codigo',
    resposta: () => area.value,
    pronta: () => area.value.trim() !== '' && area.value.trim() !== inicial.trim(),
    programa: () => area.value,
    focar: () => area.focus()
  };
}
