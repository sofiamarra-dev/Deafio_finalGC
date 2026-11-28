"""Hash de senha com scrypt (biblioteca padrão do Python, sem dependência extra).
Formato guardado: scrypt$n$r$p$sal_hex$hash_hex."""
import hashlib
import hmac
import secrets

N, R, P = 2**14, 8, 1


def gerar_hash(senha: str) -> str:
    sal = secrets.token_bytes(16)
    chave = hashlib.scrypt(senha.encode(), salt=sal, n=N, r=R, p=P, dklen=32)
    return f"scrypt${N}${R}${P}${sal.hex()}${chave.hex()}"


def conferir(senha: str, guardado: str) -> bool:
    try:
        _, n, r, p, sal, esperado = guardado.split("$")
        chave = hashlib.scrypt(senha.encode(), salt=bytes.fromhex(sal), n=int(n), r=int(r), p=int(p), dklen=32)
    except (ValueError, TypeError):
        return False
    return hmac.compare_digest(chave.hex(), esperado)
