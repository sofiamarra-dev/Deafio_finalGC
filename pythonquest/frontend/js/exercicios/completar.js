/* Código com uma lacuna: o aluno digita ou toca num bloco para encaixar. */
import { el } from '../util.js';

export function criarCompletar(exercicio, aoMudar) {
  const [antes, depois] = exercicio.codigo_inicial.replace(/\n$/, '').split('___');
  const lacuna = el('input', { className: 'lacuna', type: 'text', spellcheck: false, autocomplete: 'off',
    'aria-label': 'Lacuna do código', size: 4, oninput: ajustar });
  function ajustar() {
    lacuna.size = Math.max(4, lacuna.value.length + 1);
    blocos.forEach(b => b.classList.toggle('bloco-usado', b.textContent === lacuna.value.trim()));
    aoMudar();
  }
  const blocos = (exercicio.blocos || []).map(texto => el('button', { type: 'button', className: 'bloco', onclick: () => {
    lacuna.value = texto;
    lacuna.classList.remove('encaixou'); void lacuna.offsetWidth; lacuna.classList.add('encaixou');
    ajustar();
  } }, texto));

  const codigo = el('pre', { className: 'codigo-bloco codigo-lacuna' }, el('code', {}, antes, lacuna, depois));
  const elemento = el('div', { className: 'completar' }, codigo,
    blocos.length ? el('div', { className: 'bandeja' }, el('span', { className: 'bandeja-rotulo' }, 'Sugestões:'), blocos) : null);
  return {
    elemento, tipo: 'codigo',
    resposta: () => lacuna.value.trim(),
    pronta: () => lacuna.value.trim() !== '',
    programa: () => `${antes}${lacuna.value.trim()}${depois}`,
    focar: () => lacuna.focus()
  };
}
