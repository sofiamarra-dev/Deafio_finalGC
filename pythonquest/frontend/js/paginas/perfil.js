/* Perfil: o seu (com apelido e cor do ovo editáveis e seus números) ou o de um colega (só o que é público). */
import { el, irPara } from '../util.js';
import { api } from '../api.js';
import { sessao } from '../estado.js';
import { layoutApp } from '../componentes/layout.js';
import { criarOvo, CORES_OVO, ESTAGIOS } from '../componentes/ovo.js';
import { icone } from '../componentes/icones.js';
import { cartaoJogador } from './trilha.js';

const NOME_COR = { verde: 'Verde', azul: 'Azul', roxo: 'Roxo', laranja: 'Laranja', rosa: 'Rosa', amarelo: 'Amarelo' };

function gradeConquistas(lista) {
  return el('ul', { className: 'conquistas' }, lista.map(c =>
    el('li', { className: `conquista${c.ganhou ? ' conquista-ganha' : ''}` },
      el('span', { className: 'conquista-icone', 'aria-hidden': 'true' }, icone(c.ganhou ? 'trofeu' : 'cadeado', { tamanho: 26 })),
      el('div', {},
        el('p', { className: 'conquista-titulo' }, c.titulo),
        el('p', { className: 'conquista-texto' }, c.descricao),
        c.ganhou ? null : el('p', { className: 'conquista-progresso' }, `${c.progresso} de ${c.meta}`)))));
}

function numeros(e) {
  const item = (valor, rotulo) => el('div', { className: 'numero-perfil' }, el('strong', {}, String(valor)), el('span', {}, rotulo));
  return el('div', { className: 'numeros-perfil' },
    item(e.exercicios_concluidos, 'exercícios concluídos'),
    item(e.acertos, 'envios certos'),
    item(e.erros, 'envios com erro'),
    item(e.taxa_acerto === null ? '–' : e.taxa_acerto + '%', 'de acerto'));
}

function formularioEdicao(perfil, aoSalvar) {
  let cor = perfil.cor;
  const apelido = el('input', { type: 'text', id: 'apelido', maxLength: 30, value: perfil.apelido, placeholder: perfil.nome_exibido });
  const aviso = el('p', { className: 'aviso', hidden: true, role: 'status' });
  const cores = el('div', { className: 'escolha-cores', role: 'radiogroup', 'aria-label': 'Cor do ovo' },
    perfil.cores.map(c => {
      const b = el('button', { type: 'button', className: 'cor-ovo', role: 'radio', 'aria-checked': String(c === cor),
        'aria-label': NOME_COR[c] || c, style: `--cor:${CORES_OVO[c]}`, onclick: () => {
          cor = c; cores.querySelectorAll('.cor-ovo').forEach(x => x.setAttribute('aria-checked', String(x === b)));
        } });
      return b;
    }));
  const salvar = el('button', { className: 'botao', type: 'submit' }, 'Salvar');
  const form = el('form', { className: 'cartao form-perfil', onsubmit: async evento => {
    evento.preventDefault();
    salvar.disabled = true;
    try {
      const novo = await api.editarPerfil({ apelido: apelido.value, cor });
      if (sessao.usuario) sessao.usuario.avatar = novo.cor;
      aoSalvar(novo);
    } catch (erro) {
      aviso.hidden = false; aviso.className = 'aviso erro'; aviso.textContent = erro.message; salvar.disabled = false;
    }
  } },
    el('h2', {}, 'Como você aparece'),
    el('label', { htmlFor: 'apelido' }, 'Apelido no ranking'),
    apelido,
    el('p', { className: 'campo-ajuda' }, 'Deixe vazio para usar seu primeiro nome e a inicial do sobrenome. Seu e-mail nunca aparece.'),
    el('p', { className: 'rotulo-campo' }, 'Cor do seu ovo'),
    cores, aviso, salvar);
  return form;
}

function montar(perfil, pagina) {
  const estagio = Math.min(perfil.ovo, ESTAGIOS.length - 1);
  const topo = el('section', { className: 'perfil-topo' },
    el('div', { className: 'perfil-ovo' }, criarOvo(perfil.ovo, { cor: perfil.cor })),
    el('div', {},
      el('h1', { className: 'titulo-pagina' }, perfil.nome_exibido),
      el('p', { className: 'perfil-sub' }, `Nível ${perfil.jogador.nivel} · ${perfil.jogador.xp} XP · ${ESTAGIOS[estagio].nome}`),
      el('p', { className: 'perfil-sub' }, `Sequência: ${perfil.jogador.sequencia.dias} dia(s) · melhor: ${perfil.jogador.sequencia.melhor}`)));
  const partes = [topo];
  if (perfil.proprio && perfil.estatisticas) {
    partes.push(el('section', { className: 'secao-perfil' }, el('h2', {}, 'Seus números'), numeros(perfil.estatisticas)));
  }
  const ganhas = perfil.conquistas.filter(c => c.ganhou).length;
  partes.push(el('section', { className: 'secao-perfil' },
    el('h2', {}, `Conquistas (${ganhas} de ${perfil.conquistas.length})`), gradeConquistas(perfil.conquistas)));
  if (perfil.proprio && perfil.cores) {
    partes.push(formularioEdicao(perfil, novo => pagina.replaceChildren(...montar(novo, pagina))));
  } else {
    partes.push(el('a', { className: 'botao secundario', href: '#ranking' }, 'Voltar para o ranking'));
  }
  return partes;
}

export async function paginaPerfil(id) {
  let perfil;
  try { perfil = await (id ? api.perfilDe(id) : api.perfil()); }
  catch (erro) {
    if (erro.status === 401) { irPara('entrar'); return el('div'); }
    return layoutApp(el('p', { className: 'aviso erro' }, erro.message), { ativo: 'perfil' });
  }
  const pagina = el('div', { className: 'pagina-perfil' });
  pagina.append(...montar(perfil, pagina));
  return layoutApp(pagina, { ativo: perfil.proprio ? 'perfil' : 'ranking', lateral: [cartaoJogador(perfil.jogador)] });
}
