/* Indicador no topo: mostra se o servidor e o banco estão respondendo (dado real de /api/saude). */
import { api } from '../api.js';

export async function atualizarStatusServidor(elemento) {
  try {
    const saude = await api.saude();
    const ok = saude.servidor === 'ok' && saude.banco === 'ok';
    elemento.dataset.estado = ok ? 'ok' : 'erro';
    elemento.textContent = ok ? 'Servidor conectado' : 'Servidor com problema no banco';
  } catch {
    elemento.dataset.estado = 'erro';
    elemento.textContent = 'Servidor fora do ar';
  }
}
