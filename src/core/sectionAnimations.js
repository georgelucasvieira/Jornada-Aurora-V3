/**
 * Section Animations - Animações automáticas para seções narrativas
 * Aplica padrão imagem-primeiro e texto sequencial em todas as seções principais
 */

import { animationHelper } from './animationHelper.js';
import gsap from 'gsap';

class SectionAnimations {
  constructor() {
    this.animatedSections = new Set(); // Controle para não animar duas vezes
  }

  /**
   * Inicializa animações automáticas para seções com IntersectionObserver
   * (apenas para cosmética - não afeta progressão narrativa)
   */
  inicializar() {
    console.log('📺 Inicializando animações de seções');

    // Mapeia seções que devem ter animações automáticas
    this.setupSectionAnimations();
  }

  /**
   * Configura animações para seções específicas
   */
  setupSectionAnimations() {
    // Cap 1 - Coruja (seção de abertura)
    const secaoCoruja = document.querySelector('#cap1-abertura');
    if (secaoCoruja) {
      this.setupCorujaSection(secaoCoruja);
    }

    // Cap 7 - Patronus (já tem animação customizada via cap7-patronus.js)
    // Não precisa de setup adicional

    // Cap 7 - Voldemort Derrota
    const secaoVoldemort = document.querySelector('#cap7-derrota');
    if (secaoVoldemort) {
      this.setupVoldemortSection(secaoVoldemort);
    }

    // Cap 8 - Calvário (duas seções)
    const secaoCalvario1 = document.querySelector('#cap8-revelacao');
    const secaoCalvario2 = document.querySelector('#cap8-sacrificio');

    if (secaoCalvario1) this.setupCalvarioSection(secaoCalvario1);
    if (secaoCalvario2) this.setupCalvarioSection(secaoCalvario2);

    // Cap 8 - Jesus e Casal (final feliz)
    const secaoJesusCasal = document.querySelector('#cap8-final');
    if (secaoJesusCasal) {
      this.setupJesusCasalSection(secaoJesusCasal);
    }
  }

  /**
   * Animação para seção da Coruja (Cap 1)
   */
  setupCorujaSection(secao) {
    const imagem = secao.querySelector('.imagem-coruja');
    const textos = secao.querySelector('.texto-narrativo');

    if (!imagem || !textos) return;

    // Esconde inicialmente
    imagem.style.opacity = '0';
    textos.style.opacity = '0';

    // Observer para disparar quando entrar na viewport
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.animatedSections.has('coruja')) {
          this.animatedSections.add('coruja');
          console.log('🦉 Animando seção da Coruja');

          // Padrão imagem-primeiro
          animationHelper.imageFirstPattern(imagem, textos, 2000);
        }
      });
    }, { threshold: 0.3 });

    observer.observe(secao);
  }

  /**
   * Animação para seção do Voldemort (Cap 7 - Derrota)
   */
  setupVoldemortSection(secao) {
    const imagem = secao.querySelector('.imagem-voldemort-final');
    const textos = secao.querySelector('.texto-narrativo');

    if (!imagem || !textos) return;

    // Esconde inicialmente
    imagem.style.opacity = '0';
    textos.style.opacity = '0';

    // Observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.animatedSections.has('voldemort')) {
          this.animatedSections.add('voldemort');
          console.log('🐍 Animando seção do Voldemort');

          // Padrão imagem-primeiro (mais dramático - 3s sozinha)
          animationHelper.imageFirstPattern(imagem, textos, 3000);
        }
      });
    }, { threshold: 0.3 });

    observer.observe(secao);
  }

  /**
   * Animação para seções do Calvário (Cap 8)
   */
  setupCalvarioSection(secao) {
    const imagem = secao.querySelector('.imagem-calvario');
    const textos = secao.querySelector('.texto-narrativo');

    if (!imagem || !textos) return;

    // Esconde inicialmente
    imagem.style.opacity = '0';
    textos.style.opacity = '0';

    const sectionId = secao.id;

    // Observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.animatedSections.has(sectionId)) {
          this.animatedSections.add(sectionId);
          console.log(`✝️ Animando seção do Calvário (${sectionId})`);

          // Padrão imagem-primeiro (tempo maior - imagem contemplativa)
          animationHelper.imageFirstPattern(imagem, textos, 4000);
        }
      });
    }, { threshold: 0.3 });

    observer.observe(secao);
  }

  /**
   * Animação para seção Jesus e Casal (Cap 8 - Final Feliz)
   */
  setupJesusCasalSection(secao) {
    const imagem = secao.querySelector('.imagem-jesus-casal');
    const textos = secao.querySelector('.texto-narrativo');

    if (!imagem || !textos) return;

    // Esconde inicialmente
    imagem.style.opacity = '0';
    textos.style.opacity = '0';

    // Observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.animatedSections.has('jesus-casal')) {
          this.animatedSections.add('jesus-casal');
          console.log('❤️ Animando seção Jesus e Casal');

          // Padrão imagem-primeiro (tempo generoso - momento emocional)
          animationHelper.imageFirstPattern(imagem, textos, 3500);
        }
      });
    }, { threshold: 0.3 });

    observer.observe(secao);
  }

  /**
   * Aplica animação linha-por-linha em seções de texto puro
   * (sem imagem, apenas narrativa)
   */
  animateTextOnlySection(sectionId) {
    const secao = document.querySelector(`#${sectionId}`);
    if (!secao) return;

    const textos = secao.querySelector('.texto-narrativo');
    if (!textos) return;

    // Esconde inicialmente
    textos.style.opacity = '0';

    // Observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.animatedSections.has(sectionId)) {
          this.animatedSections.add(sectionId);
          console.log(`📝 Animando texto em ${sectionId}`);

          // Apenas texto linha por linha
          animationHelper.animateTextLineByLine(textos, 800, 1);
        }
      });
    }, { threshold: 0.3 });

    observer.observe(secao);
  }

  /**
   * Reset (para debug/testes)
   */
  reset() {
    this.animatedSections.clear();
    console.log('🔄 Animações de seção resetadas');
  }
}

// Exporta instância singleton
export const sectionAnimations = new SectionAnimations();
