"""Abrir um exercício, pedir dica e enviar resposta. O servidor confere o desbloqueio em todas as rotas."""
import random
from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.config import obter_configuracao
from app.correcao.corretor import RespostaInvalida, corrigir
from app.correcao.sandbox import CorretorIndisponivel
from app.db import obter_sessao
from app.modelos import (Abertura, Alternativa, CasoTeste, DicaVista, Envio, Exercicio, ProgressoExercicio,
                         ResultadoTeste, Usuario)
from app.modelos.tempo import agora
from app.servicos.autenticacao import LimiteDeTentativas, exigir_aluno
from app.servicos.criatura import ESPECIES, fixar_se_eclodiu
from app.servicos.jogador import calcular_xp, nivel_de, resumo_jogador, xp_total
from app.servicos.progressao import (estado_do_exercicio, estagio_do_ovo, proximo_exercicio,
                                     registrar_conclusao_do_modulo)

rotas = APIRouter(prefix="/api/exercicios", tags=["exercícios"])
TEMPO_MAXIMO_MS = 30 * 60 * 1000  # aba esquecida aberta não distorce o tempo de resolução
ERROS_PARA_EXPLICACAO = 2         # a explicação completa aparece a partir do 2º erro
limite_envios = LimiteDeTentativas(maximo=obter_configuracao().envios_por_minuto, janela_s=60)


def _carregar(sessao: Session, aluno: Usuario, exercicio_id: str) -> tuple[Exercicio, str]:
    exercicio = sessao.get(Exercicio, exercicio_id)
    estado = estado_do_exercicio(sessao, aluno.id, exercicio_id) if exercicio else None
    if exercicio is None or estado is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Exercício não encontrado.")
    if estado == "bloqueado":
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Este exercício ainda está bloqueado. Conclua os anteriores.")
    return exercicio, estado


def _dicas_vistas(sessao: Session, aluno_id: int, exercicio_id: str) -> int:
    return sessao.scalar(select(func.count()).select_from(DicaVista).where(
        DicaVista.aluno_id == aluno_id, DicaVista.exercicio_id == exercicio_id)) or 0


def _blocos(exercicio) -> list[str]:
    """No tipo montar, as peças guardadas estão na ordem da solução: embaralha antes de mandar."""
    if exercicio.tipo != "montar":
        return exercicio.blocos
    pecas = list(exercicio.blocos)
    for _ in range(10):
        random.shuffle(pecas)
        if pecas != exercicio.blocos:
            break
    return pecas


@rotas.get("/{exercicio_id}")
def abrir(exercicio_id: str, aluno: Usuario = Depends(exigir_aluno), sessao: Session = Depends(obter_sessao)) -> dict:
    exercicio, estado = _carregar(sessao, aluno, exercicio_id)
    abertura = Abertura(aluno_id=aluno.id, exercicio_id=exercicio.id)
    sessao.add(abertura)
    sessao.commit()
    casos = sessao.scalars(select(CasoTeste).where(CasoTeste.exercicio_id == exercicio.id)
                           .order_by(CasoTeste.ordem)).all()
    alternativas = sessao.scalars(select(Alternativa).where(Alternativa.exercicio_id == exercicio.id)
                                  .order_by(Alternativa.ordem)).all()
    vistas = _dicas_vistas(sessao, aluno.id, exercicio.id)
    return {
        "id": exercicio.id, "modulo_id": exercicio.modulo_id, "titulo": exercicio.titulo,
        "dificuldade": exercicio.dificuldade, "tipo": exercicio.tipo, "desafio_final": exercicio.eh_desafio_final,
        "enunciado": exercicio.enunciado, "codigo_inicial": exercicio.codigo_inicial, "blocos": _blocos(exercicio),
        "modo_teste": exercicio.modo_teste, "funcao": exercicio.funcao, "variavel": exercicio.variavel,
        # Só os casos visíveis (exemplos) saem do servidor; os escondidos ficam aqui.
        "exemplos": [{"entrada": c.entrada, "saida": c.saida_esperada} for c in casos if c.visivel],
        "casos_escondidos": sum(not c.visivel for c in casos),
        "alternativas": [{"id": a.id, "texto": a.texto} for a in alternativas],
        "dicas": exercicio.dicas[:vistas], "total_dicas": len(exercicio.dicas),
        "concluido": estado == "concluido", "abertura_id": abertura.id,
    }


@rotas.post("/{exercicio_id}/dicas")
def pedir_dica(exercicio_id: str, aluno: Usuario = Depends(exigir_aluno), sessao: Session = Depends(obter_sessao)) -> dict:
    exercicio, _ = _carregar(sessao, aluno, exercicio_id)
    vistas = _dicas_vistas(sessao, aluno.id, exercicio.id)
    if vistas >= len(exercicio.dicas):
        raise HTTPException(status.HTTP_409_CONFLICT, "Você já viu todas as dicas deste exercício.")
    sessao.add(DicaVista(aluno_id=aluno.id, exercicio_id=exercicio.id, indice=vistas))
    sessao.commit()
    return {"indice": vistas, "texto": exercicio.dicas[vistas], "restantes": len(exercicio.dicas) - vistas - 1}


class NovoEnvio(BaseModel):
    resposta: str = Field(max_length=20_000)
    abertura_id: int | None = None


