/**
 * Penseira - Objeto 3D Narrativo (Cap 4 - Memórias)
 * Esfera representando a Penseira com efeito de líquido prateado
 */

import * as THREE from 'three';
import { MockObject } from './mockObject.js';
import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

// Registra plugin
gsap.registerPlugin(MotionPathPlugin);

export class Penseira extends MockObject {
  constructor() {
    super({
      geometry: 'sphere',
      color: 0xc0c0c0, // Prata
      emissive: 0x606060, // Brilho prateado
      size: 0.6,
      wireframe: false
    });

    // Escalas de referência
    this.escalaNormal = 0.6;
    this.escalaGrande = 1.0;

    // Timeline ativa
    this.timeline = null;

    // Posições de referência (mesmas do chapéu)
    this.posicoes = {
      foraTelaEmbaixo: { x: 0, y: -4, z: 0 },
      umTercoTela: { x: 0, y: -0.8, z: 0 },
      direitaSecao1: { x: 2, y: 0, z: 0 },
      esquerdaSecao2: { x: -1, y: -0.2, z: 0 },
      centroAcima: { x: 0, y: 0.8, z: 0 },
      centroDireita: { x: 1.5, y: 0, z: 0 },
      centroAbaixo: { x: 0, y: -0.5, z: 0 }
    };
  }

  /**
   * Inicializa Penseira
   */
  init(scene) {
    // Começa escondida fora da tela
    this.definirPosicao(
      this.posicoes.foraTelaEmbaixo.x,
      this.posicoes.foraTelaEmbaixo.y,
      this.posicoes.foraTelaEmbaixo.z
    );
    this.definirEscala(this.escalaGrande);
    this.esconder();
  }

  /**
   * Animação idle (rotação suave + brilho pulsante)
   */
  update(delta, elapsed) {
    if (!this.mesh || !this.mesh.visible) return;

    this.time = elapsed;

    // Rotação suave
    this.mesh.rotation.y = elapsed * 0.5;

    // Pulsação de brilho (efeito de líquido)
    const pulse = Math.sin(elapsed * 2) * 0.5 + 0.5;
    if (this.mesh.material) {
      this.mesh.material.emissiveIntensity = pulse * 0.8;
    }

    // Flutuação vertical
    const offsetY = Math.sin(elapsed * 1.2) * 0.05;
  }

  /**
   * ANIMAÇÃO DE ENTRADA
   * (igual ao chapéu)
   */
  animacaoEntrada(callback) {
    console.log('🔮 Iniciando animação de entrada da Penseira');

    this.pararAnimacoes();

    this.definirPosicao(
      this.posicoes.foraTelaEmbaixo.x,
      this.posicoes.foraTelaEmbaixo.y,
      this.posicoes.foraTelaEmbaixo.z
    );
    this.definirEscala(this.escalaGrande);
    this.mostrar();

    this.timeline = gsap.timeline({
      onComplete: () => {
        console.log('🔮 Animação de entrada completa');
        if (callback) callback();
      }
    });

    // Sobe para 1/3 da tela
    this.timeline.to(this.mesh.position, {
      y: this.posicoes.umTercoTela.y,
      duration: 2,
      ease: 'power2.out'
    });

    // Pausa de 2s
    this.timeline.to({}, { duration: 2 });

    return this.timeline;
  }

  /**
   * ANIMAÇÃO PARA SEÇÃO 1
   * (igual ao chapéu - move para direita)
   */
  animacaoSecao1(callback) {
    console.log('🔮 Animação Seção 1: movimento para direita');

    this.pararAnimacoes();

    this.timeline = gsap.timeline({
      onComplete: () => {
        console.log('🔮 Seção 1 posicionada');
        if (callback) callback();
      }
    });

    // Sobe
    this.timeline.to(this.mesh.position, {
      y: 2.0,
      duration: 0.5,
      ease: 'none'
    });

    // Trajetória CURVA para direita
    this.timeline.to(this.mesh.position, {
      motionPath: {
        path: [
          { x: 0, y: 2 },
          { x: 3, y: 1.5 },
          { x: this.posicoes.direitaSecao1.x, y: this.posicoes.direitaSecao1.y }
        ],
        curviness: 1,
        autoRotate: false
      },
      duration: 0.8,
      ease: 'power2.out'
    });

    // Escala normal
    this.timeline.to(this.mesh.scale, {
      x: this.escalaNormal,
      y: this.escalaNormal,
      z: this.escalaNormal,
      duration: 0.8,
      ease: 'power2.out'
    }, '-=0.8');

    return this.timeline;
  }

