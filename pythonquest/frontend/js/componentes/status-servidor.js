/* Indicador no topo: mostra se o servidor e o banco estão respondendo (dado real de /api/saude). */
import { api } from '../api.js';

export async function atualizarStatusServidor(elemento) {
  try {
    const saude = await api.saude();
    const ok = saude.servidor === 'ok' && saude.banco === 'ok';
    elemento.dataset.estado = ok ? 'ok' : 'erro';
    elemento.textContent = ok ? 'Servidor conectado' : 'Banco não preparado (veja o terminal)';
    if (!ok && saude.avisos?.length) elemento.title = saude.avisos.join(' ');
  } catch {
    elemento.dataset.estado = 'erro';
    elemento.textContent = 'Servidor fora do ar';
  }
}
