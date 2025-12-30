/**
 * Cap 8 - Cinematic Sequence Manager
 * USA O SCROLLMANAGER EXISTENTE - fade-out, scroll, fade-in
 */

import { estadoGlobal } from '../core/stateManager.js';
import { audioGlobal } from '../core/audioManager.js';
import { scrollGlobal } from '../core/scrollManagerStory.js';
import gsap from 'gsap';

export class Cap8Cinematic {
  constructor() {
    this.sequenciaIniciada = false;
    this.indiceAtual = 0;
  }

  inicializar() {
    this.configurarPedraRessurreição();
    console.log('✅ Cap 8 Cinematic inicializado');
  }

  async iniciarSequenciaCinematica() {
    if (this.sequenciaIniciada) return;
    this.sequenciaIniciada = true;

    console.log('✨ Cap 8 - Sequência cinematográfica iniciada');

    // Garante que scroll está bloqueado e seta escondida
    estadoGlobal.definir('scrollBloqueado', true);
    scrollGlobal.esconderSeta();

    // Lista de seções do Cap 8 na ordem
    const secoes = [
      '#cap8-pos-derrota',
      '#cap8-revelacao',
      '#cap8-sacrificio',
      '#cap8-vitoria',
      '#cap8-pedra'
    ];

    // Progride por cada seção automaticamente
    for (let i = 0; i < secoes.length; i++) {
      const secao = document.querySelector(secoes[i]);
      if (!secao) continue;

      console.log(`🎬 Exibindo: ${secoes[i]}`);

      // Mostra textos da seção atual
      await this.exibirTextos(secao, 2000);

      // Se não for a última seção, faz transição
      if (i < secoes.length - 1) {
        // Aguarda 4s
        await this.delay(4000);

        // Fade-out
        await this.fadeOut(secao);

        // Próxima seção
        const proximaSecao = document.querySelector(secoes[i + 1]);
        const indice = scrollGlobal.secoes.indexOf(proximaSecao);
        if (indice !== -1) {
          scrollGlobal.irParaSecao(indice, 1.5);
        }

        // Fade-in
        await this.fadeIn(proximaSecao);
      }
    }

    console.log('✅ Cap 8 - Aguardando clique na Pedra');
  }

  async exibirTextos(secao, delay) {
    // Garante que seção está visível
    secao.style.opacity = '1';

    // Exibe imagem se tiver
    const imagem = secao.querySelector('.imagem-calvario');
    if (imagem) {
      imagem.style.opacity = '0';
      gsap.to(imagem, { opacity: 1, duration: 1.5 });
      await this.delay(2000);
    }

    // Exibe textos
    const textos = secao.querySelectorAll('.texto-narrativo p, .versiculo-referencia, .versiculo-texto');
    for (const texto of textos) {
      texto.style.opacity = '0';
      gsap.to(texto, { opacity: 1, duration: 1 });
      await this.delay(delay);
    }

    // Exibe botão se for a Pedra
    const botao = secao.querySelector('#btn-pedra-ressurreicao');
    if (botao) {
      botao.style.opacity = '0';
      gsap.to(botao, { opacity: 1, duration: 2 });
    }
  }

  async fadeOut(secao) {
    return new Promise(resolve => {
      gsap.to(secao, {
        opacity: 0,
        duration: 1.5,
        onComplete: resolve
      });
    });
  }

  async fadeIn(secao) {
    secao.style.opacity = '0';
    return new Promise(resolve => {
      gsap.to(secao, {
        opacity: 1,
        duration: 1.5,
        onComplete: resolve
      });
    });
  }

  configurarPedraRessurreição() {
    const botao = document.querySelector('#btn-pedra-ressurreicao');
    if (!botao) return;

    botao.addEventListener('click', async () => {
      console.log('💎 Pedra clicada!');
      audioGlobal.pararMusica(1500);
      audioGlobal.tocarSFX('luz');
      audioGlobal.tocarMusica('alegre', 1500);
      console.log('🎵 Música Alegre iniciada');

      if (audioGlobal.sfx.chuva?.playing()) {
        audioGlobal.sfx.chuva.stop();
      }

      await this.iniciarPosCreditos();
    });
  }