  /**
   * ANIMAÇÃO PARA SEÇÃO 2
   * (igual ao chapéu - move para esquerda)
   */
  animacaoSecao2(callback) {
    console.log('🔮 Animação Seção 2: movimento para esquerda');

    this.pararAnimacoes();

    this.timeline = gsap.timeline({
      onComplete: () => {
        console.log('🔮 Seção 2 posicionada');
        if (callback) callback();
      }
    });

    // Trajetória CURVA para esquerda
    this.timeline.to(this.mesh.position, {
      motionPath: {
        path: [
          { x: 0, y: 0 },
          { x: -0.6, y: -0.15 },
          { x: -0.7, y: -0.17 },
          { x: -0.65, y: -0.2 }
        ],
        curviness: 1,
        autoRotate: false
      },
      duration: 1.2,
      ease: 'power3.out'
    });

    return this.timeline;
  }

  /**
   * ANIMAÇÃO PARA SEÇÃO 3
   * (igual ao chapéu - trajetória curvilínea)
   */
  animacaoSecao3(callback) {
    console.log('🔮 Animação Seção 3: trajetória curvilínea fluida');

    this.pararAnimacoes();

    this.timeline = gsap.timeline({
      onComplete: () => {
        console.log('🔮 Seção 3 completa');
        if (callback) callback();
      }
    });

    // Movimento curvilíneo
    this.timeline.to(this.mesh.position, {
      motionPath: {
        path: [
          { x: this.posicoes.centroAcima.x, y: this.posicoes.centroAcima.y },
          { x: this.posicoes.centroDireita.x, y: this.posicoes.centroDireita.y },
          { x: this.posicoes.centroAbaixo.x, y: this.posicoes.centroAbaixo.y }
        ],
        curviness: 1.2,
        autoRotate: false
      },
      duration: 1.2,
      ease: 'power1.inOut'
    }, 0);

    // Escala muda
    this.timeline.to(this.mesh.scale, {
      keyframes: [
        { x: this.escalaNormal * 0.8, y: this.escalaNormal * 0.8, z: this.escalaNormal * 0.8, duration: 0.4 },
        { x: this.escalaNormal, y: this.escalaNormal, z: this.escalaNormal, duration: 0.4 },
        { x: this.escalaGrande, y: this.escalaGrande, z: this.escalaGrande, duration: 0.4 }
      ],
      ease: 'power1.inOut'
    }, 0);

    return this.timeline;
  }

  /**
   * ANIMAÇÃO PARA SEÇÃO 4
   * (igual ao chapéu - sai da tela)
   */
  animacaoSecao4(callback) {
    console.log('🔮 Animação Seção 4: descida para fora da tela');

    this.pararAnimacoes();

    this.timeline = gsap.timeline({
      onComplete: () => {
        console.log('🔮 Seção 4 completa - penseira desapareceu');
        this.esconder();
        if (callback) callback();
      }
    });

    // Desce para fora
    this.timeline.to(this.mesh.position, {
      motionPath: {
        path: [
          { x: this.posicoes.centroAbaixo.x, y: this.posicoes.centroAbaixo.y },
          { x: -1.5, y: -2 },
          { x: -2, y: -4 }
        ],
        curviness: 1,
        autoRotate: false
      },
      duration: 1,
      ease: 'power2.out'
    }, 0);

    // Fade out
    this.timeline.to(this.mesh.material, {
      opacity: 0,
      duration: 1.2,
      ease: 'power2.in',
      onStart: () => {
        this.mesh.material.transparent = true;
      }
    }, 0.3);

    return this.timeline;
  }

  /**
   * Animação de "falar" (pulsa)
   */
  falar(duracao = 1) {
    if (!this.mesh) return;

    const escalaAtual = this.mesh.scale.x;

    gsap.to(this.mesh.scale, {
      x: escalaAtual * 0.95,
      y: escalaAtual * 0.95,
      z: escalaAtual * 0.95,
      duration: duracao * 0.5,
      yoyo: true,
      repeat: Math.floor(duracao / 0.5) - 1,
      ease: 'sine.inOut'
    });
  }

  /**
   * Para todas as animações
   */
  pararAnimacoes() {
    if (this.timeline) {
      this.timeline.kill();
      this.timeline = null;
    }
    gsap.killTweensOf(this.mesh.position);
    gsap.killTweensOf(this.mesh.scale);
    gsap.killTweensOf(this.mesh.rotation);
    gsap.killTweensOf(this.mesh.material);
  }

  /**
   * Reseta posição
   */
  resetar() {
    this.pararAnimacoes();
    this.definirPosicao(
      this.posicoes.foraTelaEmbaixo.x,
      this.posicoes.foraTelaEmbaixo.y,
      this.posicoes.foraTelaEmbaixo.z
    );
    this.definirEscala(this.escalaGrande);

    if (this.mesh && this.mesh.material) {
      this.mesh.material.transparent = false;
      this.mesh.material.opacity = 1;
    }

    this.esconder();
  }
}
