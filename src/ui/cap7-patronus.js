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
   * Inicializa (nada a fazer - sequência é iniciada via método público)
   */
  inicializar() {
    console.log('✅ Cap7 Patronus pronto (aguardando trigger via progressão narrativa)');
  }

  /**
   * Método público para iniciar a sequência do Patrono
   * Chamado pelo scrollManager quando o usuário chega na seção #cap7-esperanca
   */
  disparar() {
    if (!this.sequenciaIniciada) {
      console.log('🔮 Trigger Expecto Patronum (via progressão narrativa)');
      this.iniciarSequenciaPatronus();
    }
  }

  /**
   * Inicia a sequência completa do Expecto Patronum
   *
   * NOVA SEQUÊNCIA (CORRIGIDA):
   * 1. Aguarda 3s na seção "E esperança!" (texto sozinho)
   * 2. Transição para seção #cap7-patronus-revelado (background PRETO)
   * 3. SFX Harry: "Expecto Patronum"
   * 4. Delay 1s
   * 5. Esfera luminosa aparece (fade in, centro) - DENTRO da nova seção
   * 6. Aguarda 4.5s (esfera pulsando)
   * 7. Esfera se expande para preencher tela
   * 8. Flash branco (fade-out)
   * 9. Overlay VFX desaparece
   * 10. Música: The Patronus Light (loop contínuo)
   * 11. Imagem do patrono aparece à esquerda (40%)
   * 12. Texto aparece à direita (60%) após alguns segundos
   * 13. Seta pra baixo aparece após 6s
   */
  async iniciarSequenciaPatronus() {
    if (this.sequenciaIniciada) return;
    this.sequenciaIniciada = true;

    console.log('✨ Iniciando sequência Expecto Patronum...');

    // 1. Aguarda 3s na seção "E esperança!"
    await this.delay(3000);

    // 2. Transição para seção #cap7-patronus-revelado (background PRETO)
    const secaoPatronusRevelado = document.querySelector('#cap7-patronus-revelado');
    if (!secaoPatronusRevelado) {
      console.error('Seção #cap7-patronus-revelado não encontrada');
      return;
    }

    // Mostra seção e navega para ela
    secaoPatronusRevelado.style.display = 'flex';
    secaoPatronusRevelado.style.opacity = '0';

    const indiceSecao = scrollGlobal.secoes.indexOf(secaoPatronusRevelado);
    if (indiceSecao !== -1) {
      scrollGlobal.irParaSecao(indiceSecao, 1.5);
    }

    // Fade in da seção (background preto)
    gsap.to(secaoPatronusRevelado, {
      opacity: 1,
      duration: 1.5,
      ease: 'power2.inOut'
    });

    await this.delay(2000);

    console.log('⚫ Transição para seção Patrono (background preto)');

    // Elementos VFX (agora dentro da seção)
    const overlayVFX = document.querySelector('#cap7-patronus-vfx');
    const esfera = document.querySelector('.patronus-sphere');
    const flash = document.querySelector('.patronus-flash');

    if (!overlayVFX || !esfera || !flash) {
      console.error('Elementos VFX do Patrono não encontrados');
      return;
    }

    // 3. SFX "Expecto Patronum" (voz do Harry)
    audioGlobal.tocarSFX('expecto-patronum');
    console.log('🗣️ Harry: "Expecto Patronum!"');

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

    // 9. Fade out do overlay VFX
    gsap.to(overlayVFX, {
      opacity: 0,
      duration: 1,
      onComplete: () => {
        overlayVFX.style.display = 'none';
      }
    });

    await this.delay(1000);

    // 10. Música: The Patronus Light (loop contínuo)
    audioGlobal.trocarMusicaDeFundo('cap7_patronus', 400, 800);
    console.log('🎵 Música do Patrono iniciada (loop)');

    // 11. Imagem do patrono aparece à esquerda (já está na seção, fade in com GSAP)
    const imagemPatronus = secaoPatronusRevelado.querySelector('.patronus-image-final');
    if (imagemPatronus) {
      gsap.fromTo(imagemPatronus,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 2, ease: 'power2.out' }
      );
    }

    // Aguarda 2s
    await this.delay(2000);

    // 12. Texto aparece à direita
    const textoContainer = secaoPatronusRevelado.querySelector('.patronus-texto-container .texto-narrativo');
    if (textoContainer) {
      gsap.fromTo(textoContainer,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1.5, ease: 'power2.out' }
      );
    }

    console.log('🦌 Patrono revelado! Imagem e texto apareceram.');

    // Aguarda 6s (tempo para usuário ver imagem e texto)
    await this.delay(6000);

    // 13. Mostra seta para descer
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
