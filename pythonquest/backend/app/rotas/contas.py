"""Cadastro, login, logout e "quem sou eu"."""
from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db import obter_sessao
from app.esquemas.contas import Cadastro, Login, UsuarioPublico
from app.modelos import Matricula, Turma, Usuario
from app.servicos import senhas
from app.servicos.autenticacao import abrir_sessao, falhas_login, fechar_sessao, usuario_atual

rotas = APIRouter(prefix="/api/contas", tags=["contas"])


def publico(sessao: Session, usuario: Usuario) -> UsuarioPublico:
    turmas = sessao.scalars(select(Turma.nome).join(Matricula, Matricula.turma_id == Turma.id)
                            .where(Matricula.aluno_id == usuario.id)).all()
    return UsuarioPublico(id=usuario.id, nome=usuario.nome, email=usuario.email, papel=usuario.papel,
                          avatar=usuario.avatar, turmas=list(turmas))


@rotas.post("/cadastro", status_code=status.HTTP_201_CREATED)
def cadastrar(dados: Cadastro, resposta: Response, sessao: Session = Depends(obter_sessao)) -> UsuarioPublico:
    """Cria uma conta de ALUNO. Contas de professor só são criadas pelo comando app.criar_professor."""
    if sessao.scalar(select(Usuario).where(Usuario.email == dados.email)):
        raise HTTPException(status.HTTP_409_CONFLICT, "Já existe uma conta com esse e-mail.")
    turma = None
    if dados.codigo_turma:
        turma = sessao.scalar(select(Turma).where(Turma.codigo_convite == dados.codigo_turma))
        if turma is None:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Código de turma não encontrado. Confira com o professor.")
    usuario = Usuario(nome=dados.nome, email=dados.email, senha_hash=senhas.gerar_hash(dados.senha), papel="aluno")
    sessao.add(usuario)
    sessao.flush()
    if turma:
        sessao.add(Matricula(aluno_id=usuario.id, turma_id=turma.id))
    abrir_sessao(sessao, usuario, resposta)
    return publico(sessao, usuario)


@rotas.post("/entrar")
def entrar(dados: Login, request: Request, resposta: Response, sessao: Session = Depends(obter_sessao)) -> UsuarioPublico:
    email = dados.email.strip().lower()
    chave = f"{request.client.host if request.client else '?'}|{email}"
    if falhas_login.bloqueado(chave):
        raise HTTPException(status.HTTP_429_TOO_MANY_REQUESTS, "Muitas tentativas. Espere alguns minutos e tente de novo.")
    usuario = sessao.scalar(select(Usuario).where(Usuario.email == email))
    if usuario is None or not senhas.conferir(dados.senha, usuario.senha_hash):
        falhas_login.registrar(chave)
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "E-mail ou senha incorretos.")
    falhas_login.zerar(chave)
    abrir_sessao(sessao, usuario, resposta)
    return publico(sessao, usuario)


@rotas.post("/sair", status_code=status.HTTP_204_NO_CONTENT)
def sair(request: Request, resposta: Response, sessao: Session = Depends(obter_sessao)) -> None:
    fechar_sessao(sessao, request, resposta)


@rotas.get("/eu")
def eu(usuario: Usuario = Depends(usuario_atual), sessao: Session = Depends(obter_sessao)) -> UsuarioPublico:
    return publico(sessao, usuario)