  async iniciarPosCreditos() {
    console.log('🎬 Pós-créditos');

    // Fade out Pedra
    const pedra = document.querySelector('#cap8-pedra');
    if (pedra) {
      await this.fadeOut(pedra);
    }

    // Cria overlay pós-créditos
    let overlay = document.querySelector('#cap8-pos-creditos');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'cap8-pos-creditos';
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: white;
        z-index: 10000;
        opacity: 0;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        padding: 4rem 2rem;
      `;

      overlay.innerHTML = `
        <div style="min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; opacity: 0;" class="epilogo-container">
          <p style="font-size: 1.5rem; color: black; margin-bottom: 1.5rem; font-family: 'Cinzel', serif; text-align: center;">
            Você chegou até aqui.
          </p>
          <p style="font-size: 1.5rem; color: black; margin-bottom: 1.5rem; font-family: 'Cinzel', serif; text-align: center;">
            Não porque acertou tudo.
          </p>
          <p style="font-size: 1.5rem; color: black; margin-bottom: 1.5rem; font-family: 'Cinzel', serif; text-align: center;">
            Nem porque foi forte o bastante.
          </p>
          <p style="font-size: 1.5rem; color: black; font-family: 'Cinzel', serif; text-align: center;">
            Mas porque permaneceu.
          </p>
        </div>

        <div style="min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; opacity: 0;" class="vida-nova-container">
          <p style="font-size: 1.3rem; color: black; margin-bottom: 1rem; font-family: 'Cinzel', serif; font-style: italic; text-align: center;">
            Apocalipse 21:5
          </p>
          <p style="font-size: 1.8rem; color: black; font-family: 'Cinzel', serif; text-align: center;">
            "Eis que faço novas todas as coisas."
          </p>
        </div>

        <div style="min-height: 100vh; display: flex; justify-content: center; align-items: center; opacity: 0;" class="imagem-final-container">
          <img src="src/assets/images/jesus-casal.jpg" alt="Cristo e o Casal" style="max-width: 600px; width: 100%; border-radius: 8px; box-shadow: 0 8px 32px rgba(0,0,0,0.2);" />
        </div>
      `;

      document.body.appendChild(overlay);
    }

    // Flash branco
    overlay.style.display = 'flex';
    gsap.to(overlay, { opacity: 1, duration: 2 });
    await this.delay(2500);

    // Fade in de todos os containers (aparecem juntos)
    const containers = overlay.querySelectorAll('.epilogo-container, .vida-nova-container, .imagem-final-container');
    containers.forEach(container => {
      gsap.to(container, { opacity: 1, duration: 3 });
    });

    await this.delay(3000);

    // SCROLL CONSTANTE estilo pós-créditos
    // Calcula altura total do conteúdo
    const alturaTotal = overlay.scrollHeight - overlay.clientHeight;

    // Scroll constante e lento (30 segundos para percorrer tudo)
    gsap.to(overlay, {
      scrollTop: alturaTotal,
      duration: 30,
      ease: 'none', // Linear, sem easing
      onComplete: () => {
        console.log('✅ Pós-créditos concluído');
      }
    });
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  reset() {
    this.sequenciaIniciada = false;
    const secoes = ['#cap8-pos-derrota', '#cap8-revelacao', '#cap8-sacrificio', '#cap8-vitoria', '#cap8-pedra', '#cap8-pos-creditos'];
    secoes.forEach(sel => {
      const el = document.querySelector(sel);
      if (el) {
        el.style.display = 'none';
        el.style.opacity = '0';
      }
    });
  }
}

export const cap8Cinematic = new Cap8Cinematic();
