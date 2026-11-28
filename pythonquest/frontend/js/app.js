/* Ponto de partida do frontend: descobre quem está logado, registra as rotas e desenha a página. */
import { iniciarRoteador, registrarRota } from './roteador.js';
import { sessao } from './estado.js';
import { paginaInicio } from './paginas/inicio.js';
import { paginaEntrar, paginaCadastro } from './paginas/conta.js';
import { paginaTrilha } from './paginas/trilha.js';
import { paginaExercicio } from './paginas/exercicio.js';
import { paginaProfessor } from './paginas/professor.js';
import { paginaRanking } from './paginas/ranking.js';
import { paginaPerfil } from './paginas/perfil.js';

registrarRota('inicio', paginaInicio, { padrao: true, acesso: 'visitante' });
registrarRota('entrar', paginaEntrar, { acesso: 'visitante' });
registrarRota('cadastro', paginaCadastro, { acesso: 'visitante' });
registrarRota('trilha', paginaTrilha, { acesso: 'aluno' });
registrarRota('exercicio', paginaExercicio, { acesso: 'aluno' });
registrarRota('ranking', paginaRanking, { acesso: 'aluno' });
registrarRota('perfil', paginaPerfil, { acesso: 'aluno' });
registrarRota('professor', paginaProfessor, { acesso: 'professor' });

await sessao.carregar();
iniciarRoteador();
