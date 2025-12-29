/**
 * Fênix - Objeto 3D Narrativo
 * Mock: cone com material emissivo representando a fênix
 */

import * as THREE from 'three';
import { MockObject } from './mockObject.js';
import gsap from 'gsap';

export class Fenix extends MockObject {
  constructor() {
    super({
      geometry: 'cone',
      color: 0xff6b35, // Laranja/vermelho
      emissive: 0xff3300, // Emissão forte
      size: 0.6,
      wireframe: false
    });

    this.posicaoInicial = { x: 0, y: -6, z: 0 };
    this.animacaoAtiva = null;
  }

  /**
   * Inicializa fênix
   */
  init(scene) {
    // Rotaciona para parecer voando
    this.mesh.rotation.z = -Math.PI / 4;
    this.definirPosicao(this.posicaoInicial.x, this.posicaoInicial.y, this.posicaoInicial.z);

    // Adiciona luz pontual para efeito de fogo
    const luz = new THREE.PointLight(0xff6b35, 1, 5);
    this.mesh.add(luz);
  }

  /**
   * Animação idle (voo suave)
   */
  update(delta, elapsed) {
    if (!this.mesh || !this.mesh.visible) return;

    this.time = elapsed;

    // Balanço de voo
    this.mesh.rotation.z = -Math.PI / 4 + Math.sin(elapsed * 2) * 0.2;

    // Movimento de batida de asas (escala)
    const batida = 0.6 + Math.abs(Math.sin(elapsed * 4)) * 0.2;
    this.mesh.scale.set(batida, batida * 1.2, batida);

    // Pulsação da emissão (fogo)
    const intensidade = 0.5 + Math.sin(elapsed * 3) * 0.5;
    this.mesh.material.emissiveIntensity = intensidade;
  }

  /**
   * Surge de baixo
   */
  surgir(duracao = 3, callback) {
    this.mostrar();
    this.definirPosicao(this.posicaoInicial.x, this.posicaoInicial.y, this.posicaoInicial.z);

    this.animacaoAtiva = gsap.to(this.mesh.position, {
      y: 0,
      duration: duracao,
      ease: 'power2.out',
      onComplete: callback
    });
  }

  /**
   * Voa para cima e desaparece
   */
  desaparecer(duracao = 3, callback) {
    this.animacaoAtiva = gsap.to(this.mesh.position, {
      y: 6,
      duration: duracao,
      ease: 'power2.in',
      onComplete: () => {
        this.esconder();
        if (callback) callback();
      }
    });

    // Fade out da opacidade
    gsap.to(this.mesh.material, {
      opacity: 0,
      duration: duracao,
      onComplete: () => {
        this.mesh.material.opacity = 1;
      }
    });
  }

  /**
   * Guia o olhar (voa para posição específica)
   */
  guiarPara(x, y, z, duracao = 2, callback) {
    this.animacaoAtiva = gsap.to(this.mesh.position, {
      x,
      y,
      z,
      duration: duracao,
      ease: 'power1.inOut',
      onComplete: callback
    });
  }

  /**
   * Circula ao redor de um ponto
   */
  circularAoRedor(raio = 2, duracao = 5) {
    const centro = { x: 0, y: 0 };

    this.animacaoAtiva = gsap.to({}, {
      duration: duracao,
      repeat: -1,
      ease: 'none',
      onUpdate: function() {
        const progresso = this.progress();
        const angulo = progresso * Math.PI * 2;

        if (this.mesh) {
          this.mesh.position.x = centro.x + Math.cos(angulo) * raio;
          this.mesh.position.y = centro.y + Math.sin(angulo) * raio;
        }
      }.bind(this)
    });
  }

  /**
   * Para todas as animações
   */
  pararAnimacoes() {
    if (this.animacaoAtiva) {
      this.animacaoAtiva.kill();
      this.animacaoAtiva = null;
    }
    gsap.killTweensOf(this.mesh.position);
    gsap.killTweensOf(this.mesh.material);
  }

  /**
   * Reseta posição
   */
  resetar() {
    this.pararAnimacoes();
    this.definirPosicao(this.posicaoInicial.x, this.posicaoInicial.y, this.posicaoInicial.z);
    this.definirEscala(0.6);
    this.mesh.material.opacity = 1;
    this.esconder();
  }
}
