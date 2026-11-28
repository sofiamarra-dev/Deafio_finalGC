/* Ajudantes pequenos usados em várias páginas. */

/* Cria um elemento. Chaves com hífen (aria-*, data-*) viram atributos; "on..." vira evento; as outras, propriedades. */
export function el(tag, atributos = {}, ...filhos) {
  const elemento = document.createElement(tag);
  for (const [chave, valor] of Object.entries(atributos || {})) {
    if (valor === undefined || valor === null || valor === false) continue;
    if (chave.startsWith('on') && typeof valor === 'function') elemento.addEventListener(chave.slice(2), valor);
    else if (chave.includes('-')) elemento.setAttribute(chave, valor === true ? '' : valor);
    else elemento[chave] = valor;
  }
  elemento.append(...filhos.flat().filter(f => f !== null && f !== undefined && f !== false));
  return elemento;
}

/* Texto com blocos de código entre ``` e `código` em linha. Nunca usa innerHTML com texto do servidor. */
export function textoRico(texto) {
  const caixa = el('div', { className: 'texto-rico' });
  texto.split('```').forEach((parte, i) => {
    if (i % 2 === 1) {
      caixa.append(el('pre', { className: 'codigo-bloco' }, el('code', {}, parte.replace(/^\n|\n$/g, ''))));
      return;
    }
    parte.split(/\n{2,}|\n(?=\S)/).map(p => p.trim()).filter(Boolean).forEach(paragrafo => {
      const p = el('p');
      paragrafo.split(/(`[^`]+`)/).forEach(pedaco => {
        if (pedaco.startsWith('`') && pedaco.endsWith('`') && pedaco.length > 2) p.append(el('code', {}, pedaco.slice(1, -1)));
        else p.append(pedaco);
      });
      caixa.append(p);
    });
  });
  return caixa;
}

export const NOME_DIFICULDADE = { facil: 'Fácil', intermediario: 'Intermediário', avancado: 'Avançado' };
export const NOME_TIPO = {
  multipla_escolha: 'Múltipla escolha', completar: 'Completar código', montar: 'Montar o programa',
  achar_erro: 'Encontrar o erro', programa: 'Escrever programa'
};

export function irPara(rota) {
  if (location.hash === '#' + rota) window.dispatchEvent(new HashChangeEvent('hashchange'));
  else location.hash = rota;
}
