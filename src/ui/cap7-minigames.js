/**
 * Cap 7 - Minigames (Lumos, Protego, Maze Runner)
 * Desafios progressivos do Capítulo 7 - Sombra e Luz
 */

import { estadoGlobal } from '../core/stateManager.js';
import { audioGlobal } from '../core/audioManager.js';
import { dialogoGlobal } from '../core/dialogueManager.js';

export class Cap7Minigames {
  constructor() {
    this.lumosSequence = [];
    this.lumosPlayerSequence = [];
    this.lumosLevel = 1;
    this.lumosPlaying = false;

    this.protegoCount = 0;
    this.protegoTotal = 10;
    this.protegoActive = false;
    this.protegoCanDefend = false;
    this.protegoDefendido = false;
    this.protegoAttackTimeout = null;

    this.mazeInterval = null;
    this.mazeTime = 0;
    this.mazeDementor = { x: 0, y: 0 };
  }

  /**
   * Inicializa todos os minigames do Cap 7
   */
  inicializar() {
    this.inicializarLumos();
    this.inicializarProtego();
    this.inicializarMaze();
    this.inicializarAvadaKedavra();
  }

  /**
   * LUMOS MÁXIMA - Simon Says com luzes (3x3 grid)
   */
  inicializarLumos() {
    const grid = document.querySelector('#lumos-grid');
    const btnStart = document.querySelector('#btn-start-lumos');
    const nivelSpan = document.querySelector('#lumos-nivel');

    if (!grid || !btnStart) return;

    // Criar 9 botões de luz
    for (let i = 0; i < 9; i++) {
      const light = document.createElement('div');
      light.className = 'lumos-light';
      light.dataset.index = i;
      grid.appendChild(light);

      light.addEventListener('click', () => {
        if (!this.lumosPlaying) return;
        this.handleLumosClick(i);
      });
    }

    btnStart.addEventListener('click', () => {
      this.startLumos();
    });
  }

  startLumos() {
    this.lumosLevel = 1;
    this.playLumosRound();
  }

  playLumosRound() {
    const nivelSpan = document.querySelector('#lumos-nivel');
    const btnStart = document.querySelector('#btn-start-lumos');

    nivelSpan.textContent = this.lumosLevel;
    btnStart.disabled = true;
    this.lumosPlaying = false;
    this.lumosPlayerSequence = [];

    // Gera sequência (nível + 2 luzes)
    this.lumosSequence = [];
    const sequenceLength = this.lumosLevel + 2;
    for (let i = 0; i < sequenceLength; i++) {
      this.lumosSequence.push(Math.floor(Math.random() * 9));
    }

    // Mostra sequência
    this.showLumosSequence();
  }

  async showLumosSequence() {
    await this.delay(800);

    for (const index of this.lumosSequence) {
      const light = document.querySelector(`.lumos-light[data-index="${index}"]`);
      light.classList.add('active');
      audioGlobal.tocarSFX('luz');
      await this.delay(600);
      light.classList.remove('active');
      await this.delay(300);
    }

    this.lumosPlaying = true;
  }

  handleLumosClick(index) {
    this.lumosPlayerSequence.push(index);

    // Feedback visual
    const light = document.querySelector(`.lumos-light[data-index="${index}"]`);
    light.classList.add('active');
    setTimeout(() => light.classList.remove('active'), 300);

    // Verifica se está correto até agora
    const currentIndex = this.lumosPlayerSequence.length - 1;
    if (this.lumosPlayerSequence[currentIndex] !== this.lumosSequence[currentIndex]) {
      // Errou
      audioGlobal.tocarSFX('erro');
      this.lumosPlaying = false;
      dialogoGlobal.exibir('Tente novamente. Memorize a sequência com atenção.', {
        comAudio: true,
        callback: () => {
          this.playLumosRound();
        }
      });
      return;
    }

    // Completou a sequência corretamente
    if (this.lumosPlayerSequence.length === this.lumosSequence.length) {
      audioGlobal.tocarSFX('sucesso');
      this.lumosPlaying = false;

      if (this.lumosLevel >= 5) {
        // Completou todos os níveis
        dialogoGlobal.exibir('Lumos Máxima! A luz afasta as sombras.', {
          comAudio: true,
          callback: () => {
            estadoGlobal.concluirDesafio('lumos');
            estadoGlobal.desbloquearScroll();
          }
        });
      } else {
        // Próximo nível
        this.lumosLevel++;
        setTimeout(() => this.playLumosRound(), 1000);
      }
    }
  }

