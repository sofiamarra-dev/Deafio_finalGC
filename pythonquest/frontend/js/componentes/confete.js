/* Confete de quadradinhos para comemorar um acerto. */
const CORES = ['#00b312', '#3ddc4f', '#f3f3f3', '#f2b443'];

export function soltarConfete(quantidade = 40) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const camada = document.createElement('div');
  camada.className = 'confete';
  camada.setAttribute('aria-hidden', 'true');
  for (let i = 0; i < quantidade; i++) {
    const q = document.createElement('i');
    q.style.left = Math.random() * 100 + 'vw';
    q.style.background = CORES[i % CORES.length];
    q.style.animationDelay = Math.random() * 0.25 + 's';
    q.style.setProperty('--dx', (Math.random() * 160 - 80) + 'px');
    q.style.setProperty('--giro', (Math.random() * 720 - 360) + 'deg');
    camada.append(q);
  }
  document.body.append(camada);
  setTimeout(() => camada.remove(), 1800);
}
