/* Página inicial: apresenta a plataforma e a jornada. Nada aqui finge ser dado de aluno:
   a lista de módulos é o currículo do curso, e o ovo mostrado é o ponto de partida de todo mundo. */
import { criarOvo } from '../componentes/ovo.js';

const MODULOS = [
  ['Fundamentos de Python', 'Variáveis, tipos, print e input.'],
  ['Condicionais', 'if, elif, else e operadores lógicos.'],
  ['Estruturas de repetição', 'for, while, range e break.'],
  ['Listas e estruturas de dados', 'Listas, tuplas, dicionários e conjuntos.'],
  ['Funções', 'Parâmetros, retorno e escopo.'],
  ['Orientação a objetos', 'Classes, objetos, métodos e herança.']
];

/* Cria um elemento. Chaves com hífen (aria-*, data-*) viram atributos; as outras, propriedades. */
function el(tag, atributos = {}, ...filhos) {
  const elemento = document.createElement(tag);
  for (const [chave, valor] of Object.entries(atributos)) {
    if (chave.includes('-')) elemento.setAttribute(chave, valor); else elemento[chave] = valor;
  }
  elemento.append(...filhos);
  return elemento;
}

export function paginaInicio() {
  const pagina = el('div');

  const titulo = el('h1');
  titulo.append('Aprenda Python ', el('em', {}, 'subindo de nível'), '.');

  const apresentacao = el('section', { className: 'inicio' },
    el('div', {},
      titulo,
      el('p', { className: 'chamada' },
        'Uma trilha de exercícios práticos, do primeiro print até orientação a objetos. ' +
        'Cada módulo concluído faz o seu ovo rachar um pouco mais.'),
      el('p', { className: 'aviso-etapa' },
        'Em construção: login, trilha e exercícios chegam nas próximas etapas.')
    ),
    el('div', { className: 'cena-ovo' },
      criarOvo({ rotulo: 'Ovo intacto, o ponto de partida da jornada' }),
      el('p', {}, 'Todo mundo começa com um ovo intacto. O que nasce dele depende de você.')
    )
  );

  const lista = el('ol', { className: 'modulos' });
  MODULOS.forEach(([nome, descricao], i) => {
    lista.append(el('li', { className: 'modulo cartao' },
      el('span', { className: 'numero', 'aria-hidden': 'true' }, String(i + 1)),
      el('div', {},
        el('h3', {}, nome),
        el('p', {}, descricao),
        el('div', { className: 'niveis' },
          el('span', {}, 'fácil'), el('span', {}, 'intermediário'), el('span', {}, 'avançado'))
      )
    ));
  });

  const jornada = el('section', { className: 'jornada', 'aria-labelledby': 'tituloJornada' },
    el('h2', { id: 'tituloJornada' }, 'A jornada'),
    el('p', {}, 'Seis módulos em sequência, cada um com três níveis de dificuldade.'),
    lista
  );

  pagina.append(apresentacao, jornada);
  return pagina;
}
