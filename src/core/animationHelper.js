/**
 * Animation Helper - Sistema Global de Animações
 * Helpers reutilizáveis para criar experiências visuais consistentes
 */

import gsap from 'gsap';

class AnimationHelper {
  /**
   * Anima texto linha por linha com fade-in
   * @param {HTMLElement} container - Container com o texto
   * @param {number} delayBetweenLines - Delay entre cada linha (ms)
   * @param {number} fadeDuration - Duração do fade de cada linha (s)
   * @param {Function} callback - Função executada quando terminar
   */
  animateTextLineByLine(container, delayBetweenLines = 800, fadeDuration = 1, callback = null) {
    if (!container) {
      console.warn('Container não encontrado para animação de texto');
      return;
    }

    // Pega todos os parágrafos
    const paragraphs = container.querySelectorAll('p');

    if (paragraphs.length === 0) {
      console.warn('Nenhum parágrafo encontrado no container');
      return;
    }

    // Esconde todos os parágrafos
    paragraphs.forEach(p => {
      p.style.opacity = '0';
      p.style.transform = 'translateY(10px)';
    });

    // Timeline para animar sequencialmente
    const timeline = gsap.timeline({
      onComplete: () => {
        console.log('✅ Animação de texto completa');
        if (callback) callback();
      }
    });

    // Adiciona cada parágrafo à timeline
    paragraphs.forEach((p, index) => {
      timeline.to(p, {
        opacity: 1,
        y: 0,
        duration: fadeDuration,
        ease: 'power2.out'
      }, index * (delayBetweenLines / 1000)); // Converte ms para s
    });

    return timeline;
  }

  /**
   * Padrão IMAGEM-PRIMEIRO: mostra imagem, aguarda, depois texto
   * @param {HTMLElement} imageElement - Elemento de imagem
   * @param {HTMLElement} textContainer - Container de texto
   * @param {number} imageDelay - Tempo que imagem fica sozinha (ms)
   * @param {Function} callback - Função executada quando terminar
   */
  imageFirstPattern(imageElement, textContainer, imageDelay = 2000, callback = null) {
    if (!imageElement || !textContainer) {
      console.warn('Imagem ou texto não encontrado para padrão image-first');
      return;
    }

    console.log('🖼️ Iniciando padrão imagem-primeiro');

    // Esconde ambos inicialmente
    imageElement.style.opacity = '0';
    textContainer.style.opacity = '0';

    const timeline = gsap.timeline({
      onComplete: () => {
        console.log('✅ Padrão imagem-primeiro completo');
        if (callback) callback();
      }
    });

    // 1. Mostra IMAGEM com fade + scale
    timeline.fromTo(imageElement,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 1.5, ease: 'power2.out' }
    );

    // 2. AGUARDA (imagem sozinha na tela)
    timeline.to({}, { duration: imageDelay / 1000 });

    // 3. Mostra TEXTO linha por linha
    timeline.add(() => {
      this.animateTextLineByLine(textContainer, 600, 1);
    });

    return timeline;
  }

  /**
   * Fade-in simples de elemento
   * @param {HTMLElement} element - Elemento para fazer fade-in
   * @param {number} duration - Duração (s)
   * @param {number} delay - Delay antes de começar (s)
   */
  fadeIn(element, duration = 1, delay = 0) {
    if (!element) return;

    element.style.opacity = '0';

    return gsap.to(element, {
      opacity: 1,
      duration: duration,
      delay: delay,
      ease: 'power2.out'
    });
  }

  /**
   * Fade-out simples de elemento
   * @param {HTMLElement} element - Elemento para fazer fade-out
   * @param {number} duration - Duração (s)
   * @param {Function} callback - Função executada quando terminar
   */
  fadeOut(element, duration = 1, callback = null) {
    if (!element) return;

    return gsap.to(element, {
      opacity: 0,
      duration: duration,
      ease: 'power2.in',
      onComplete: () => {
        if (callback) callback();
      }
    });
  }

  /**
   * Transição suave entre seções (fade out atual → fade in próxima)
   * @param {HTMLElement} currentSection - Seção atual
   * @param {HTMLElement} nextSection - Próxima seção
   * @param {number} duration - Duração da transição (s)
   * @param {Function} callback - Função executada quando terminar
   */
  transitionBetweenSections(currentSection, nextSection, duration = 1.5, callback = null) {
    const timeline = gsap.timeline({
      onComplete: () => {
        if (currentSection) currentSection.style.display = 'none';
        if (callback) callback();
      }
    });

    // Fade out seção atual
    if (currentSection) {
      timeline.to(currentSection, {
        opacity: 0,
        duration: duration * 0.5,
        ease: 'power2.in'
      });
    }

    // Pequena pausa (respiro)
    timeline.to({}, { duration: 0.3 });

    // Fade in próxima seção
    if (nextSection) {
      nextSection.style.display = 'flex';
      nextSection.style.opacity = '0';

      timeline.to(nextSection, {
        opacity: 1,
        duration: duration * 0.5,
        ease: 'power2.out'
      });
    }

    return timeline;
  }

  /**
   * Anima entrada de objeto 3D (usado pelo scrollManager)
   * @param {string} objectName - Nome do objeto no sceneManager
   * @param {string} animationType - Tipo de animação ('entrada', 'secao1', 'secao2', etc)
   * @param {Function} callback - Função executada quando terminar
   */
  animate3DObject(objectName, animationType, callback = null) {
    // Importa dinamicamente para evitar dependência circular
    import('./sceneManager.js').then(module => {
      const objeto = module.cenaGlobal.obterObjeto(objectName);

      if (!objeto) {
        console.warn(`Objeto 3D "${objectName}" não encontrado`);
        return;
      }

      // Mostra objeto
      module.cenaGlobal.mostrarObjeto(objectName);

      // Executa animação apropriada
      if (typeof objeto[animationType] === 'function') {
        console.log(`🎬 Animando ${objectName}: ${animationType}`);
        objeto[animationType](callback);
      } else {
        console.warn(`Animação "${animationType}" não existe para ${objectName}`);
        if (callback) callback();
      }
    });
  }

  /**
   * Helper: delay promise
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Exporta instância singleton
export const animationHelper = new AnimationHelper();