  /**
   * PROTEGO - Timing-based defense
   */
  inicializarProtego() {
    const btnProtego = document.querySelector('#btn-protego');
    const btnStart = document.querySelector('#btn-start-protego');
    const jogador = document.querySelector('#protego-jogador');

    if (!btnProtego || !btnStart) return;

    btnStart.addEventListener('click', () => {
      this.startProtego();
    });

    btnProtego.addEventListener('click', () => {
      if (!this.protegoActive) return;
      this.defenderAtaque();
    });
  }

  startProtego() {
    this.protegoCount = 0;
    this.protegoActive = true;
    const btnStart = document.querySelector('#btn-start-protego');
    const btnProtego = document.querySelector('#btn-protego');
    const counter = document.querySelector('#protego-bloqueados');

    btnStart.style.display = 'none';
    btnProtego.disabled = false;
    counter.textContent = '0';

    this.lancarAtaque();
  }

  lancarAtaque() {
    if (this.protegoCount >= this.protegoTotal) {
      this.finalizarProtego();
      return;
    }

    const ataque = document.querySelector('#protego-ataque');
    ataque.style.display = 'block';
    ataque.classList.remove('bloqueado');
    ataque.style.animation = 'none';

    // Force reflow
    void ataque.offsetWidth;
    ataque.style.animation = 'ataqueDescendo 2.5s linear';

    // Janela de defesa: 0.5s até 2.0s (1.5s de janela, muito mais generosa)
    this.protegoCanDefend = false;
    this.protegoDefendido = false; // Flag para saber se defendeu

    // Inicia janela de defesa após 0.5s
    setTimeout(() => {
      this.protegoCanDefend = true;
    }, 500);

    // Fecha janela de defesa após 2.0s
    setTimeout(() => {
      this.protegoCanDefend = false;
    }, 2000);

    // Verifica se falhou (após animação completa de 2.5s)
    this.protegoAttackTimeout = setTimeout(() => {
      // Se não defendeu ainda, falhou
      if (!this.protegoDefendido && this.protegoActive) {
        this.protegoActive = false; // Para o jogo
        audioGlobal.tocarSFX('erro');
        ataque.style.display = 'none';

        dialogoGlobal.exibir('O ataque te atingiu! Tente novamente.', {
          comAudio: true,
          callback: () => {
            // Só reinicia DEPOIS do usuário clicar em Continuar
            this.startProtego();
          }
        });
      }
    }, 2500);
  }

  defenderAtaque() {
    if (!this.protegoCanDefend) {
      // Clicou cedo ou tarde demais - não faz nada
      return;
    }

    // Marca que defendeu com sucesso
    this.protegoDefendido = true;
    this.protegoCanDefend = false; // Fecha janela (não pode defender novamente)

    // Cancela timeout de falha
    if (this.protegoAttackTimeout) {
      clearTimeout(this.protegoAttackTimeout);
      this.protegoAttackTimeout = null;
    }

    const ataque = document.querySelector('#protego-ataque');
    const jogador = document.querySelector('#protego-jogador');
    const counter = document.querySelector('#protego-bloqueados');

    ataque.classList.add('bloqueado');
    jogador.classList.add('defendendo');
    audioGlobal.tocarSFX('sucesso');

    setTimeout(() => {
      jogador.classList.remove('defendendo');
      ataque.style.display = 'none';
    }, 500);

    this.protegoCount++;
    counter.textContent = this.protegoCount;

    // Próximo ataque após 1.5s
    setTimeout(() => {
      if (this.protegoActive) {
        this.lancarAtaque();
      }
    }, 1500);
  }

  finalizarProtego() {
    this.protegoActive = false;
    const btnProtego = document.querySelector('#btn-protego');
    btnProtego.disabled = true;

    dialogoGlobal.exibir('Protego! Você defendeu todos os ataques.', {
      comAudio: true,
      callback: () => {
        estadoGlobal.concluirDesafio('protego');
        estadoGlobal.desbloquearScroll();
      }
    });
  }

