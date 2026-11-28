/* Único lugar que fala com o servidor. As páginas chamam estas funções e nunca usam fetch direto. */

async function pedir(caminho, opcoes = {}) {
  const resposta = await fetch('/api' + caminho, {
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json', ...(opcoes.headers || {}) },
    ...opcoes
  });
  if (!resposta.ok) {
    const erro = new Error('O servidor respondeu ' + resposta.status);
    erro.status = resposta.status;
    throw erro;
  }
  return resposta.json();
}

export const api = {
  saude: () => pedir('/saude')
};
