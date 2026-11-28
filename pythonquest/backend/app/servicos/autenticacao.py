"""Sessões de login e as dependências que protegem as rotas.
Toda rota que mexe com dados de alguém usa usuario_atual (ou exigir_professor): a interface esconder
um botão não protege nada; quem decide é o servidor."""
import hashlib
import secrets
import time
from collections import defaultdict, deque
from datetime import timedelta

from fastapi import Depends, HTTPException, Request, Response, status
from sqlalchemy import delete
from sqlalchemy.orm import Session

from app.config import obter_configuracao
from app.db import obter_sessao
from app.modelos import Sessao, Usuario
from app.modelos.tempo import agora

COOKIE = "pq_sessao"


def _hash_token(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()


def abrir_sessao(sessao: Session, usuario: Usuario, resposta: Response) -> None:
    config = obter_configuracao()
    token = secrets.token_urlsafe(32)
    sessao.add(Sessao(token_hash=_hash_token(token), usuario_id=usuario.id,
                      expira_em=agora() + timedelta(days=config.dias_sessao)))
    usuario.ultimo_acesso_em = agora()
    sessao.commit()
    resposta.set_cookie(COOKIE, token, max_age=config.dias_sessao * 86400, httponly=True, samesite="lax",
                        secure=config.ambiente == "producao", path="/")


def fechar_sessao(sessao: Session, request: Request, resposta: Response) -> None:
    token = request.cookies.get(COOKIE)
    if token:
        sessao.execute(delete(Sessao).where(Sessao.token_hash == _hash_token(token)))
        sessao.commit()
    resposta.delete_cookie(COOKIE, path="/")


def usuario_opcional(request: Request, sessao: Session = Depends(obter_sessao)) -> Usuario | None:
    token = request.cookies.get(COOKIE)
    if not token:
        return None
    registro = sessao.get(Sessao, _hash_token(token))
    if registro is None or registro.expira_em < agora():
        return None
    return sessao.get(Usuario, registro.usuario_id)


def usuario_atual(usuario: Usuario | None = Depends(usuario_opcional)) -> Usuario:
    if usuario is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Entre na sua conta para continuar.")
    return usuario


def exigir_aluno(usuario: Usuario = Depends(usuario_atual)) -> Usuario:
    if usuario.papel != "aluno":
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Esta área é dos alunos.")
    return usuario


def exigir_professor(usuario: Usuario = Depends(usuario_atual)) -> Usuario:
    if usuario.papel != "professor":
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Esta área é dos professores.")
    return usuario


class LimiteDeTentativas:
    """Conta eventos por chave numa janela de tempo (em memória; serve para um servidor só)."""

    def __init__(self, maximo: int, janela_s: int):
        self.maximo, self.janela_s = maximo, janela_s
        self._eventos: dict[str, deque] = defaultdict(deque)

    def _limpar(self, chave: str) -> deque:
        fila, limite = self._eventos[chave], time.monotonic() - self.janela_s
        while fila and fila[0] < limite:
            fila.popleft()
        return fila

    def bloqueado(self, chave: str) -> bool:
        return len(self._limpar(chave)) >= self.maximo

    def registrar(self, chave: str) -> None:
        self._limpar(chave).append(time.monotonic())

    def zerar(self, chave: str) -> None:
        self._eventos.pop(chave, None)


falhas_login = LimiteDeTentativas(maximo=8, janela_s=15 * 60)
