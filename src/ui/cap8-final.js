/**
 * Cap 8+9 - Sacrifício e Ressurreição
 * Gerencia a narrativa final do jogo
 */

import { estadoGlobal } from '../core/stateManager.js';
import { audioGlobal } from '../core/audioManager.js';
import { scrollGlobal } from '../core/scrollManagerStory.js';
import gsap from 'gsap';

export class Cap8Final {
  constructor() {
    this.thunderInterval = null;
    this.pedraClicada = false;
    this.fadeOverlay = null;
  }

  /**
   * Inicializa todos os sistemas do Cap 8+9
   * NOTA: inicializarPedraRessurreicao() foi DESATIVADO pois o cap8-cinematic.js agora gerencia isso
   */
  inicializar() {
    this.criarFadeOverlay();
    // this.inicializarPedraRessurreicao(); // DESATIVADO - usando cap8-cinematic.js
    this.configurarObservadores();
  }

  /**
   * Cria overlay de fade to black
   */
  criarFadeOverlay() {
    this.fadeOverlay = document.createElement('div');
    this.fadeOverlay.className = 'fade-to-black-overlay';
    document.body.appendChild(this.fadeOverlay);
  }

  /**
   * Configura observadores de seção para triggers automáticos
   * DESATIVADO: Cap 8 agora usa cap8-cinematic.js com progressão narrativa controlada
   */
  configurarObservadores() {
    // DESATIVADO - observers removidos pois Cap 8 é controlado por cap8-cinematic.js
    // que gerencia toda a sequência de forma programática via scrollManager
    console.log('⚠️ Observers do cap8-final.js estão DESATIVADOS (usando cap8-cinematic.js)');
  }

  /**
   * SEÇÃO 1 - PÓS-DERROTA
   * Inicia sequência de tela preta + chuva + trovões
   */
  iniciarPosDerrotaSequence() {
    console.log('🌧️ Iniciando pós-derrota...');

    // Música triste (Lily's Theme ou similar)
    audioGlobal.trocarMusicaDeFundo('triste', 0.3, 3000);

    // Inicia trovões a cada 10 segundos
    this.iniciarTrovoes();
  }

  /**
   * Inicia trovões aleatórios a cada ~10s
   */
  iniciarTrovoes() {
    if (this.thunderInterval) return; // Já está rodando

    // Primeiro trovão após 2s
    setTimeout(() => {
      this.tocarTrovao();
    }, 2000);

    // Trovões subsequentes a cada 10s (com variação de ±2s)
    this.thunderInterval = setInterval(() => {
      this.tocarTrovao();
    }, 10000);
  }

  /**
   * Toca SFX de trovão
   */
  tocarTrovao() {
    audioGlobal.tocarSFX('trovao');
    console.log('⚡ Trovão!');

    // Efeito visual de flash branco rápido (opcional)
    const flash = document.createElement('div');
    flash.style.position = 'fixed';
    flash.style.top = '0';
    flash.style.left = '0';
    flash.style.width = '100%';
    flash.style.height = '100%';
    flash.style.background = 'rgba(255, 255, 255, 0.3)';
    flash.style.pointerEvents = 'none';
    flash.style.zIndex = '9998';
    document.body.appendChild(flash);

    setTimeout(() => {
      flash.remove();
    }, 100);
  }

  /**
   * Para os trovões
   */
  pararTrovoes() {
    if (this.thunderInterval) {
      clearInterval(this.thunderInterval);
      this.thunderInterval = null;
      console.log('🌧️ Trovões parados');
    }
  }

  /**
   * SEÇÃO 2 - REVELAÇÃO
   * Inicia música triste (Lily's Theme)
   */
  iniciarMusicaTriste() {
    console.log('🎵 Música triste iniciada');
    audioGlobal.trocarMusicaDeFundo('triste', 0.4, 2000);
  }

  /**
   * SEÇÃO 5 - PEDRA DA RESSURREIÇÃO
   * Configura botão e sequência de transição
   */
  inicializarPedraRessurreicao() {
    const btnPedra = document.querySelector('#btn-pedra-ressurreicao');

    if (!btnPedra) return;

    btnPedra.addEventListener('click', () => {
      if (this.pedraClicada) return;

      this.pedraClicada = true;
      this.usarPedraRessurreicao();
    });
  }

  /**
   * Executa sequência completa da Pedra da Ressurreição
   * 1. Fade to black (2s)
   * 2. Silêncio (1s)
   * 3. Música alegre começa
   * 4. Reveal da seção Vida Nova
   */
  async usarPedraRessurreicao() {
    console.log('💎 Usando Pedra da Ressurreição...');

    const btnPedra = document.querySelector('#btn-pedra-ressurreicao');
    const secaoVidaNova = document.querySelector('#cap8-vida-nova');
    const secaoTransicao = document.querySelector('#cap8-transicao');

    // 1. Desabilita botão e adiciona feedback visual
    btnPedra.disabled = true;
    gsap.to(btnPedra, {
      opacity: 0,
      scale: 0.8,
      duration: 0.5,
      ease: 'power2.in'
    });

    // 2. Fade to black (2s)
    this.fadeOverlay.classList.add('ativo');

    // Aguarda 2s do fade
    await this.delay(2000);

    // 3. Para música triste
    audioGlobal.pararTudo();

    // 4. Silêncio (1s)
    await this.delay(1000);

    // 5. Para os trovões
    this.pararTrovoes();

    // 6. Mostra seção Vida Nova (ainda com overlay preto)
    secaoVidaNova.style.display = 'flex';

    // 7. Inicia música alegre (Leaving Hogwarts)
    audioGlobal.trocarMusicaDeFundo('alegre', 0.5, 2000);

    // 8. Remove fade overlay para revelar Vida Nova (2s)
    await this.delay(500);
    this.fadeOverlay.classList.remove('ativo');

    // 9. Scroll suave para Vida Nova após 1s
    await this.delay(1000);
    secaoVidaNova.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // 10. Após animações da Vida Nova (8s total), mostra transição
    await this.delay(8000);
    secaoTransicao.style.display = 'flex';

    // 11. Scroll para transição
    await this.delay(2000);
    secaoTransicao.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // 12. Desbloqueia scroll para epílogo
    await this.delay(3000);
    estadoGlobal.concluirDesafio('cap8-final');
    estadoGlobal.desbloquearScroll();

    console.log('✅ Pedra da Ressurreição usada com sucesso!');
  }

  /**
   * Helper: delay promise
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Limpa recursos
   */
  destruir() {
    this.pararTrovoes();
    if (this.fadeOverlay) {
      this.fadeOverlay.remove();
    }
  }
}

// Exporta instância global
export const cap8Final = new Cap8Final();
