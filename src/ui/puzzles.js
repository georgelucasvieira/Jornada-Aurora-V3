/**
 * Puzzles - Sistema de Desafios
 * Implementa todos os puzzles do jogo
 */

import { estadoGlobal } from '../core/stateManager.js';
import { audioGlobal } from '../core/audioManager.js';
import { dialogoGlobal } from '../core/dialogueManager.js';

export class PuzzleManager {
  constructor() {
    this.puzzleAtivo = null;
  }

  /**
   * Inicializa todos os puzzles
   */
  inicializar() {
    this.inicializarPuzzleCodigo();
    this.inicializarPuzzleEscolha();
    this.inicializarPuzzleMemoria();
    this.inicializarPuzzleOrtografia();
    this.inicializarPuzzleLimite();
  }

  /**
   * PUZZLE 1 - Código do Cartão
   */
  inicializarPuzzleCodigo() {
    const input = document.getElementById('input-codigo');
    const botao = document.getElementById('btn-codigo');
    const mensagem = document.querySelector('#puzzle-codigo .mensagem-erro');

    // Código correto (pode ser alterado)
    const codigoCorrecto = 'AURORA'; // Alterar para código do cartão físico

    botao.addEventListener('click', () => {
      const codigoDigitado = input.value.trim().toUpperCase();

      if (codigoDigitado === '') {
        mensagem.textContent = 'Digite algo...';
        return;
      }

      if (codigoDigitado === codigoCorrecto) {
        // Acertou!
        audioGlobal.tocarSFX('progresso');
        estadoGlobal.concluirDesafio('codigo');
        estadoGlobal.salvarResposta('codigo', codigoDigitado);

        dialogoGlobal.exibir('Você se lembrou.', {
          comAudio: true,
          callback: () => {
            dialogoGlobal.exibir('Então a porta se abre.', {
              comAudio: true,
              callback: () => {
                this.desbloquearProgresso();
              }
            });
          }
        });

        // Limpa e desabilita
        input.disabled = true;
        botao.disabled = true;
        mensagem.textContent = '';
      } else {
        // Errou
        audioGlobal.tocarSFX('tenteNovamente');
        mensagem.textContent = 'Nem sempre é o formato. É a intenção.';

        setTimeout(() => {
          mensagem.textContent = '';
        }, 3000);
      }
    });

    // Enter para submeter
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        botao.click();
      }
    });
  }

  /**
   * PUZZLE 2 - Escolha
   */
  inicializarPuzzleEscolha() {
    const botoes = document.querySelectorAll('.btn-escolha');

    botoes.forEach(botao => {
      botao.addEventListener('click', () => {
        const escolha = botao.dataset.escolha;

        audioGlobal.tocarSFX('clique');
        estadoGlobal.concluirDesafio('escolha');
        estadoGlobal.salvarResposta('escolha', escolha);

        // Desabilita todos os botões
        botoes.forEach(b => b.disabled = true);

        // Feedback
        dialogoGlobal.exibir('Interessante escolha.', {
          comAudio: true,
          callback: () => {
            this.desbloquearProgresso();
          }
        });
      });
    });
  }

  /**
   * PUZZLE 3 - Memória Afetiva
   */
  inicializarPuzzleMemoria() {
    const containerMemorizar = document.getElementById('cartas-memorizar');
    const containerSelecionar = document.getElementById('cartas-selecionar');
    const botaoConfirmar = document.getElementById('btn-confirmar-memoria');
    const mensagem = document.querySelector('#puzzle-memoria .mensagem-erro');

    // Cartas de memória (personalizar com momentos reais)
    const todasCartas = [
      'Primeiro filme juntos',
      'Uma briga boba',
      'Uma oração compartilhada',
      'Uma promessa',
      'Uma viagem',
      'Um silêncio importante',
      'Um presente especial',
      'Uma música marcante'
    ];

    // Cartas corretas (as que "permaneceram")
    const cartasCorretas = [
      'Uma oração compartilhada',
      'Uma promessa',
      'Um silêncio importante'
    ];

    const TEMPO_MEMORIZAR = 5000; // 5 segundos
    const MAX_SELECAO = 3;
    let cartasSelecionadas = [];

    // Mostra cartas para memorizar
    function mostrarCartasMemorizar() {
      containerMemorizar.innerHTML = '';
      containerMemorizar.style.display = 'grid';

      todasCartas.forEach(texto => {
        const carta = document.createElement('div');
        carta.className = 'carta';
        carta.textContent = texto;
        containerMemorizar.appendChild(carta);
      });

      // Após tempo, esconde e mostra para seleção
      setTimeout(() => {
        esconderEMostrarSelecao();
      }, TEMPO_MEMORIZAR);
    }

    function esconderEMostrarSelecao() {
      containerMemorizar.style.display = 'none';

      // Embaralha cartas
      const cartasEmbaralhadas = [...todasCartas].sort(() => Math.random() - 0.5);

      containerSelecionar.innerHTML = '';
      containerSelecionar.style.display = 'grid';

      cartasEmbaralhadas.forEach(texto => {
        const carta = document.createElement('div');
        carta.className = 'carta';
        carta.textContent = texto;
        carta.dataset.texto = texto;

        carta.addEventListener('click', () => {
          if (carta.classList.contains('desabilitada')) return;

          if (carta.classList.contains('selecionada')) {
            // Desseleciona
            carta.classList.remove('selecionada');
            cartasSelecionadas = cartasSelecionadas.filter(c => c !== texto);
          } else {
            // Seleciona
            if (cartasSelecionadas.length < MAX_SELECAO) {
              carta.classList.add('selecionada');
              cartasSelecionadas.push(texto);
            } else {
              mensagem.textContent = `Apenas ${MAX_SELECAO} cartas podem ser selecionadas.`;
              setTimeout(() => {
                mensagem.textContent = '';
              }, 2000);
            }
          }

          // Mostra botão confirmar se tiver selecionado 3
          if (cartasSelecionadas.length === MAX_SELECAO) {
            botaoConfirmar.style.display = 'block';
          } else {
            botaoConfirmar.style.display = 'none';
          }
        });

        containerSelecionar.appendChild(carta);
      });
    }

    // Confirmar seleção
    botaoConfirmar.addEventListener('click', () => {
      // Verifica se acertou todas
      const acertou = cartasSelecionadas.every(c => cartasCorretas.includes(c)) &&
                      cartasSelecionadas.length === cartasCorretas.length;

      if (acertou) {
        audioGlobal.tocarSFX('sucesso');
        estadoGlobal.concluirDesafio('memoria');
        estadoGlobal.salvarResposta('memoria', cartasSelecionadas);

        botaoConfirmar.disabled = true;

        dialogoGlobal.exibir('Você lembrou.', {
          comAudio: true,
          callback: () => {
            dialogoGlobal.exibir('Então pode seguir.', {
              comAudio: true,
              callback: () => {
                this.desbloquearProgresso();
              }
            });
          }
        });
      } else {
        audioGlobal.tocarSFX('erro');
        mensagem.textContent = 'Nem toda lembrança vem na primeira vez. Olhe com mais atenção.';

        // Reseta
        cartasSelecionadas = [];
        containerSelecionar.querySelectorAll('.carta').forEach(c => {
          c.classList.remove('selecionada');
        });
        botaoConfirmar.style.display = 'none';

        setTimeout(() => {
          mensagem.textContent = '';
        }, 3000);
      }
    });

    // Inicia quando a section estiver visível
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !estadoGlobal.desafioConcluido('memoria')) {
          mostrarCartasMemorizar();
          observer.disconnect();
        }
      });
    });

    const section = document.getElementById('desafio-memoria');
    if (section) {
      observer.observe(section);
    }
  }

  /**
   * PUZZLE 4 - Ortografia (Quiz Harry Potter)
   */
  inicializarPuzzleOrtografia() {
    const botoes = document.querySelectorAll('#puzzle-ortografia .btn-opcao');
    const mensagem = document.querySelector('#puzzle-ortografia .mensagem-erro');

    botoes.forEach(botao => {
      botao.addEventListener('click', () => {
        const correto = botao.dataset.correto === 'true';

        // Desabilita todos
        botoes.forEach(b => b.disabled = true);

        if (correto) {
          botao.classList.add('correto');
          audioGlobal.tocarSFX('sucesso');
          estadoGlobal.concluirDesafio('ortografia');
          estadoGlobal.salvarResposta('ortografia', botao.textContent);

          dialogoGlobal.exibir('Pequenos detalhes também protegem.', {
            comAudio: true,
            callback: () => {
              this.desbloquearProgresso();
            }
          });
        } else {
          botao.classList.add('incorreto');
          audioGlobal.tocarSFX('erro');
          mensagem.textContent = 'Nem tudo o que parece certo está correto. Tente outra vez.';

          setTimeout(() => {
            // Reabilita
            botoes.forEach(b => {
              b.disabled = false;
              b.classList.remove('incorreto');
            });
            mensagem.textContent = '';
          }, 2000);
        }
      });
    });
  }

  /**
   * PUZZLE FINAL - O Limite (impossível)
   */
  inicializarPuzzleLimite() {
    const botaoTentar = document.getElementById('btn-tentar');
    const botaoContinuar = document.getElementById('btn-continuar-limite');
    const textoLimite = document.getElementById('texto-limite');

    let tentativas = 0;
    const MAX_TENTATIVAS = 3;

    botaoTentar.addEventListener('click', () => {
      tentativas++;
      audioGlobal.tocarSFX('erro');

      if (tentativas < MAX_TENTATIVAS) {
        textoLimite.textContent = 'Nada acontece.';

        setTimeout(() => {
          textoLimite.textContent = '';
        }, 2000);
      } else {
        // Após 3 tentativas, revela que não há solução
        botaoTentar.style.display = 'none';
        textoLimite.textContent = 'Há lutas que não se vencem insistindo. Apenas permanecendo.';

        setTimeout(() => {
          botaoContinuar.style.display = 'block';
        }, 2000);
      }
    });

    botaoContinuar.addEventListener('click', () => {
      audioGlobal.tocarSFX('progresso');
      estadoGlobal.concluirDesafio('limite');

      botaoContinuar.disabled = true;

      dialogoGlobal.exibir('Você compreendeu.', {
        comAudio: true,
        callback: () => {
          this.desbloquearProgresso();
        }
      });
    });
  }

  /**
   * Desbloqueia progresso (libera scroll)
   */
  desbloquearProgresso() {
    estadoGlobal.desbloquearScroll();
  }
}

// Exporta instância
export const puzzleGlobal = new PuzzleManager();
