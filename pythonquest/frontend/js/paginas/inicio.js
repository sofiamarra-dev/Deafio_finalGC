/* Página inicial (visitante): uma cena 2D com o ovo na trilha, como funciona, os tipos de desafio e o mapa das salas. */
import { el } from '../util.js';
import { criarOvo, ESTAGIOS } from '../componentes/ovo.js';
import { icone } from '../componentes/icones.js';
import { layoutPublico } from '../componentes/layout.js';

const SALAS = [
  ['Fundamentos de Python', 'Variáveis, tipos, print e input.'],
  ['Condicionais', 'if, elif, else e operadores lógicos.'],
  ['Estruturas de repetição', 'for, while, range e break.'],
  ['Listas e estruturas de dados', 'Listas, tuplas, dicionários e conjuntos.'],
  ['Funções', 'Parâmetros, retorno e escopo.'],
  ['Orientação a objetos', 'Classes, objetos, métodos e herança.']
];

const DESAFIOS = [
  ['Múltipla escolha', 'Escolha a alternativa certa. Errou? Você vê na hora por que aquela opção não serve.'],
  ['Completar código', 'Falta um pedaço no programa. Encaixe a peça que faz ele funcionar.'],
  ['Montar o programa', 'As linhas vêm embaralhadas. Coloque cada uma no lugar e cuidado com as peças falsas.'],
  ['Escrever programa', 'Editor de verdade. Seu código é testado com casos que você vê e outros escondidos.']
];

/* A cena do topo: céu de pixels, uma trilha curtinha e o ovo pulando até a porta. */
function cena() {
  const nos = [['feito', 'certo'], ['feito', 'certo'], ['atual', 'estrela'], ['trancado', 'cadeado']];
  return el('div', { className: 'cena', 'aria-hidden': 'true' },
    el('span', { className: 'estrela-ceu e1' }), el('span', { className: 'estrela-ceu e2' }),
    el('span', { className: 'estrela-ceu e3' }), el('span', { className: 'estrela-ceu e4' }),
    el('span', { className: 'nuvem n1' }), el('span', { className: 'nuvem n2' }),
    el('div', { className: 'cena-trilha' },
      nos.map(([estado, nomeIcone], i) => el('span', { className: 'cena-parada', style: `--i:${i}` },
        estado === 'atual' ? el('span', { className: 'cena-ovo' }, criarOvo(2)) : null,
        el('span', { className: `cena-no cena-${estado}` }, icone(nomeIcone, { tamanho: 22 })))),
      el('span', { className: 'cena-porta' })),
    el('div', { className: 'cena-chao' }));
}

export function paginaInicio() {
  const heroi = el('section', { className: 'heroi' },
    el('div', { className: 'heroi-texto' },
      el('p', { className: 'selo' }, 'Python + jogo'),
      el('h1', {}, 'Aprenda Python ', el('em', {}, 'subindo de nível'), '.'),
      el('p', { className: 'chamada' },
        'Uma trilha de salas, do primeiro print até orientação a objetos. ' +
        'A cada sala concluída, o seu ovo racha um pouco mais.'),
      el('div', { className: 'chamada-acoes' },
        el('a', { className: 'botao grande', href: '#cadastro' }, 'Começar a jornada'),
        el('a', { className: 'botao secundario grande', href: '#entrar' }, 'Já tenho conta'))),
    cena());

  const evolucao = [0, 2, 4, 6].map(e => el('li', { className: 'evolucao-passo' },
    el('div', { className: 'evolucao-ovo' }, criarOvo(e, { animar: false })),
    el('span', {}, ESTAGIOS[e].nome)));
  const comoFunciona = el('section', { className: 'secao-inicio', 'aria-labelledby': 'tituloComo' },
    el('h2', { id: 'tituloComo' }, 'Como funciona'),
    el('ol', { className: 'passos-como' },
      el('li', { className: 'cartao passo-como' }, el('span', { className: 'passo-numero' }, '1'),
        el('h3', {}, 'Resolva desafios'), el('p', {}, 'Cada sala tem exercícios fáceis, intermediários e avançados, com dicas quando você travar.')),
      el('li', { className: 'cartao passo-como' }, el('span', { className: 'passo-numero' }, '2'),
        el('h3', {}, 'Abra a porta'), el('p', {}, 'Venceu o desafio final? A porta abre e o seu ovo anda até a próxima sala.')),
      el('li', { className: 'cartao passo-como' }, el('span', { className: 'passo-numero' }, '3'),
        el('h3', {}, 'Choque sua criatura'), el('p', {}, 'O ovo racha a cada sala concluída. Na última, ele eclode.'))),
    el('ol', { className: 'evolucao', 'aria-label': 'Como o ovo evolui' }, evolucao));

  const desafios = el('section', { className: 'secao-inicio', 'aria-labelledby': 'tituloDesafios' },
    el('h2', { id: 'tituloDesafios' }, 'Tipos de desafio'),
    el('ul', { className: 'grade-desafios' }, DESAFIOS.map(([nome, texto], i) =>
      el('li', { className: 'cartao desafio', style: `--sala:${i}` }, el('h3', {}, nome), el('p', {}, texto)))));

  const mapa = el('section', { className: 'secao-inicio', 'aria-labelledby': 'tituloMapa' },
    el('h2', { id: 'tituloMapa' }, 'O mapa das salas'),
    el('p', { className: 'secao-sub' }, 'Seis salas em sequência. Cada uma só abre quando você termina a anterior.'),
    el('ol', { className: 'mapa-salas' }, SALAS.map(([nome, descricao], i) =>
      el('li', { className: 'mapa-sala', style: `--sala:${i}` },
        el('span', { className: 'mapa-numero', 'aria-hidden': 'true' }, String(i + 1)),
        el('div', {}, el('h3', {}, nome), el('p', {}, descricao)),
        el('span', { className: 'mapa-icone', 'aria-hidden': 'true' }, icone(i === 0 ? 'estrela' : 'cadeado', { tamanho: 20 }))))));

  const final = el('section', { className: 'faixa-final' },
    el('div', { className: 'faixa-final-ovo' }, criarOvo(0)),
    el('div', {}, el('h2', {}, 'Seu ovo está esperando.'), el('p', {}, 'Crie a conta em menos de um minuto e comece pela Sala 1.')),
    el('a', { className: 'botao grande', href: '#cadastro' }, 'Criar minha conta'));

  return layoutPublico([heroi, comoFunciona, desafios, mapa, final], {
    acoesTopo: [el('a', { className: 'botao secundario pequeno', href: '#entrar' }, 'Entrar')]
  });
}
