from pydantic import BaseModel, Field, field_validator


class Cadastro(BaseModel):
    nome: str = Field(min_length=2, max_length=60)
    email: str = Field(max_length=254)
    senha: str = Field(min_length=8, max_length=128)
    codigo_turma: str | None = Field(default=None, max_length=12)

    @field_validator("nome")
    @classmethod
    def limpar_nome(cls, valor: str) -> str:
        valor = " ".join(valor.split())
        if len(valor) < 2:
            raise ValueError("O nome precisa ter pelo menos 2 letras.")
        return valor

    @field_validator("email")
    @classmethod
    def conferir_email(cls, valor: str) -> str:
        valor = valor.strip().lower()
        usuario, _, dominio = valor.partition("@")
        if not usuario or "." not in dominio or " " in valor:
            raise ValueError("E-mail inválido.")
        return valor

    @field_validator("codigo_turma")
    @classmethod
    def limpar_codigo(cls, valor: str | None) -> str | None:
        valor = (valor or "").strip().upper()
        return valor or None


class Login(BaseModel):
    email: str = Field(max_length=254)
    senha: str = Field(max_length=128)


class UsuarioPublico(BaseModel):
    id: int
    nome: str
    email: str
    papel: str
    avatar: str
    turmas: list[str] = []
