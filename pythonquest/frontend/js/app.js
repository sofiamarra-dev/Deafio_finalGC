/* Ponto de partida do frontend: registra as rotas e liga o indicador do servidor. */
import { iniciarRoteador, registrarRota } from './roteador.js';
import { paginaInicio } from './paginas/inicio.js';
import { atualizarStatusServidor } from './componentes/status-servidor.js';

registrarRota('inicio', paginaInicio, { padrao: true });

iniciarRoteador();
atualizarStatusServidor(document.getElementById('statusServidor'));