@rotas.post("/{exercicio_id}/envios")
def enviar(exercicio_id: str, dados: NovoEnvio, aluno: Usuario = Depends(exigir_aluno),
           sessao: Session = Depends(obter_sessao)) -> dict:
    exercicio, estado = _carregar(sessao, aluno, exercicio_id)
    chave = str(aluno.id)
    if limite_envios.bloqueado(chave):
        raise HTTPException(status.HTTP_429_TOO_MANY_REQUESTS, "Muitos envios em pouco tempo. Respire e tente em um minuto.")
    limite_envios.registrar(chave)

    casos = sessao.scalars(select(CasoTeste).where(CasoTeste.exercicio_id == exercicio.id)
                           .order_by(CasoTeste.ordem)).all()
    alternativas = sessao.scalars(select(Alternativa).where(Alternativa.exercicio_id == exercicio.id)).all()
    try:
        resultado = corrigir(exercicio, casos, alternativas, dados.resposta)
    except RespostaInvalida as erro:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_CONTENT, str(erro)) from erro
    except CorretorIndisponivel as erro:
        raise HTTPException(status.HTTP_503_SERVICE_UNAVAILABLE,
                            "O corretor está fora do ar agora (o Docker está aberto?). Seu envio não foi contado.") from erro

    abertura = sessao.get(Abertura, dados.abertura_id) if dados.abertura_id else None
    if abertura and (abertura.aluno_id != aluno.id or abertura.exercicio_id != exercicio.id):
        abertura = None
    duracao = None
    if abertura:
        duracao = min(int((agora() - abertura.aberto_em) / timedelta(milliseconds=1)), TEMPO_MAXIMO_MS)

    envio = Envio(aluno_id=aluno.id, exercicio_id=exercicio.id, abertura_id=abertura.id if abertura else None,
                  resposta=dados.resposta, correto=resultado.correto, testes_passados=resultado.passados,
                  testes_total=resultado.total, tipo_erro=resultado.tipo_erro, duracao_ms=duracao,
                  dicas_vistas=_dicas_vistas(sessao, aluno.id, exercicio.id))
    sessao.add(envio)
    sessao.flush()
    for caso in resultado.casos:
        sessao.add(ResultadoTeste(envio_id=envio.id, caso_ordem=caso.ordem, passou=caso.passou,
                                  saida_obtida=caso.obtido[:2048]))

    progresso = sessao.scalar(select(ProgressoExercicio).where(
        ProgressoExercicio.aluno_id == aluno.id, ProgressoExercicio.exercicio_id == exercicio.id))
    if progresso is None:
        progresso = ProgressoExercicio(aluno_id=aluno.id, exercicio_id=exercicio.id, tentativas=0)
        sessao.add(progresso)
    progresso.tentativas += 1
    primeira_conclusao = resultado.correto and progresso.concluido_em is None
    if primeira_conclusao:
        progresso.concluido_em = agora()
        progresso.tentativas_ate_acertar = progresso.tentativas
    sessao.flush()

    ovo_antes = estagio_do_ovo(sessao, aluno.id)
    nivel_antes = nivel_de(xp_total(sessao, aluno.id))
    modulo_concluido = primeira_conclusao and registrar_conclusao_do_modulo(sessao, aluno.id, exercicio.modulo_id)
    if modulo_concluido:
        sessao.flush()
        fixar_se_eclodiu(sessao, aluno)
    ganho = None
    if primeira_conclusao:
        ganho = calcular_xp(exercicio.xp_base, progresso.tentativas, envio.dicas_vistas, modulo_concluido)
        envio.xp_ganho = ganho.total
    sessao.commit()
    jogador = resumo_jogador(sessao, aluno.id)

    erros_ate_agora = progresso.tentativas - (1 if resultado.correto else 0)
    explicacao = ""
    if not resultado.correto:
        explicacao = resultado.alternativa_explicacao or (
            exercicio.explicacao if erros_ate_agora >= ERROS_PARA_EXPLICACAO else "")
    return {
        "correto": resultado.correto, "passados": resultado.passados, "total": resultado.total,
        "mensagem": resultado.mensagem, "tipo_erro": resultado.tipo_erro,
        "casos": [c.__dict__ for c in resultado.casos],
        "explicacao": explicacao if not resultado.correto else (resultado.alternativa_explicacao or exercicio.explicacao),
        "explicacao_em": None if explicacao or resultado.correto else ERROS_PARA_EXPLICACAO - erros_ate_agora,
        "tentativas": progresso.tentativas, "primeira_conclusao": primeira_conclusao,
        "modulo_concluido": modulo_concluido,
        "ovo": {"de": ovo_antes, "para": estagio_do_ovo(sessao, aluno.id)},
        "proximo_exercicio": proximo_exercicio(sessao, aluno.id),
        "xp": {"ganho": ganho.total if ganho else 0, "partes": ganho.partes if ganho else [],
               "nivel_antes": nivel_antes, "subiu_de_nivel": jogador["nivel"] > nivel_antes},
        "jogador": jogador,
        "criatura": {"especie": aluno.criatura, **ESPECIES[aluno.criatura]} if modulo_concluido and aluno.criatura else None,
    }
