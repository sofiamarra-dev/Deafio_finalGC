/* Página inicial (visitante): apresenta a plataforma e leva ao cadastro ou ao login. */
import { el } from '../util.js';
import { criarOvo } from '../componentes/ovo.js';
import { layoutPublico } from '../componentes/layout.js';

const MODULOS = [
  ['Fundamentos de Python', 'Variáveis, tipos, print e input.'],
  ['Condicionais', 'if, elif, else e operadores lógicos.'],
  ['Estruturas de repetição', 'for, while, range e break.'],
  ['Listas e estruturas de dados', 'Listas, tuplas, dicionários e conjuntos.'],
  ['Funções', 'Parâmetros, retorno e escopo.'],
  ['Orientação a objetos', 'Classes, objetos, métodos e herança.']
];

export function paginaInicio() {
  const titulo = el('h1', {}, 'Aprenda Python ', el('em', {}, 'subindo de nível'), '.');
  const apresentacao = el('section', { className: 'inicio' },
    el('div', {},
      titulo,
      el('p', { className: 'chamada' },
        'Uma trilha de exercícios práticos, do primeiro print até orientação a objetos. ' +
        'Cada módulo concluído faz o seu ovo rachar um pouco mais.'),
      el('div', { className: 'chamada-acoes' },
        el('a', { className: 'botao', href: '#cadastro' }, 'Começar agora'),
        el('a', { className: 'botao secundario', href: '#entrar' }, 'Já tenho conta'))),
    el('div', { className: 'cena-ovo' },
      criarOvo(0),
      el('p', {}, 'Todo mundo começa com um ovo intacto. O que nasce dele depende de você.')));

  const lista = el('ol', { className: 'modulos' },
    MODULOS.map(([nome, descricao], i) => el('li', { className: 'modulo cartao' },
      el('span', { className: 'numero', 'aria-hidden': 'true' }, String(i + 1)),
      el('div', {}, el('h3', {}, nome), el('p', {}, descricao),
        el('div', { className: 'niveis' }, el('span', {}, 'fácil'), el('span', {}, 'intermediário'), el('span', {}, 'avançado'))))));

  const jornada = el('section', { className: 'jornada', 'aria-labelledby': 'tituloJornada' },
    el('h2', { id: 'tituloJornada' }, 'A jornada'),
    el('p', {}, 'Seis módulos em sequência, cada um com três níveis de dificuldade.'),
    lista);

  return layoutPublico([apresentacao, jornada], {
    acoesTopo: [el('a', { className: 'botao secundario pequeno', href: '#entrar' }, 'Entrar')]
  });
}
