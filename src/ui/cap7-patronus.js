/**
 * Cap 7 - Expecto Patronum VFX Sequence
 * Gerencia a sequência automatizada de VFX do Patrono
 */

import { estadoGlobal } from '../core/stateManager.js';
import { audioGlobal } from '../core/audioManager.js';
import { scrollGlobal } from '../core/scrollManagerStory.js';
import gsap from 'gsap';

export class Cap7Patronus {
  constructor() {
    this.sequenciaIniciada = false;
  }

  /**
   * Inicializa o observador para a seção "E esperança!"
   */
  inicializar() {
    this.configurarObservador();
  }

  /**
   * Configura IntersectionObserver para detectar quando usuário chega na seção "E esperança!"
   */
  configurarObservador() {
    const secaoEsperanca = document.querySelector('#cap7-esperanca');

    if (!secaoEsperanca) {
      console.warn('Seção #cap7-esperanca não encontrada');
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5 && !this.sequenciaIniciada) {
          console.log('🔮 Trigger Expecto Patronum detectado!');
          this.iniciarSequenciaPatronus();
        }
      });
    }, { threshold: 0.5 });

    observer.observe(secaoEsperanca);
  }

  /**
   * Inicia a sequência completa do Expecto Patronum
   *
   * NOVA SEQUÊNCIA:
   * 1. Delay 2s após "E esperança!"
   * 2. SFX Harry: "Expecto Patronum"
   * 3. Delay 1s
   * 4. Esfera luminosa aparece (fade in, centro)
   * 5. Aguarda 4.5s (esfera pulsando)
   * 6. Esfera se expande para preencher tela
   * 7. Flash branco (fade-out)
   * 8. Overlay desaparece, transição automática para seção #cap7-patronus-revelado
   * 9. Música: The Patronus Light (loop contínuo)
   * 10. Imagem do patrono aparece à esquerda (40%)
   * 11. Texto aparece à direita (60%) após alguns segundos
   * 12. Seta pra baixo aparece após 6s
   */
  async iniciarSequenciaPatronus() {
    if (this.sequenciaIniciada) return;
    this.sequenciaIniciada = true;

    console.log('✨ Iniciando sequência Expecto Patronum...');

    // Elementos VFX
    const overlayVFX = document.querySelector('#cap7-patronus-vfx');
    const esfera = document.querySelector('.patronus-sphere');
    const flash = document.querySelector('.patronus-flash');

    if (!overlayVFX || !esfera || !flash) {
      console.error('Elementos VFX do Patrono não encontrados');
      return;
    }

    // 1. Delay 2s
    await this.delay(2000);

    // 2. SFX "Expecto Patronum" (voz do Harry)
    audioGlobal.tocarSFX('expecto-patronum');
    console.log('🗣️ Harry: "Expecto Patronum!"');

    // 3. Delay 1s
    await this.delay(1000);

    // 4. Mostra overlay VFX e esfera aparece (fade in)
    overlayVFX.style.display = 'flex';
    overlayVFX.style.opacity = '1';
    esfera.classList.add('ativo');
    console.log('💫 Esfera luminosa aparecendo...');

    // 5. Aguarda 4.5s (esfera pulsando no centro)
    await this.delay(4500);

    // 6. Esfera se expande para preencher tela
    esfera.classList.add('expandindo');
    audioGlobal.tocarSFX('whoosh'); // SFX de expansão
    console.log('⚡ Esfera expandindo...');

    // Aguarda expansão completar (1.5s)
    await this.delay(1500);

    // 7. Flash branco
    flash.classList.add('ativo');
    console.log('💥 Flash branco!');

    // Aguarda flash subir (1s)
    await this.delay(1000);

    // 8. Fade out do overlay VFX
    gsap.to(overlayVFX, {
      opacity: 0,
      duration: 1,
      onComplete: () => {
        overlayVFX.style.display = 'none';
      }
    });

    await this.delay(1000);

    // 9. Música: The Patronus Light (loop contínuo)
    audioGlobal.trocarMusicaPorCapitulo('7_patronus', 1000, 2000);
    console.log('🎵 Música do Patrono iniciada (loop)');

    // 10. Transição automática para seção #cap7-patronus-revelado
    const secaoPatronusRevelado = document.querySelector('#cap7-patronus-revelado');
    if (secaoPatronusRevelado) {
      // Mostra seção (já tem animações CSS)
      secaoPatronusRevelado.style.display = 'flex';
      secaoPatronusRevelado.style.opacity = '0';

      // Navega para a seção usando scrollManager
      const indiceSecao = scrollGlobal.secoes.indexOf(secaoPatronusRevelado);
      if (indiceSecao !== -1) {
        scrollGlobal.irParaSecao(indiceSecao, 1.5);
      }

      // Fade in da seção
      gsap.to(secaoPatronusRevelado, {
        opacity: 1,
        duration: 2,
        ease: 'power2.inOut'
      });

      console.log('🦌 Transição para seção Patrono Revelado!');
    }

    // Aguarda 6s (tempo para usuário ver imagem e texto)
    await this.delay(6000);

    // 11. Mostra seta para descer
    scrollGlobal.mostrarSeta();
    console.log('✅ Sequência Patrono concluída! Seta apareceu.');
  }

  /**
   * Helper: delay promise
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Reset (para testes/debug)
   */
  reset() {
    this.sequenciaIniciada = false;

    const overlayVFX = document.querySelector('#cap7-patronus-vfx');
    const esfera = document.querySelector('.patronus-sphere');
    const flash = document.querySelector('.patronus-flash');
    const secaoPatronusRevelado = document.querySelector('#cap7-patronus-revelado');

    if (overlayVFX) {
      overlayVFX.style.display = 'none';
      overlayVFX.style.opacity = '0';
    }
    if (esfera) {
      esfera.classList.remove('ativo', 'expandindo');
      esfera.style.display = 'block';
    }
    if (flash) {
      flash.classList.remove('ativo');
      flash.style.display = 'block';
    }
    if (secaoPatronusRevelado) {
      secaoPatronusRevelado.style.display = 'none';
      secaoPatronusRevelado.style.opacity = '0';
    }

    console.log('🔄 Sequência Patronus resetada');
  }
}

// Exporta instância global
export const cap7Patronus = new Cap7Patronus();
