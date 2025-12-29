/**
 * Cap 8 - Cinematic Sequence Manager
 * Gerencia a sequência cinematográfica automatizada do Cap 8 (pós-derrota)
 *
 * COMPORTAMENTO:
 * - Remove interação do usuário (scroll desabilitado)
 * - Fade-in/fade-out automático de textos e imagens
 * - Delays pré-definidos:
 *   - 2s para exibir cada texto
 *   - 4s para transição entre sections
 *   - 2s para exibir imagens
 * - Pós-créditos após clicar na Pedra da Ressurreição
 */

import { estadoGlobal } from '../core/stateManager.js';
import { audioGlobal } from '../core/audioManager.js';
import gsap from 'gsap';

export class Cap8Cinematic {
  constructor() {
    this.sequenciaIniciada = false;
    this.sequenciaAtiva = false;
  }

  /**
   * Inicializa o observador para detectar entrada no Cap 8
   */
  inicializar() {
    this.configurarObservador();
    this.configurarPedraResurreiçao();
  }

  /**
   * Configura IntersectionObserver para detectar quando usuário chega no Cap 8
   */
  configurarObservador() {
    const cap8PosDerrota = document.querySelector('#cap8-pos-derrota');

    if (!cap8PosDerrota) {
      console.warn('Seção #cap8-pos-derrota não encontrada');
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5 && !this.sequenciaIniciada) {
          console.log('🎬 Iniciando sequência cinematográfica Cap 8');
          this.iniciarSequenciaCinematica();
        }
      });
    }, { threshold: 0.5 });

    observer.observe(cap8PosDerrota);
  }

  /**
   * Inicia a sequência cinematográfica completa do Cap 8
   *
   * SEQUÊNCIA:
   * 1. Cap 8 - Pós-Derrota (textos sobre a derrota)
   * 2. Cap 8 - Revelação (Calvário esquerda + textos)
   * 3. Cap 8 - Sacrifício (Calvário direita + textos + versículo)
   * 4. Cap 8 - Vitória (textos + versículo)
   * 5. Cap 8 - Pedra da Ressurreição (botão interativo)
   */
  async iniciarSequenciaCinematica() {
    if (this.sequenciaIniciada) return;
    this.sequenciaIniciada = true;
    this.sequenciaAtiva = true;

    console.log('✨ Cap 8 - Sequência cinematográfica automatizada iniciada');

    // Desabilita scroll
    estadoGlobal.definir('scrollBloqueado', true);

    // Música já deve estar tocando (triste.mp3)
    // SFX chuva já deve estar tocando (configurado no scrollManager)

    // ========== SECTION 1: Pós-Derrota ==========
    // Textos já existem no HTML, apenas controla exibição
    await this.exibirSecao('#cap8-pos-derrota', {
      temImagem: false,
      usarTextosExistentes: true, // Usa textos do HTML
      delayTexto: 2000,
      delayTransicao: 4000
    });

    // ========== SECTION 2: Revelação (Calvário esquerda) ==========
    await this.exibirSecao('#cap8-revelacao', {
      imagem: '.imagem-calvario',
      temImagem: true,
      usarTextosExistentes: true,
      delayImagem: 2000,
      delayTexto: 2000,
      delayTransicao: 4000
    });

    // ========== SECTION 3: Sacrifício (Calvário direita) ==========
    await this.exibirSecao('#cap8-sacrificio', {
      imagem: '.imagem-calvario',
      temImagem: true,
      usarTextosExistentes: true,
      delayImagem: 2000,
      delayTexto: 2000,
      delayTransicao: 4000
    });

    // ========== SECTION 4: Vitória (apenas textos) ==========
    await this.exibirSecao('#cap8-vitoria', {
      temImagem: false,
      usarTextosExistentes: true,
      delayTexto: 2000,
      delayTransicao: 4000
    });

    // ========== SECTION 5: Pedra da Ressurreição ==========
    // Esta seção é interativa - aguarda clique do usuário
    await this.exibirSecaoPedra();

    console.log('✅ Cap 8 - Sequência cinematográfica pré-Pedra concluída');
  }

  /**
   * Exibe uma seção com fade-in/fade-out automático
   * @param {string} seletor - Seletor CSS da seção
   * @param {object} config - Configuração da seção
   */
  async exibirSecao(seletor, config) {
    const secao = document.querySelector(seletor);
    if (!secao) {
      console.warn(`Seção ${seletor} não encontrada`);
      return;
    }

    console.log(`🎬 Exibindo seção: ${seletor}`);

    // Mostra a seção
    secao.style.display = 'flex';
    secao.style.opacity = '0';

    // Se tem imagem, exibe primeiro
    if (config.temImagem && config.imagem) {
      const imagemEl = secao.querySelector(config.imagem);
      if (imagemEl) {
        imagemEl.style.opacity = '0';
        imagemEl.style.display = 'block';

        // IMPORTANTE: Remove transformações de scroll (left/right)
        imagemEl.style.transform = 'none';

        gsap.to(imagemEl, {
          opacity: 1,
          duration: 1.5,
          ease: 'power2.inOut'
        });

        await this.delay(config.delayImagem || 2000);
      }
    }

    // Fade in da seção
    gsap.to(secao, {
      opacity: 1,
      duration: 1.5,
      ease: 'power2.inOut'
    });

    // Exibe textos em sequência
    if (config.usarTextosExistentes) {
      // Usa textos que já existem no HTML
      const textosEl = secao.querySelectorAll('.texto-narrativo p');

      for (let i = 0; i < textosEl.length; i++) {
        const textoEl = textosEl[i];
        if (!textoEl) continue;

        // Reseta opacity (caso já tenha sido modificada)
        textoEl.style.opacity = '0';

        // Fade in do texto
        gsap.to(textoEl, {
          opacity: 1,
          duration: 1,
          ease: 'power2.inOut'
        });

        await this.delay(config.delayTexto || 2000);

        // NÃO faz fade out - mantém todos visíveis
        // (efeito acumulativo mais bonito)
      }
    } else if (config.textos && config.textos.length > 0) {
      // Define textos manualmente (caso especial)
      const textosEl = secao.querySelectorAll('.texto-narrativo p');

      for (let i = 0; i < config.textos.length; i++) {
        const textoEl = textosEl[i];
        if (!textoEl) continue;

        // Define texto
        textoEl.textContent = config.textos[i];
        textoEl.style.opacity = '0';

        // Fade in do texto
        gsap.to(textoEl, {
          opacity: 1,
          duration: 1,
          ease: 'power2.inOut'
        });

        await this.delay(config.delayTexto || 2000);
      }
    }

    // Aguarda antes de transição
    await this.delay(config.delayTransicao || 4000);

    // Fade out da seção
    gsap.to(secao, {
      opacity: 0,
      duration: 1.5,
      ease: 'power2.inOut',
      onComplete: () => {
        secao.style.display = 'none';
      }
    });

    await this.delay(1500); // Aguarda fade out completar
  }

  /**
   * Exibe a seção da Pedra da Ressurreição (interativa)
   */
  async exibirSecaoPedra() {
    const secaoPedra = document.querySelector('#cap8-pedra');
    if (!secaoPedra) {
      console.warn('Seção #cap8-pedra não encontrada');
      return;
    }

    console.log('💎 Exibindo seção da Pedra da Ressurreição');

    // Mostra a seção
    secaoPedra.style.display = 'flex';
    secaoPedra.style.opacity = '0';

    // Fade in da seção
    gsap.to(secaoPedra, {
      opacity: 1,
      duration: 2,
      ease: 'power2.inOut'
    });

    // Textos aparecem primeiro
    const textosEl = secaoPedra.querySelectorAll('.texto-narrativo p');
    for (const textoEl of textosEl) {
      textoEl.style.opacity = '0';
      gsap.to(textoEl, {
        opacity: 1,
        duration: 1.5,
        ease: 'power2.inOut'
      });
      await this.delay(2000);
    }

    // Pedra aparece por último
    const pedraEl = secaoPedra.querySelector('#btn-pedra-ressurreicao');
    if (pedraEl) {
      pedraEl.style.opacity = '0';
      gsap.to(pedraEl, {
        opacity: 1,
        duration: 2,
        ease: 'power2.inOut'
      });
    }

    // Sequência aguarda interação do usuário (clique na Pedra)
    console.log('⏸️ Aguardando usuário clicar na Pedra da Ressurreição...');
  }

  /**
   * Configura o clique na Pedra da Ressurreição
   * Inicia a sequência pós-créditos
   */
  configurarPedraResurreiçao() {
    const pedraBtn = document.querySelector('#btn-pedra-ressurreicao');

    if (!pedraBtn) {
      console.warn('Botão #btn-pedra-ressurreicao não encontrado');
      return;
    }

    pedraBtn.addEventListener('click', async () => {
      console.log('💎 Pedra da Ressurreição clicada! Iniciando pós-créditos...');

      // SFX luz
      audioGlobal.tocarSFX('luz');

      // Troca música para alegre
      audioGlobal.trocarMusicaPorCapitulo('8_alegre', 2000, 3000);

      // Para chuva se estiver tocando
      if (audioGlobal.sfx.chuva && audioGlobal.sfx.chuva.playing()) {
        audioGlobal.sfx.chuva.stop();
      }

      await this.iniciarPosCreditos();
    });
  }

  /**
   * Inicia a sequência pós-créditos
   *
   * NOVA SEQUÊNCIA (conforme pedido):
   * 1. Flash branco (fundo branco)
   * 2. Textos do epílogo aparecem (cap8-transicao)
   * 3. Textos da vida nova aparecem (cap8-vida-nova)
   * 4. Imagem jesus-casal.jpg aparece
   */
  async iniciarPosCreditos() {
    console.log('🎬 Iniciando sequência pós-créditos');

    // Esconde seção da Pedra
    const secaoPedra = document.querySelector('#cap8-pedra');
    if (secaoPedra) {
      gsap.to(secaoPedra, {
        opacity: 0,
        duration: 1,
        onComplete: () => {
          secaoPedra.style.display = 'none';
        }
      });
    }

    await this.delay(1000);

    // ========== Cria container pós-créditos ==========
    let posCreditos = document.querySelector('#cap8-pos-creditos');

    if (!posCreditos) {
      posCreditos = document.createElement('section');
      posCreditos.id = 'cap8-pos-creditos';
      posCreditos.className = 'section section-pos-creditos';
      posCreditos.style.cssText = `
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background: white;
        padding: 2rem;
        opacity: 0;
      `;

      // EPÍLOGO (cap8-transicao texts)
      posCreditos.innerHTML = `
        <div class="texto-epilogo" style="text-align: center; margin-bottom: 3rem; opacity: 0;">
          <p style="font-size: 1.5rem; color: black; margin-bottom: 1.5rem; font-family: 'Cinzel', serif;">
            Você chegou até aqui.
          </p>
          <p style="font-size: 1.5rem; color: black; margin-bottom: 1.5rem; font-family: 'Cinzel', serif;">
            Não porque acertou tudo.
          </p>
          <p style="font-size: 1.5rem; color: black; margin-bottom: 1.5rem; font-family: 'Cinzel', serif;">
            Nem porque foi forte o bastante.
          </p>
          <p style="font-size: 1.5rem; color: black; margin-bottom: 3rem; font-family: 'Cinzel', serif;">
            Mas porque permaneceu.
          </p>
        </div>
        <div class="texto-vida-nova" style="text-align: center; margin-bottom: 3rem; opacity: 0;">
          <p style="font-size: 1.3rem; color: black; margin-bottom: 1rem; font-family: 'Cinzel', serif; font-style: italic;">
            Apocalipse 21:5
          </p>
          <p style="font-size: 1.8rem; color: black; font-family: 'Cinzel', serif;">
            "Eis que faço novas todas as coisas."
          </p>
        </div>
        <div class="imagem-pos-creditos" style="opacity: 0;">
          <img src="src/assets/images/jesus-casal.jpg" alt="Cristo e o Casal" style="max-width: 600px; width: 100%; border-radius: 8px; box-shadow: 0 8px 32px rgba(0,0,0,0.2);" />
        </div>
      `;

      document.querySelector('main').appendChild(posCreditos);
    }

    // Flash branco (fade in do fundo)
    posCreditos.style.display = 'flex';
    gsap.to(posCreditos, {
      opacity: 1,
      duration: 2,
      ease: 'power2.inOut'
    });

    await this.delay(2500);

    // ========== 1. Textos do EPÍLOGO aparecem (fade up) ==========
    const textoEpilogo = posCreditos.querySelector('.texto-epilogo');
    const textosEpilogo = textoEpilogo.querySelectorAll('p');

    // Fade in do container
    gsap.to(textoEpilogo, {
      opacity: 1,
      y: -20,
      duration: 2,
      ease: 'power2.out'
    });

    // Textos aparecem em sequência
    for (let i = 0; i < textosEpilogo.length; i++) {
      await this.delay(1000);
      gsap.to(textosEpilogo[i], {
        opacity: 1,
        y: -10,
        duration: 1.5,
        ease: 'power2.out'
      });
    }

    await this.delay(3000);

    // Fade out epílogo
    gsap.to(textoEpilogo, {
      opacity: 0,
      duration: 1.5,
      ease: 'power2.inOut'
    });

    await this.delay(2000);

    // ========== 2. Textos da VIDA NOVA aparecem (fade up) ==========
    const textoVidaNova = posCreditos.querySelector('.texto-vida-nova');
    const textosVidaNova = textoVidaNova.querySelectorAll('p');

    // Fade in do container
    gsap.to(textoVidaNova, {
      opacity: 1,
      y: -20,
      duration: 2,
      ease: 'power2.out'
    });

    // Textos aparecem em sequência
    for (let i = 0; i < textosVidaNova.length; i++) {
      await this.delay(1000);
      gsap.to(textosVidaNova[i], {
        opacity: 1,
        y: -10,
        duration: 1.5,
        ease: 'power2.out'
      });
    }

    await this.delay(4000);

    // Fade out vida nova
    gsap.to(textoVidaNova, {
      opacity: 0,
      duration: 1.5,
      ease: 'power2.inOut'
    });

    await this.delay(2000);

    // ========== 3. Imagem aparece (fade up) ==========
    const imagemContainer = posCreditos.querySelector('.imagem-pos-creditos');
    gsap.to(imagemContainer, {
      opacity: 1,
      y: -20,
      duration: 2.5,
      ease: 'power2.out'
    });

    await this.delay(3000);

    console.log('✅ Sequência pós-créditos concluída');
    this.sequenciaAtiva = false;

    // Mantém na tela (não avança mais)
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
    this.sequenciaAtiva = false;

    const secoes = [
      '#cap8-pos-derrota',
      '#cap8-revelacao',
      '#cap8-sacrificio',
      '#cap8-vitoria',
      '#cap8-pedra',
      '#cap8-pos-creditos'
    ];

    secoes.forEach(seletor => {
      const secao = document.querySelector(seletor);
      if (secao) {
        secao.style.display = 'none';
        secao.style.opacity = '0';
      }
    });

    console.log('🔄 Cap 8 Cinematic resetado');
  }
}

// Exporta instância global
export const cap8Cinematic = new Cap8Cinematic();
