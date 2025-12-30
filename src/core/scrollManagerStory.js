/**
 * Scroll Manager STORY - Scroll real vertical suave
 * Cada section 100vh, scroll controlado por seta
 * Efeito de story scrolling natural
 */

import gsap from 'gsap';
import { estadoGlobal } from './stateManager.js';
import { cenaGlobal } from './sceneManager.js';
import { dialogoGlobal } from './dialogueManager.js';
import { audioGlobal } from './audioManager.js';

export class ScrollManagerStory {
  constructor() {
    this.secoes = [];
    this.indiceAtual = 1;
    this.bloqueado = false;
    this.scrollingProgramaticamente = false;
    this.arrowElement = null;
    this.verificandoDialogos = false; // Flag para evitar múltiplos intervals
  }

  /**
   * Inicializa sistema
   */
  inicializar() {
    console.log('🚀 INICIANDO ScrollManagerStory (Scroll Real Vertical)');
    this.secoes = Array.from(document.querySelectorAll('.section'));
    console.log(`📜 ${this.secoes.length} seções encontradas`);

    if (this.secoes.length === 0) {
      console.error('❌ ERRO: Nenhuma seção .section encontrada!');
      return;
    }

    // Bloqueia scroll do usuário
    this.bloquearScrollUsuario();
    console.log('🔒 Scroll do usuário bloqueado');

    // Cria seta
    this.criarSeta();
    this.esconderSeta();
    console.log('⬇️ Seta criada');

    // Observa estado
    this.observarEstado();

    // Configura SFX automáticos por capítulo
    this.configurarSFXAutomaticos();

    // Ativa conteúdo da primeira seção (já está visível)
    const primeiraSecao = this.secoes[0];
    const content = primeiraSecao.querySelector('.section-content');
    if (content) {
      content.classList.add('ativo');
    }

    console.log('✅ ScrollManagerStory inicializado');
  }

