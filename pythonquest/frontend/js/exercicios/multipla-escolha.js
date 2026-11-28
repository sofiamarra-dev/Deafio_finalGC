/* Alternativas como cartões 2D. Teclas 1 a 4 escolhem. */
import { el } from '../util.js';

export function criarMultiplaEscolha(exercicio, aoMudar) {
  let escolhida = null;
  const opcoes = exercicio.alternativas.map((alt, i) => {
    const botao = el('button', { type: 'button', className: 'alternativa', role: 'radio', 'aria-checked': 'false',
      onclick: () => escolher(alt.id) },
      el('span', { className: 'alternativa-tecla', 'aria-hidden': 'true' }, String(i + 1)),
      el('span', { className: 'alternativa-texto' }, alt.texto));
    botao.dataset.id = alt.id;
    return botao;
  });
  const grupo = el('div', { className: 'alternativas', role: 'radiogroup', 'aria-label': 'Alternativas' }, opcoes);

  function escolher(id) {
    escolhida = String(id);
    opcoes.forEach(o => o.setAttribute('aria-checked', String(o.dataset.id === escolhida)));
    aoMudar();
  }
  function teclas(evento) {
    if (!grupo.isConnected) { document.removeEventListener('keydown', teclas); return; }
    if (/^[1-9]$/.test(evento.key) && !evento.target.closest('input, textarea')) {
      const alt = exercicio.alternativas[Number(evento.key) - 1];
      if (alt) escolher(alt.id);
    }
  }
  document.addEventListener('keydown', teclas);

  return { elemento: grupo, resposta: () => escolhida, pronta: () => escolhida !== null, tipo: 'escolha' };
}
