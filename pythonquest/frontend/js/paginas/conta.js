/* Entrar e criar conta. As regras (senha, e-mail repetido, código de turma) são conferidas no servidor;
   aqui só mostramos a mensagem que ele devolve. */
import { el, irPara } from '../util.js';
import { api } from '../api.js';
import { sessao } from '../estado.js';
import { criarOvo } from '../componentes/ovo.js';
import { layoutPublico } from '../componentes/layout.js';

function campo(rotulo, atributos, ajuda) {
  return el('label', { className: 'campo' }, rotulo, el('input', atributos), ajuda ? el('small', {}, ajuda) : null);
}

function formulario({ titulo, subtitulo, campos, botao, rodape, enviar }) {
  const erro = el('p', { className: 'aviso erro', role: 'alert', hidden: true });
  const botaoEnviar = el('button', { className: 'botao largo', type: 'submit' }, botao);
  const form = el('form', { className: 'form-conta', noValidate: false }, campos, erro, botaoEnviar);
  form.addEventListener('submit', async evento => {
    evento.preventDefault();
    erro.hidden = true;
    botaoEnviar.disabled = true;
    try {
      const usuario = await enviar(Object.fromEntries(new FormData(form)));
      sessao.definir(usuario);
      irPara(usuario.papel === 'professor' ? 'professor' : 'trilha');
    } catch (falha) {
      erro.textContent = falha.message;
      erro.hidden = false;
      form.classList.remove('tremer'); void form.offsetWidth; form.classList.add('tremer');
    } finally {
      botaoEnviar.disabled = false;
    }
  });
  return layoutPublico(el('section', { className: 'conta' },
    el('div', { className: 'conta-ovo', 'aria-hidden': 'true' }, criarOvo(0)),
    el('div', { className: 'cartao conta-cartao' },
      el('h1', {}, titulo), el('p', { className: 'conta-sub' }, subtitulo), form, el('p', { className: 'conta-rodape' }, rodape))));
}

export function paginaEntrar() {
  return formulario({
    titulo: 'Entrar', subtitulo: 'Continue sua jornada de onde parou.', botao: 'Entrar',
    campos: [
      campo('E-mail', { name: 'email', type: 'email', autocomplete: 'email', required: true }),
      campo('Senha', { name: 'senha', type: 'password', autocomplete: 'current-password', required: true })
    ],
    rodape: ['Ainda não tem conta? ', el('a', { href: '#cadastro' }, 'Criar conta')],
    enviar: dados => api.entrar(dados.email, dados.senha)
  });
}

export function paginaCadastro() {
  return formulario({
    titulo: 'Criar conta', subtitulo: 'Seu ovo está esperando.', botao: 'Criar conta',
    campos: [
      campo('Nome', { name: 'nome', autocomplete: 'name', required: true, minLength: 2, maxLength: 60 }),
      campo('E-mail', { name: 'email', type: 'email', autocomplete: 'email', required: true }),
      campo('Senha', { name: 'senha', type: 'password', autocomplete: 'new-password', required: true, minLength: 8 },
        'Pelo menos 8 caracteres.'),
      campo('Código da turma (opcional)', { name: 'codigo_turma', maxLength: 12, autocapitalize: 'characters' },
        'Se o seu professor passou um código, coloque aqui.')
    ],
    rodape: ['Já tem conta? ', el('a', { href: '#entrar' }, 'Entrar')],
    enviar: dados => api.cadastrar({ ...dados, codigo_turma: dados.codigo_turma || null })
  });
}