  /**
   * Configura SFX automáticos baseados em IntersectionObserver
   */
  configurarSFXAutomaticos() {
    // Cap 4 - SFX Penseira (quando entra nas memórias)
    const cap4 = document.querySelector('#cap4');
    if (cap4) {
      let penseiraJaTocada = false;
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5 && !penseiraJaTocada) {
            penseiraJaTocada = true;
            audioGlobal.tocarSFX('penseira');
            console.log('🔮 SFX: Penseira (entrando nas memórias Cap 4)');
          }
        });
      }, { threshold: 0.5 });

      observer.observe(cap4);
    }

    // Cap 4/5 - SFX Página (transições finais e recompensas)
    const secoesComPagina = [
      '#cap4-final',
      '#cap4-recompensa',
      '#cap5-final',
      '#cap5-recompensa'
    ];

    secoesComPagina.forEach(seletor => {
      const secao = document.querySelector(seletor);
      if (secao) {
        let paginaJaTocada = false;
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.5 && !paginaJaTocada) {
              paginaJaTocada = true;
              audioGlobal.tocarSFX('pagina');
              console.log(`📄 SFX: Página (transição ${seletor})`);
            }
          });
        }, { threshold: 0.5 });

        observer.observe(secao);
      }
    });

    // Cap 6 - SFX Coruja (recompensa)
    const cap6Recompensa = document.querySelector('#cap6-recompensa');
    if (cap6Recompensa) {
      let corujaJaTocada = false;
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5 && !corujaJaTocada) {
            corujaJaTocada = true;
            audioGlobal.tocarSFX('coruja');
            console.log('🦉 SFX: Coruja (recompensa Cap 6)');
          }
        });
      }, { threshold: 0.5 });

      observer.observe(cap6Recompensa);
    }

    // Cap 8 - SFX Chuva LOOP (pós-derrota)
    const cap8PosDerrota = document.querySelector('#cap8-pos-derrota');
    if (cap8PosDerrota) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            // Inicia loop de chuva
            audioGlobal.tocarSFX('chuva');
            console.log('🌧️ SFX: Chuva (loop) - Cap 8 pós-derrota iniciado');
          } else {
            // Para chuva quando sai da seção
            if (audioGlobal.sfx.chuva && audioGlobal.sfx.chuva.playing()) {
              audioGlobal.sfx.chuva.stop();
              console.log('🌧️ SFX: Chuva (loop) parado');
            }
          }
        });
      }, { threshold: 0.5 });

      observer.observe(cap8PosDerrota);
    }
  }

  /**
   * Bloqueia scroll do usuário
   */
  bloquearScrollUsuario() {
    // Previne wheel
    this.wheelHandler = (e) => {
      if (!this.scrollingProgramaticamente) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    // window.addEventListener('wheel', this.wheelHandler, { passive: false, capture: true });

    // Previne touch
    this.touchHandler = (e) => {
      if (!this.scrollingProgramaticamente) {
        e.preventDefault();
      }
    };
    // window.addEventListener('touchmove', this.touchHandler, { passive: false, capture: true });

    // Previne teclado
    this.keyHandler = (e) => {
      if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Space', 'Home', 'End'].includes(e.code)) {
        if (!this.scrollingProgramaticamente) {
          e.preventDefault();
        }
      }
    };
    // window.addEventListener('keydown', this.keyHandler, { passive: false });

    // Esconde scrollbar
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.scrollbarWidth = 'none';
    document.documentElement.style.msOverflowStyle = 'none';
  }

  /**
   * Cria seta flutuante
   */
  criarSeta() {
    this.arrowElement = document.createElement('div');
    this.arrowElement.id = 'scroll-arrow';
    this.arrowElement.innerHTML = `
      <svg width="60" height="60" viewBox="0 0 60 60">
        <circle cx="30" cy="30" r="28" fill="rgba(212, 175, 55, 0.15)" stroke="rgba(212, 175, 55, 0.8)" stroke-width="2"/>
        <path d="M 20 25 L 30 35 L 40 25" stroke="rgba(212, 175, 55, 1)" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;

    this.arrowElement.style.cssText = `
      position: fixed;
      bottom: 50px;
      left: 50%;
      transform: translateX(-50%);
      cursor: pointer;
      z-index: 9999;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
    `;

    this.arrowElement.addEventListener('click', () => this.tentarAvancar());

    this.arrowElement.addEventListener('mouseenter', () => {
      gsap.to(this.arrowElement, { scale: 1.15, duration: 0.3, ease: 'back.out(1.7)' });
    });

    this.arrowElement.addEventListener('mouseleave', () => {
      gsap.to(this.arrowElement, { scale: 1, duration: 0.3, ease: 'power2.out' });
    });

    // Animação de pulso
    gsap.to(this.arrowElement, {
      y: -15,
      duration: 1.2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    document.body.appendChild(this.arrowElement);
  }

  /**
   * Mostra seta
   */
  mostrarSeta() {
    if (!this.arrowElement) return;
    this.arrowElement.style.opacity = '1';
    this.arrowElement.style.pointerEvents = 'auto';
  }

  /**
   * Esconde seta
   */
  esconderSeta() {
    if (!this.arrowElement) return;
    this.arrowElement.style.opacity = '0';
    this.arrowElement.style.pointerEvents = 'none';
  }

  /**
   * Tenta avançar para próxima seção
   */
  tentarAvancar() {
    if (this.bloqueado) {
      console.log('⏸️  Bloqueado (puzzle ativo)');
      // Shake feedback
      gsap.to(this.arrowElement, {
        x: [-10, 10, -10, 10, 0],
        duration: 0.5,
        ease: 'power2.out'
      });
      return;
    }

    const secaoAtual = this.secoes[this.indiceAtual];
    const desafio = secaoAtual?.dataset.desafio;

    // Se tem desafio não concluído, bloqueia
    if (desafio && !estadoGlobal.desafioConcluido(desafio)) {
      console.log(`🔒 Puzzle "${desafio}" precisa ser resolvido`);
      this.bloqueado = true;
      this.esconderSeta();
      estadoGlobal.bloquearScroll();
      estadoGlobal.definir('desafioAtual', desafio);
      return;
    }

    // Avança
    if (this.indiceAtual < this.secoes.length - 1) {
      this.indiceAtual++;
      this.irParaSecao(this.indiceAtual);
    } else {
      console.log('✅ Fim da jornada');
      this.esconderSeta();
    }
  }

  /**
   * Vai para uma seção específica (SCROLL REAL SUAVE)
   */
  irParaSecao(indice, duracao = 1.2) {
    console.log(`🎯 irParaSecao: ${indice}`);
    console.log(`📜 Total de seções: ${this.secoes.length}`);
    
    if (indice < 0 || indice >= this.secoes.length) {
      console.error(`❌ Índice inválido: ${indice}`);
      return;
    }

    const secaoNova = this.secoes[indice];
    const capitulo = secaoNova.dataset.capitulo;

    console.log(`📍 Indo para seção ${indice} ${capitulo ? `(Cap ${capitulo})` : ''}`);

    // Esconde seta
    this.esconderSeta();

    // DISPARA ANIMAÇÃO DO CHAPÉU (seções 2 e 3)
    this.animarChapeu(indice);

    // ATIVA CONTEÚDO DA PRÓXIMA SEÇÃO **ANTES** DO SCROLL
    const content = secaoNova.querySelector('.section-content');
    if (content) {
      content.classList.add('ativo');
      console.log(`👁️ Conteúdo da próxima seção ativado (ANTES do scroll)`);
    }

    // Marca que estamos fazendo scroll programático
    this.scrollingProgramaticamente = true;

    // Habilita scroll temporariamente
    document.documentElement.style.overflow = 'auto';

    // SCROLL REAL SUAVE usando window.scrollTo com behavior smooth
    const targetY = secaoNova.offsetTop;

    window.scrollTo({
      top: targetY,
      behavior: 'smooth'
    });

    // Monitora quando scroll termina (window.scrollTo não tem callback)
    const verificarScroll = setInterval(() => {
      // Considera "chegou" quando está a menos de 5px do alvo
      if (Math.abs(window.scrollY - targetY) < 5) {
        clearInterval(verificarScroll);

        console.log(`✅ Scroll completo! Posição: ${window.scrollY}px`);

        // Desabilita scroll novamente
        document.documentElement.style.overflow = 'hidden';
        this.scrollingProgramaticamente = false;

        // Desativa seções anteriores que saíram da tela
        this.secoes.forEach((secao, i) => {
          if (i < indice) {
            const oldContent = secao.querySelector('.section-content');
            if (oldContent && oldContent.classList.contains('ativo')) {
              oldContent.classList.remove('ativo');
              console.log(`👻 Seção ${i} desativada (fora da tela)`);
            }
          }
        });

        // Atualiza capítulo E TROCA MÚSICA AUTOMATICAMENTE
        if (capitulo) {
          const capituloNum = parseInt(capitulo);
          const capituloAnterior = estadoGlobal.obter('capituloAtual');

          estadoGlobal.definir('capituloAtual', capituloNum);

          // Troca música automaticamente quando muda de capítulo
          if (capituloNum !== capituloAnterior && capituloNum > 0) {
            // Caps 1-7: troca automática normal
            // Cap 8: NÃO troca (música triste já está tocando desde Cap 7 derrota)
            if (capituloNum <= 7) {
              audioGlobal.trocarMusicaPorCapitulo(capituloNum, 500, 800);
              console.log(`🎵 Música do Cap ${capituloNum} iniciada automaticamente`);
            }
          }
        }

        // Verifica desafio
        const desafio = secaoNova.dataset.desafio;
        if (desafio && !estadoGlobal.desafioConcluido(desafio)) {
          this.bloqueado = true;
          this.esconderSeta();
          estadoGlobal.bloquearScroll();
          estadoGlobal.definir('desafioAtual', desafio);
          console.log(`🎯 Desafio "${desafio}" ativo`);

          // Se for desafio do Cap 7 (Lumos, Protego, Maze), troca para música de batalha
          if (desafio === 'lumos' || desafio === 'protego' || desafio === 'maze') {
            audioGlobal.trocarMusicaDeFundo('cap7_batalha', 400, 600);
            console.log('⚔️ Música de batalha iniciada (Cap 7 desafios)');
          }
        } else {
          // Mostra seta se pode avançar E se scroll não está bloqueado E se não há diálogos ativos
          const scrollBloqueado = estadoGlobal.obter('scrollBloqueado');
          const dialogoAtivo = dialogoGlobal.estaAtivo();

          if (indice < this.secoes.length - 1 && !scrollBloqueado && !dialogoAtivo) {
            setTimeout(() => {
              this.mostrarSeta();
              console.log(`⬇️ Seta mostrada`);
            }, 800);
          } else if (scrollBloqueado) {
            console.log(`⏸️  Scroll bloqueado - seta não será mostrada ainda`);
          } else if (dialogoAtivo) {
            console.log(`💬 Diálogo ativo - seta não será mostrada ainda`);
          }
        }
      }
    }, 50); // Verifica a cada 50ms

    // Timeout de segurança (caso algo dê errado)
    setTimeout(() => {
      clearInterval(verificarScroll);
      document.documentElement.style.overflow = 'hidden';
      this.scrollingProgramaticamente = false;
    }, duracao * 1000 + 500);
  }

  /**
   * Anima chapéu baseado no índice da seção
   */
  animarChapeu(indice) {
    const chapeu = cenaGlobal.obterObjeto('chapeu');
    if (!chapeu) return;

    // Seção 2 (índice 2): chapéu vai para esquerda IMEDIATAMENTE
    if (indice === 2) {
      chapeu.animacaoSecao2(() => {
        console.log('✅ Chapéu posicionado na Seção 2');
      });
    }

    // Seção 3 (índice 3): chapéu faz sequência 3 frames (permanece visível)
    if (indice === 3) {
      chapeu.animacaoSecao3(() => {
        console.log('✅ Chapéu completou Seção 3');
      });
    }

    // Seção 4 (índice 4): chapéu desce para fora da tela e desaparece
    if (indice === 4) {
      chapeu.animacaoSecao4(() => {
        console.log('✅ Chapéu desapareceu na Seção 4');
      });
    }
  }

  /**
   * Observa estado para desbloquear quando puzzle resolvido
   * IMPORTANTE: Este observer NÃO desbloqueia automaticamente!
   * O puzzle deve chamar desbloquearProgresso() após os diálogos
   */
  observarEstado() {
    estadoGlobal.observar('scrollBloqueado', (bloqueado) => {
      // Quando scroll é desbloqueado manualmente pelo puzzle
      if (!bloqueado) {
        console.log('🔓 Scroll desbloqueado');
        this.bloqueado = false;

        // Mostra seta após desbloquear (e após diálogos terminarem)
        if (this.indiceAtual < this.secoes.length - 1 && !this.verificandoDialogos) {
          this.verificandoDialogos = true;

          // Aguarda até que não haja mais diálogos ativos
          const verificarDialogos = setInterval(() => {
            if (!dialogoGlobal.estaAtivo()) {
              clearInterval(verificarDialogos);
              this.verificandoDialogos = false;

              setTimeout(() => {
                this.mostrarSeta();
                console.log('⬇️ Seta mostrada após desbloquear e diálogos finalizarem');
              }, 500);
            }
          }, 100);

          // Timeout de segurança (10 segundos)
          setTimeout(() => {
            clearInterval(verificarDialogos);
            this.verificandoDialogos = false;
          }, 10000);
        }
      }
    });
  }

  /**
   * Pula para seção (debug)
   */
  pularPara(indice) {
    if (!estadoGlobal.obter('modoDebug')) {
      console.warn('Só em modo debug');
      return;
    }
    this.indiceAtual = indice;
    this.bloqueado = false;
    this.irParaSecao(indice);
  }

  /**
   * Desbloqueia (debug)
   */
  desbloquear() {
    this.bloqueado = false;
    estadoGlobal.desbloquearScroll();
    this.mostrarSeta();
    console.log('🔓 Desbloqueado');
  }

  /**
   * Refresh (não faz nada)
   */
  refresh() {}

  /**
   * Destroi
   */
  destruir() {
    if (this.arrowElement) {
      this.arrowElement.remove();
      this.arrowElement = null;
    }

    if (this.wheelHandler) {
      window.removeEventListener('wheel', this.wheelHandler, { capture: true });
    }
    if (this.touchHandler) {
      window.removeEventListener('touchmove', this.touchHandler, { capture: true });
    }
    if (this.keyHandler) {
      window.removeEventListener('keydown', this.keyHandler);
    }

    // Restaura overflow
    document.documentElement.style.overflow = '';
    document.documentElement.style.scrollbarWidth = '';
    document.documentElement.style.msOverflowStyle = '';
  }
}

export const scrollGlobal = new ScrollManagerStory();
