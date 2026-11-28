"""Cria uma conta de professor e uma turma com código de convite.

    python -m app.criar_professor --nome "Ana Souza" --email ana@escola.br --turma "Turma A"

A senha é pedida no terminal (não aparece na tela nem fica no histórico)."""
import argparse
import getpass
import secrets

from sqlalchemy import select

from app.db import FabricaSessao
from app.modelos import Turma, Usuario
from app.servicos import senhas

LETRAS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"  # sem 0/O e 1/I, que confundem


def gerar_codigo() -> str:
    return "".join(secrets.choice(LETRAS) for _ in range(6))


def main() -> None:
    argumentos = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    argumentos.add_argument("--nome", required=True)
    argumentos.add_argument("--email", required=True)
    argumentos.add_argument("--turma", help="nome da turma a criar (opcional)")
    opcoes = argumentos.parse_args()

    with FabricaSessao() as sessao:
        email = opcoes.email.strip().lower()
        professor = sessao.scalar(select(Usuario).where(Usuario.email == email))
        if professor is None:
            senha = getpass.getpass("Senha do professor (mínimo 8 caracteres): ")
            if len(senha) < 8:
                raise SystemExit("A senha precisa ter pelo menos 8 caracteres.")
            professor = Usuario(nome=opcoes.nome.strip(), email=email, senha_hash=senhas.gerar_hash(senha),
                                papel="professor")
            sessao.add(professor)
            sessao.flush()
            print(f"Professor criado: {professor.nome} <{email}>")
        elif professor.papel != "professor":
            raise SystemExit("Esse e-mail já pertence a um aluno.")
        if opcoes.turma:
            codigo = gerar_codigo()
            while sessao.scalar(select(Turma).where(Turma.codigo_convite == codigo)):
                codigo = gerar_codigo()
            sessao.add(Turma(nome=opcoes.turma.strip(), codigo_convite=codigo, professor_id=professor.id))
            print(f"Turma '{opcoes.turma}' criada. Código de convite para os alunos: {codigo}")
        sessao.commit()


if __name__ == "__main__":
    main()
