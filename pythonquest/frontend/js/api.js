/* Único lugar que fala com o servidor. As páginas chamam estas funções e nunca usam fetch direto. */

export class ErroApi extends Error {
  constructor(status, mensagem) { super(mensagem); this.status = status; }
}

async function pedir(caminho, { metodo = 'GET', corpo } = {}) {
  let resposta;
  try {
    resposta = await fetch('/api' + caminho, {
      method: metodo,
      credentials: 'same-origin',
      headers: corpo === undefined ? {} : { 'Content-Type': 'application/json' },
      body: corpo === undefined ? undefined : JSON.stringify(corpo)
    });
  } catch {
    throw new ErroApi(0, 'Sem conexão com o servidor. Ele está ligado?');
  }
  if (resposta.status === 204) return null;
  const dados = await resposta.json().catch(() => ({}));
  if (!resposta.ok) throw new ErroApi(resposta.status, mensagemDeErro(dados, resposta.status));
  return dados;
}

/* O FastAPI devolve { detail: "texto" } ou, em erro de validação, { detail: [{ msg }] }. */
function mensagemDeErro(dados, status) {
  if (typeof dados.detail === 'string') return dados.detail;
  if (Array.isArray(dados.detail) && dados.detail.length) {
    return dados.detail.map(d => String(d.msg || '').replace(/^Value error, /, '')).join(' ');
  }
  if (status >= 500) return 'Erro no servidor. Veja a mensagem no terminal onde o servidor (uvicorn) está rodando.';
  return 'Algo deu errado. Tente de novo.';
}

export const api = {
  saude: () => pedir('/saude'),
  eu: () => pedir('/contas/eu'),
  entrar: (email, senha) => pedir('/contas/entrar', { metodo: 'POST', corpo: { email, senha } }),
  cadastrar: dados => pedir('/contas/cadastro', { metodo: 'POST', corpo: dados }),
  sair: () => pedir('/contas/sair', { metodo: 'POST' }),
  trilha: () => pedir('/trilha'),
  perfil: () => pedir('/perfil'),
  perfilDe: id => pedir(`/perfil/${encodeURIComponent(id)}`),
  editarPerfil: dados => pedir('/perfil', { metodo: 'PATCH', corpo: dados }),
  ranking: escopo => pedir(`/ranking?escopo=${encodeURIComponent(escopo)}`),
  turmasDoProfessor: () => pedir('/professor/turmas'),
  criarTurma: nome => pedir('/professor/turmas', { metodo: 'POST', corpo: { nome } }),
  guia: moduloId => pedir(`/modulos/${encodeURIComponent(moduloId)}/guia`),
  exercicio: id => pedir(`/exercicios/${encodeURIComponent(id)}`),
  dica: id => pedir(`/exercicios/${encodeURIComponent(id)}/dicas`, { metodo: 'POST' }),
  enviar: (id, resposta, aberturaId) =>
    pedir(`/exercicios/${encodeURIComponent(id)}/envios`, { metodo: 'POST', corpo: { resposta, abertura_id: aberturaId } })
};
