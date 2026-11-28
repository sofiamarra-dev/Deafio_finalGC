/* Quem está logado (cópia do que o servidor disse em /api/contas/eu). Serve só para a interface. */
import { api, ErroApi } from './api.js';

let usuario = null;

export const sessao = {
  get usuario() { return usuario; },
  definir(u) { usuario = u; },
  async carregar() {
    try { usuario = await api.eu(); }
    catch (erro) { if (!(erro instanceof ErroApi) || erro.status !== 401) console.warn(erro); usuario = null; }
    return usuario;
  },
  async sair() {
    await api.sair().catch(() => {});
    usuario = null;
  }
};
