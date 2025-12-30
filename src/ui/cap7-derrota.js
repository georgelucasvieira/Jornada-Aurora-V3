/**
 * Cap 7 - Sequência de Derrota (Maze Runner Failed)
 * Gerencia a sequência automatizada quando o usuário perde no Maze Runner
 */

import { estadoGlobal } from '../core/stateManager.js';
import { audioGlobal } from '../core/audioManager.js';
import { scrollGlobal } from '../core/scrollManagerStory.js';
import { cap8Cinematic } from './cap8-cinematic.js';
import gsap from 'gsap';

export class Cap7Derrota {
  constructor() {
    this.sequenciaIniciada = false;
  }

  /**
   * Inicializa o sistema de derrota
   */
  inicializar() {
    // A sequência será chamada diretamente pelo cap7-minigames quando o usuário perder
    console.log('✅ Sistema de derrota Cap 7 inicializado');
  }

  /**
   * Inicia a sequência de derrota
   *
   * SEQUÊNCIA AUTOMÁTICA (SEM INTERAÇÃO DO USUÁRIO):
   * 1. Transição imediata para seção #cap7-avada-vfx (background escuro)
   * 2. Toca avada-kedavra.mp3 + inicia música triste
   * 3. Após 1s: VFX Avada Kedavra (raio verde + hit)
   * 4. Flash verde cobre toda a tela
   * 5. Transição para seção #cap7-derrota (Voldemort + versículo)
   * 6. Imagem de Voldemort aparece à direita (40%)
   * 7. Após 2s: texto aparece à esquerda (60%)
   * 8. Após 5s: fade-out de imagem e texto
   * 9. Transição automática para Cap 8
   */
  async iniciarSequenciaDerrota() {
    if (this.sequenciaIniciada) return;
    this.sequenciaIniciada = true;

    console.log('💀 Iniciando sequência de derrota...');

    // Bloqueia scroll durante toda a sequência
    estadoGlobal.definir('scrollBloqueado', true);

    // Esconde seta (não precisa mais dela)
    scrollGlobal.esconderSeta();

    // ========== 1. TRANSIÇÃO PARA SEÇÃO AVADA KEDAVRA ==========
    const secaoAvadaVFX = document.querySelector('#cap7-avada-vfx');
    if (!secaoAvadaVFX) {
      console.error('Seção #cap7-avada-vfx não encontrada');
      return;
    }

    // Mostra seção
    secaoAvadaVFX.style.display = 'flex';
    secaoAvadaVFX.style.opacity = '1';

    // Navega para seção
    const indiceAvada = scrollGlobal.secoes.indexOf(secaoAvadaVFX);
    if (indiceAvada !== -1) {
      scrollGlobal.irParaSecao(indiceAvada, 1);
    }

    console.log('⚫ Transição para seção Avada Kedavra');

    // ========== 2. TOCA SFX + MÚSICA TRISTE ==========
    audioGlobal.tocarSFX('avada-kedavra');
    console.log('🗣️ "Avada Kedavra!"');

    // Aguarda 1s + Música Triste
    await this.delay(1000);
    audioGlobal.tocarMusica('triste');
    console.log('🎵 Música Triste iniciada');

    // ========== 3. VFX AVADA KEDAVRA ==========
    await this.criarVFXAvadaKedavra(secaoAvadaVFX);

    // ========== 4. FLASH VERDE ==========
    const flashVerde = document.querySelector('.flash-verde');
    if (flashVerde) {
      gsap.to(flashVerde, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.inOut'
      });

      await this.delay(300);

      gsap.to(flashVerde, {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out'
      });

      await this.delay(500);
    }

    console.log('💚 Flash verde!');

    // ========== 5. TRANSIÇÃO PARA SEÇÃO DERROTA (VOLDEMORT) ==========
    const secaoDerrota = document.querySelector('#cap7-derrota');
    if (!secaoDerrota) {
      console.error('Seção #cap7-derrota não encontrada');
      return;
    }

    // Esconde seção Avada
    secaoAvadaVFX.style.display = 'none';

    // Mostra seção Derrota
    secaoDerrota.style.display = 'flex';
    secaoDerrota.style.opacity = '0';

    // Navega para seção
    const indiceDerrota = scrollGlobal.secoes.indexOf(secaoDerrota);
    if (indiceDerrota !== -1) {
      scrollGlobal.irParaSecao(indiceDerrota, 1.5);
    }

