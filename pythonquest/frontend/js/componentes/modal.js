/* Janela modal acessível: foco preso dentro, Esc fecha, foco volta para quem abriu. */
import { el } from '../util.js';

export function abrirModal({ titulo, conteudo, acoes = [], aoFechar } = {}) {
  const camada = document.getElementById('camada-modal');
  const quemAbriu = document.activeElement;
  const idTitulo = 'modal-titulo-' + Math.random().toString(36).slice(2);
  const caixa = el('div', { className: 'modal', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': idTitulo },
    el('h2', { id: idTitulo }, titulo), conteudo, el('div', { className: 'acoes' }, acoes));
  const fundo = el('div', { className: 'fundo-modal' }, caixa);

  function fechar() {
    fundo.remove();
    document.removeEventListener('keydown', teclas);
    if (quemAbriu && quemAbriu.focus) quemAbriu.focus();
    if (aoFechar) aoFechar();
  }
  function teclas(evento) {
    if (evento.key === 'Escape') fechar();
    if (evento.key === 'Tab') {
      const focaveis = caixa.querySelectorAll('button, [href], input, textarea, [tabindex]:not([tabindex="-1"])');
      if (!focaveis.length) return;
      const primeiro = focaveis[0], ultimo = focaveis[focaveis.length - 1];
      if (evento.shiftKey && document.activeElement === primeiro) { ultimo.focus(); evento.preventDefault(); }
      else if (!evento.shiftKey && document.activeElement === ultimo) { primeiro.focus(); evento.preventDefault(); }
    }
  }
  fundo.addEventListener('click', evento => { if (evento.target === fundo) fechar(); });
  document.addEventListener('keydown', teclas);
  camada.append(fundo);
  (caixa.querySelector('.acoes button') || caixa).focus();
  return { fechar, caixa };
}
