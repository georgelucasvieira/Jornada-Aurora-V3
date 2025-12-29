/**
 * Cap 7 - Expecto Patronum VFX Sequence
 * Gerencia a sequência automatizada de VFX do Patrono
 */

import { estadoGlobal } from '../core/stateManager.js';
import { audioGlobal } from '../core/audioManager.js';
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
   * SEQUÊNCIA:
   * 1. Delay 2s após "E esperança!"
   * 2. SFX Harry: "Expecto Patronum"
   * 3. Música: The Patronus Light
   * 4. Delay 1s
   * 5. Esfera luminosa aparece (fade in, centro)
   * 6. Aguarda 4.5s (esfera pulsando)
   * 7. Esfera se expande para preencher tela
   * 8. Flash branco (fade-out)
   * 9. Reveal background com Patrono de Harry
   * 10. Texto: "Não temos mais como fugir, temos que lutar. Preparada?"
   * 11. Música: Battle theme
   * 12. Scroll para desafios (usando scrollManager, não scrollIntoView)
   */
  async iniciarSequenciaPatronus() {
    if (this.sequenciaIniciada) return;
    this.sequenciaIniciada = true;

    console.log('✨ Iniciando sequência Expecto Patronum...');

    // IMPORTANTE: Container VFX é OVERLAY fixo, não uma seção separada
    const overlayVFX = document.querySelector('#cap7-patronus-vfx');
    const esfera = document.querySelector('.patronus-sphere');
    const flash = document.querySelector('.patronus-flash');
    const background = document.querySelector('.patronus-background');
    const textoPreBatalha = document.querySelector('#cap7-pre-batalha-texto');

    if (!overlayVFX || !esfera || !flash || !background) {
      console.error('Elementos VFX do Patrono não encontrados');
      return;
    }

    // 1. Delay 2s
    await this.delay(2000);

    // 2. SFX "Expecto Patronum" (voz do Harry)
    audioGlobal.tocarSFX('expecto-patronum');
    console.log('🗣️ Harry: "Expecto Patronum!"');

    // 3. Música: The Patronus Light
    audioGlobal.trocarMusicaPorCapitulo('7_patronus', 1000, 2000);

    // 4. Delay 1s
    await this.delay(1000);

    // 5. Mostra overlay VFX e esfera aparece (fade in)
    overlayVFX.style.display = 'flex';
    overlayVFX.style.opacity = '1';
    esfera.classList.add('ativo');
    console.log('💫 Esfera luminosa aparecendo...');

    // 6. Aguarda 4.5s (esfera pulsando no centro)
    await this.delay(4500);

    // 7. Esfera se expande para preencher tela
    esfera.classList.add('expandindo');
    audioGlobal.tocarSFX('whoosh'); // SFX de expansão
    console.log('⚡ Esfera expandindo...');

    // Aguarda expansão completar (1.5s)
    await this.delay(1500);

    // 8. Flash branco
    flash.classList.add('ativo');
    console.log('💥 Flash branco!');

    // Aguarda flash subir (1s)
    await this.delay(1000);

    // 9. Remove esfera e flash, revela background do Patrono
    esfera.style.display = 'none';
    flash.style.display = 'none';
    background.style.display = 'flex';
    background.classList.add('ativo');
    console.log('🦌 Patrono revelado!');

    // Aguarda 3s para usuário apreciar o Patrono
    await this.delay(3000);

    // 10. Mostra texto pré-batalha (ainda dentro do overlay)
    if (textoPreBatalha) {
      textoPreBatalha.style.display = 'block';
      gsap.fromTo(textoPreBatalha,
        { opacity: 0 },
        { opacity: 1, duration: 1.5 }
      );
    }

    // Aguarda 3s
    await this.delay(3000);

    // 11. Música: Battle theme
    audioGlobal.trocarMusicaPorCapitulo('7_batalha', 1000, 2000);
    console.log('⚔️ Música de batalha iniciada!');

    // Aguarda 2s
    await this.delay(2000);

    // 12. Fade out do overlay VFX
    gsap.to(overlayVFX, {
      opacity: 0,
      duration: 1.5,
      onComplete: () => {
        overlayVFX.style.display = 'none';
      }
    });

    // Aguarda fade out completar
    await this.delay(1500);

    // 13. Desbloqueia scroll e mostra seta
    // O scrollManager vai detectar automaticamente que pode avançar
    console.log('✅ Sequência Expecto Patronum concluída! Usuário pode avançar.');
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
    const background = document.querySelector('.patronus-background');
    const textoPreBatalha = document.querySelector('#cap7-pre-batalha-texto');

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
    if (background) {
      background.classList.remove('ativo');
      background.style.display = 'none';
    }
    if (textoPreBatalha) {
      textoPreBatalha.style.display = 'none';
    }

    console.log('🔄 Sequência Patronus resetada');
  }
}

// Exporta instância global
export const cap7Patronus = new Cap7Patronus();