    // Fade in da seção
    gsap.to(secaoDerrota, {
      opacity: 1,
      duration: 2,
      ease: 'power2.inOut'
    });

    console.log('🐍 Transição para seção Voldemort');

    // Inicia SFX de chuva (loop) - ambiente pós-derrota
    audioGlobal.tocarSFX('chuva');
    console.log('🌧️ SFX: Chuva (loop) iniciada');

    // ========== 6. IMAGEM DE VOLDEMORT APARECE ==========
    const imagemVoldemort = secaoDerrota.querySelector('.imagem-voldemort-final');
    if (imagemVoldemort) {
      gsap.fromTo(imagemVoldemort,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 2, ease: 'power2.out' }
      );
    }

    // Aguarda 2s
    await this.delay(2000);

    // ========== 7. TEXTO APARECE ==========
    const textoContainer = secaoDerrota.querySelector('.voldemort-texto-container .texto-narrativo');
    if (textoContainer) {
      gsap.fromTo(textoContainer,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1.5, ease: 'power2.out' }
      );
    }

    console.log('📜 Versículo apareceu');

    // Aguarda 5s
    await this.delay(5000);

    // ========== 8. FADE-OUT DE IMAGEM E TEXTO ==========
    if (imagemVoldemort) {
      gsap.to(imagemVoldemort, {
        opacity: 0,
        duration: 1.5,
        ease: 'power2.inOut'
      });
    }

    if (textoContainer) {
      gsap.to(textoContainer, {
        opacity: 0,
        duration: 1.5,
        ease: 'power2.inOut'
      });
    }

    await this.delay(1500);

    // ========== 9. TRANSIÇÃO PARA CAP 8 ==========
    // Fade out da seção derrota
    gsap.to(secaoDerrota, {
      opacity: 0,
      duration: 2,
      ease: 'power2.inOut'
    });

    await this.delay(2000);

    // Navega para Cap 8 e inicia sequência cinematográfica
    const cap8PosDerrota = document.querySelector('#cap8-pos-derrota');
    if (cap8PosDerrota) {
      // Mostra seção
      cap8PosDerrota.style.display = 'flex';
      cap8PosDerrota.style.opacity = '0';

      // Navega
      const indiceCap8 = scrollGlobal.secoes.indexOf(cap8PosDerrota);
      if (indiceCap8 !== -1) {
        scrollGlobal.irParaSecao(indiceCap8, 2);
      }

      // Fade in
      gsap.to(cap8PosDerrota, {
        opacity: 1,
        duration: 2,
        ease: 'power2.inOut'
      });

      await this.delay(2000);

      console.log('🎬 Transição para Cap 8 - iniciando sequência cinematográfica');

      // Inicia Cap 8 Cinematic diretamente
      cap8Cinematic.iniciarSequenciaCinematica();
    }

    console.log('✅ Sequência de derrota concluída');
  }

  /**
   * Cria VFX Avada Kedavra (raio verde + hit)
   */
  async criarVFXAvadaKedavra(secao) {
    const container = secao.querySelector('.section-content');
    if (!container) return;

    // Limpa container
    container.innerHTML = '';

    // Cria container VFX
    const vfxContainer = document.createElement('div');
    vfxContainer.className = 'avada-kedavra-vfx';

    // Raio verde
    const raio = document.createElement('div');
    raio.className = 'avada-raio';
    vfxContainer.appendChild(raio);

    // Hit verde
    const hit = document.createElement('div');
    hit.className = 'avada-hit';
    vfxContainer.appendChild(hit);

    container.appendChild(vfxContainer);

    console.log('⚡ VFX Avada Kedavra criado');

    // Aguarda animações completarem (0.8s raio + 0.6s hit delay + 0.6s hit duration = 2s total)
    await this.delay(2000);

    // Remove VFX
    vfxContainer.remove();
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

    const secaoAvadaVFX = document.querySelector('#cap7-avada-vfx');
    const secaoDerrota = document.querySelector('#cap7-derrota');

    if (secaoAvadaVFX) {
      secaoAvadaVFX.style.display = 'none';
      secaoAvadaVFX.style.opacity = '0';
    }

    if (secaoDerrota) {
      secaoDerrota.style.display = 'none';
      secaoDerrota.style.opacity = '0';
    }

    console.log('🔄 Sequência de derrota resetada');
  }
}

// Exporta instância global
export const cap7Derrota = new Cap7Derrota();