  /**
   * MAZE RUNNER - Labirinto impossível (Dementor sempre alcança)
   */
  inicializarMaze() {
    const canvas = document.querySelector('#maze-canvas');
    const btnStart = document.querySelector('#btn-start-maze');
    const tempoSpan = document.querySelector('#maze-tempo');

    if (!canvas || !btnStart) return;

    const ctx = canvas.getContext('2d');
    const cellSize = 40;
    const cols = 10;
    const rows = 10;

    let player = { x: 0, y: 0 };
    let exit = { x: cols - 1, y: rows - 1 };
    let dementor = { x: 0, y: 9 };
    let gameActive = false;
    let time = 0;

    // Gera labirinto simples (sem paredes para tornar "possível" visualmente)
    const drawMaze = () => {
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      for (let x = 0; x <= cols; x++) {
        ctx.beginPath();
        ctx.moveTo(x * cellSize, 0);
        ctx.lineTo(x * cellSize, rows * cellSize);
        ctx.stroke();
      }
      for (let y = 0; y <= rows; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * cellSize);
        ctx.lineTo(cols * cellSize, y * cellSize);
        ctx.stroke();
      }

      // Saída
      ctx.fillStyle = 'rgba(100, 255, 108, 0.5)';
      ctx.fillRect(exit.x * cellSize + 5, exit.y * cellSize + 5, cellSize - 10, cellSize - 10);

      // Jogador
      ctx.fillStyle = 'rgba(100, 108, 255, 0.9)';
      ctx.fillRect(player.x * cellSize + 8, player.y * cellSize + 8, cellSize - 16, cellSize - 16);

      // Dementor
      ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
      ctx.fillRect(dementor.x * cellSize + 5, dementor.y * cellSize + 5, cellSize - 10, cellSize - 10);
      ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
      ctx.lineWidth = 2;
      ctx.strokeRect(dementor.x * cellSize + 5, dementor.y * cellSize + 5, cellSize - 10, cellSize - 10);
    };

    const movePlayer = (dx, dy) => {
      const newX = player.x + dx;
      const newY = player.y + dy;

      if (newX >= 0 && newX < cols && newY >= 0 && newY < rows) {
        player.x = newX;
        player.y = newY;
        drawMaze();

        // Verifica se alcançou a saída (nunca vai alcançar porque o Dementor é mais rápido)
        if (player.x === exit.x && player.y === exit.y) {
          endGame(true);
        }
      }
    };

    const moveDementor = () => {
      // Dementor se move em direção ao jogador (mais rápido)
      if (dementor.x < player.x) dementor.x++;
      else if (dementor.x > player.x) dementor.x--;

      if (dementor.y < player.y) dementor.y++;
      else if (dementor.y > player.y) dementor.y--;

      // Verifica se alcançou o jogador
      if (dementor.x === player.x && dementor.y === player.y) {
        endGame(false);
      }

      drawMaze();
    };

    const endGame = (vitoria) => {
      gameActive = false;
      clearInterval(this.mazeInterval);
      document.removeEventListener('keydown', keyHandler);

      if (vitoria) {
        // Nunca acontecerá
        dialogoGlobal.exibir('Impossível... você conseguiu!', {
          comAudio: true
        });
      } else {
        // Sempre acontece - Avada Kedavra
        setTimeout(() => {
          this.triggerAvadaKedavra();
        }, 500);
      }
    };

    const keyHandler = (e) => {
      if (!gameActive) return;

      if (e.key === 'ArrowUp') movePlayer(0, -1);
      else if (e.key === 'ArrowDown') movePlayer(0, 1);
      else if (e.key === 'ArrowLeft') movePlayer(-1, 0);
      else if (e.key === 'ArrowRight') movePlayer(1, 0);
    };

    btnStart.addEventListener('click', () => {
      player = { x: 0, y: 0 };
      dementor = { x: 0, y: 9 };
      time = 0;
      gameActive = true;

      btnStart.disabled = true;
      tempoSpan.textContent = '0';

      drawMaze();

      // Timer
      this.mazeInterval = setInterval(() => {
        time++;
        tempoSpan.textContent = time;

        // Dementor se move a cada 0.5s
        if (time % 1 === 0) {
          moveDementor();
        }

        // Após 15s, força o fim
        if (time >= 15) {
          endGame(false);
        }
      }, 1000);

      document.addEventListener('keydown', keyHandler);
    });
  }

  /**
   * AVADA KEDAVRA - VFX triggered após perder no maze
   */
  inicializarAvadaKedavra() {
    // Será acionado pelo triggerAvadaKedavra()
  }

  triggerAvadaKedavra() {
    const flashVerde = document.querySelector('#flash-verde');
    const arteVoldemort = document.querySelector('#arte-voldemort');

    // Flash verde
    flashVerde.classList.add('ativo');
    audioGlobal.tocarSFX('avada-kedavra');

    setTimeout(() => {
      flashVerde.classList.remove('ativo');
      arteVoldemort.style.display = 'block';

      setTimeout(() => {
        dialogoGlobal.exibir('A escuridão venceu...', {
          comAudio: true,
          callback: () => {
            dialogoGlobal.exibir('Ou será que não?', {
              comAudio: true,
              callback: () => {
                estadoGlobal.concluirDesafio('maze');
                estadoGlobal.desbloquearScroll();
              }
            });
          }
        });
      }, 2000);
    }, 800);
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Exporta instância
export const cap7Minigames = new Cap7Minigames();
