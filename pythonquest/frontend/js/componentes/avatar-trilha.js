/* O ovo do aluno como personagem da trilha. Ele fica parado no exercício atual e, quando o aluno avança,
   anda pulando de nó em nó (e passa pela porta quando muda de sala).
   Onde ele está vem do servidor (proximo_exercicio); o navegador só lembra a última parada para animar o caminho. */
import { sessao } from '../estado.js';
import { criarOvo } from './ovo.js';

const MAX_PULOS = 8;

function chave() { return 'pq_ovo_parada_' + (sessao.usuario?.id ?? 'anonimo'); }
function lerParada() { try { return localStorage.getItem(chave()); } catch { return null; } }
function guardarParada(id) { try { localStorage.setItem(chave(), id); } catch { /* sem armazenamento: só não anima */ } }

function destino(trilha, dados) {
  if (dados.proximo_exercicio) return trilha.querySelector(`.no[data-parada="${CSS.escape(dados.proximo_exercicio)}"]`);
  const feitos = trilha.querySelectorAll('.no-concluido[data-parada]');
  return feitos[feitos.length - 1] || null;
}

/* Ponto onde o ovo "pisa": em cima do nó, centralizado. */
function ponto(trilha, alvo, avatar) {
  const t = trilha.getBoundingClientRect(), a = alvo.getBoundingClientRect();
  return { x: a.left - t.left + a.width / 2 - avatar.offsetWidth / 2, y: a.top - t.top - avatar.offsetHeight + 12 };
}

function pousar(avatar, p) { avatar.style.transform = `translate(${p.x}px, ${p.y}px)`; }

async function andar(trilha, avatar, caminho) {
  for (let i = 1; i < caminho.length; i++) {
    const de = ponto(trilha, caminho[i - 1], avatar), para = ponto(trilha, caminho[i], avatar);
    const topo = Math.min(de.y, para.y) - 34;
    caminho[i].scrollIntoView({ block: 'center', behavior: 'smooth' });
    const pulo = avatar.animate([
      { transform: `translate(${de.x}px, ${de.y}px)` },
      { transform: `translate(${(de.x + para.x) / 2}px, ${topo}px)`, offset: 0.5 },
      { transform: `translate(${para.x}px, ${para.y}px)` }
    ], { duration: caminho[i].classList.contains('porta') ? 520 : 320, easing: 'ease-in-out' });
    await pulo.finished;
    pousar(avatar, para);
    if (caminho[i].classList.contains('porta')) {
      caminho[i].classList.add('porta-passando');
      await new Promise(r => setTimeout(r, 250));
    }
  }
}

export function colocarAvatar(trilha, dados) {
  const alvo = destino(trilha, dados);
  if (!alvo) return;
  const avatar = document.createElement('div');
  avatar.className = 'avatar-ovo';
  avatar.setAttribute('aria-hidden', 'true');
  const corpo = document.createElement('div');
  corpo.className = 'avatar-corpo';
  corpo.append(criarOvo(dados.ovo.estagio, { animar: false, cor: sessao.usuario?.avatar, ninho: sessao.usuario?.ninho, casca: sessao.usuario?.casca }));
  avatar.append(corpo);
  trilha.append(avatar);

  const paradas = [...trilha.querySelectorAll('[data-parada]')];
  const fim = paradas.indexOf(alvo);
  const inicio = paradas.findIndex(p => p.dataset.parada === lerParada());
  guardarParada(alvo.dataset.parada);

  const semMovimento = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let andando = false;
  const reposicionar = () => { if (!andando) pousar(avatar, ponto(trilha, alvo, avatar)); };
  // fontes carregando, tela girando, balão abrindo: qualquer mudança de tamanho reposiciona o ovo
  const observador = new ResizeObserver(() => {
    if (!trilha.isConnected) { observador.disconnect(); return; }
    reposicionar();
  });
  observador.observe(trilha);

  if (semMovimento || inicio < 0 || inicio >= fim) {
    reposicionar();
    alvo.scrollIntoView({ block: 'center', behavior: semMovimento ? 'auto' : 'smooth' });
    return;
  }
  const caminho = paradas.slice(Math.max(inicio, fim - MAX_PULOS), fim + 1);
  pousar(avatar, ponto(trilha, caminho[0], avatar));
  caminho[0].scrollIntoView({ block: 'center' });
  avatar.classList.add('avatar-andando');
  andando = true;
  setTimeout(() => andar(trilha, avatar, caminho).finally(() => {
    andando = false;
    avatar.classList.remove('avatar-andando');
    reposicionar();
  }), 400);
}
