/**
 * Minigames - Flappy Bird Narrativo
 * Minigame simples de voo com vassoura
 */

import { estadoGlobal } from '../core/stateManager.js';
import { audioGlobal } from '../core/audioManager.js';
import { dialogoGlobal } from '../core/dialogueManager.js';

export class FlappyBirdGame {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.animationId = null;

    // Estado do jogo
    this.jogando = false;
    this.score = 0;
    this.scoreMinimoParaPassar = 8;

    // Vassura (jogador)
    this.vassoura = {
      x: 100,
      y: 0,
      largura: 40,
      altura: 60,
      velocidadeY: 0,
      gravidade: 0.5,
      forcaPulo: -8
    };

    // Obstáculos
    this.obstaculos = [];
    this.distanciaObstaculos = 250;
    this.larguraObstaculo = 60;
    this.espacoPassagem = 180;
    this.velocidadeObstaculos = 3;

    // Controles
    this.teclasPressionadas = new Set();
  }

  /**
   * Inicializa o jogo
   */
  inicializar() {
    this.canvas = document.getElementById('game-canvas');
    this.overlay = document.getElementById('game-overlay');
    this.botaoIniciar = document.getElementById('btn-iniciar-voo');

    if (!this.canvas) {
      console.error('Canvas do jogo não encontrado');
      return;
    }

    this.ctx = this.canvas.getContext('2d');

    // Ajusta tamanho do canvas
    this.canvas.width = 600;
    this.canvas.height = 600;

    // Event listeners
    this.botaoIniciar.addEventListener('click', () => this.iniciarJogo());

    // Controles
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && this.jogando) {
        e.preventDefault();
        this.pular();
      }
    });

    // Touch/Click para mobile
    this.canvas.addEventListener('click', () => {
      if (this.jogando) {
        this.pular();
      }
    });

    this.canvas.addEventListener('touchstart', (e) => {
      if (this.jogando) {
        e.preventDefault();
        this.pular();
      }
    });
  }

  /**
   * Inicia o jogo
   */
  iniciarJogo() {
    this.resetar();
    this.jogando = true;

    // Esconde overlay
    this.overlay.classList.add('escondido');

    // Inicia loop
    this.loop();
  }

  /**
   * Reseta estado do jogo
   */
  resetar() {
    this.score = 0;
    this.vassoura.y = this.canvas.height / 2;
    this.vassoura.velocidadeY = 0;
    this.obstaculos = [];

    // Cria obstáculos iniciais
    for (let i = 0; i < 3; i++) {
      this.criarObstaculo(this.canvas.width + i * this.distanciaObstaculos);
    }
  }

  /**
   * Cria obstáculo
   */
  criarObstaculo(x) {
    const alturaMinima = 50;
    const alturaMaxima = this.canvas.height - this.espacoPassagem - alturaMinima;

    const alturaSuperior = Math.random() * (alturaMaxima - alturaMinima) + alturaMinima;

    this.obstaculos.push({
      x: x,
      alturaSuperior: alturaSuperior,
      alturaInferior: this.canvas.height - alturaSuperior - this.espacoPassagem,
      passou: false
    });
  }

  /**
   * Pular
   */
  pular() {
    this.vassoura.velocidadeY = this.vassoura.forcaPulo;
    audioGlobal.tocarSFX('whoosh');
  }

  /**
   * Atualiza física
   */
  atualizar() {
    // Atualiza vassoura
    this.vassoura.velocidadeY += this.vassoura.gravidade;
    this.vassoura.y += this.vassoura.velocidadeY;

    // Limita no topo e fundo
    if (this.vassoura.y < 0) {
      this.vassoura.y = 0;
      this.vassoura.velocidadeY = 0;
    }

    if (this.vassoura.y + this.vassoura.altura > this.canvas.height) {
      this.gameOver();
      return;
    }

    // Atualiza obstáculos
    this.obstaculos.forEach(obs => {
      obs.x -= this.velocidadeObstaculos;

      // Verifica se passou
      if (!obs.passou && obs.x + this.larguraObstaculo < this.vassoura.x) {
        obs.passou = true;
        this.score++;
        audioGlobal.tocarSFX('progresso');

        // Verifica se atingiu score mínimo
        if (this.score >= this.scoreMinimoParaPassar) {
          this.venceu();
          return;
        }
      }

      // Verifica colisão
      if (this.verificarColisao(obs)) {
        this.gameOver();
        return;
      }
    });

    // Remove obstáculos que saíram da tela
    this.obstaculos = this.obstaculos.filter(obs => obs.x + this.larguraObstaculo > 0);

    // Cria novos obstáculos
    const ultimoObstaculo = this.obstaculos[this.obstaculos.length - 1];
    if (ultimoObstaculo && ultimoObstaculo.x < this.canvas.width - this.distanciaObstaculos) {
      this.criarObstaculo(this.canvas.width);
    }
  }

  /**
   * Verifica colisão
   */
  verificarColisao(obs) {
    // Verifica se está dentro do X do obstáculo
    if (this.vassoura.x + this.vassoura.largura > obs.x &&
        this.vassoura.x < obs.x + this.larguraObstaculo) {

      // Verifica se colidiu com parte superior ou inferior
      if (this.vassoura.y < obs.alturaSuperior ||
          this.vassoura.y + this.vassoura.altura > this.canvas.height - obs.alturaInferior) {
        return true;
      }
    }

    return false;
  }

  /**
   * Desenha tudo
   */
  desenhar() {
    // Limpa canvas
    this.ctx.fillStyle = '#1a1a2e';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Desenha vassoura (retângulo simples)
    this.ctx.fillStyle = '#8b4513';
    this.ctx.fillRect(
      this.vassoura.x,
      this.vassoura.y,
      this.vassoura.largura,
      this.vassoura.altura
    );

    // Desenha obstáculos (sombras/torres)
    this.ctx.fillStyle = '#2a2a3e';
    this.obstaculos.forEach(obs => {
      // Parte superior
      this.ctx.fillRect(obs.x, 0, this.larguraObstaculo, obs.alturaSuperior);

      // Parte inferior
      this.ctx.fillRect(
        obs.x,
        this.canvas.height - obs.alturaInferior,
        this.larguraObstaculo,
        obs.alturaInferior
      );

      // Borda dos obstáculos
      this.ctx.strokeStyle = '#646cff';
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(obs.x, 0, this.larguraObstaculo, obs.alturaSuperior);
      this.ctx.strokeRect(
        obs.x,
        this.canvas.height - obs.alturaInferior,
        this.larguraObstaculo,
        obs.alturaInferior
      );
    });

    // Desenha score (OCULTO - apenas para debug)
    // Não mostramos o score para o usuário
    if (estadoGlobal.obter('modoDebug')) {
      this.ctx.fillStyle = '#e8e8f0';
      this.ctx.font = '20px monospace';
      this.ctx.fillText(`Score: ${this.score} / ${this.scoreMinimoParaPassar}`, 10, 30);
    }
  }

  /**
   * Loop do jogo
   */
  loop() {
    if (!this.jogando) return;

    this.atualizar();
    this.desenhar();

    this.animationId = requestAnimationFrame(() => this.loop());
  }

  /**
   * Game Over
   */
  gameOver() {
    this.jogando = false;
    audioGlobal.tocarSFX('erro');

    cancelAnimationFrame(this.animationId);

    // Mostra mensagem
    dialogoGlobal.exibir('Nem todo voo é perfeito.', {
      comAudio: true,
      callback: () => {
        dialogoGlobal.exibir('Respire. Tente outra vez.', {
          comAudio: true,
          callback: () => {
            // Mostra overlay novamente
            this.overlay.classList.remove('escondido');
          }
        });
      }
    });
  }

  /**
   * Venceu!
   */
  venceu() {
    this.jogando = false;
    audioGlobal.tocarSFX('sucesso');

    cancelAnimationFrame(this.animationId);

    estadoGlobal.concluirDesafio('voo');
    estadoGlobal.salvarResposta('voo', this.score);

    dialogoGlobal.exibir('Você se manteve.', {
      comAudio: true,
      callback: () => {
        dialogoGlobal.exibir('Isso basta.', {
          comAudio: true,
          callback: () => {
            estadoGlobal.desbloquearScroll();
            this.overlay.classList.remove('escondido');
            this.overlay.querySelector('p').textContent = 'Desafio concluído!';
            this.botaoIniciar.style.display = 'none';
          }
        });
      }
    });
  }

  /**
   * Para o jogo
   */
  parar() {
    this.jogando = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}

// Exporta classe
export const flappyBirdGlobal = new FlappyBirdGame();
