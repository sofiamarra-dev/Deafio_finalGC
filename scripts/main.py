import pygame
import sys

# Inicialização do Pygame
pygame.init()

# Configurações da Tela
LARGURA, ALTURA = 800, 600
TELA = pygame.display.set_mode((LARGURA, ALTURA))
pygame.display.set_caption("Fuga na Cozinha - Pygame Edition")

# Cores
BRANCO = (255, 255, 255)
CINZA_ESCURO = (40, 40, 40)
MARROM = (139, 69, 19)
AMARELO = (255, 215, 0)
VERDE = (46, 139, 87)

# Relógio para controle de FPS
relogio = pygame.time.Clock()
FPS = 60

# Configuração do Jogador (O Rato)
jogador_tamanho = 40
jogador_x = LARGURA // 2
jogador_y = ALTURA // 2
jogador_velocidade = 5

# Loop Principal do Jogo
rodando = True
while rodando:
    # 1. Tratamento de Eventos
    for evento in pygame.event.get():
        if evento.type == pygame.QUIT:
            rodando = False

    # 2. Captura de Teclas (Movimentação)
    teclas = pygame.key.get_pressed()
    if teclas[pygame.K_LEFT] or teclas[pygame.K_a]:
        jogador_x -= jogador_velocidade
    if teclas[pygame.K_RIGHT] or teclas[pygame.K_d]:
        jogador_x += jogador_velocidade
    if teclas[pygame.K_UP] or teclas[pygame.K_w]:
        jogador_y -= jogador_velocidade
    if teclas[pygame.K_DOWN] or teclas[pygame.K_s]:
        jogador_y += jogador_velocidade

    # Limites da tela
    jogador_x = max(0, min(LARGURA - jogador_tamanho, jogador_x))
    jogador_y = max(0, min(ALTURA - jogador_tamanho, jogador_y))

    # 3. Renderização / Desenho na Tela
    TELA.fill(CINZA_ESCURO)  # Cor de fundo (ambiente de cozinha/despensa)

    # Desenhar um obstáculo/bancada de exemplo
    bancada_rect = pygame.Rect(150, 100, 500, 80)
    pygame.draw.rect(TELA, MARROM, bancada_rect)

    # Desenhar o jogador (Rato)
    pygame.draw.rect(TELA, AMARELO, (jogador_x, jogador_y, jogador_tamanho, jogador_tamanho))

    # Instruções na tela
    fonte = pygame.font.SysFont(None, 24)
    texto = fonte.render("Use as setas ou W, A, S, D para mover o rato.", True, BRANCO)
    TELA.blit(texto, (20, 20))

    # Atualiza o display
    pygame.display.flip()

    # Controla os quadros por segundo
    relogio.tick(FPS)

pygame.quit()
sys.exit()