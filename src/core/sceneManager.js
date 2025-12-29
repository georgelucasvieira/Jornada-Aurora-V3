/**
 * Scene Manager - Gerenciador de Cena 3D
 * Controla a cena Three.js de forma minimalista
 */

import * as THREE from 'three';
import { estadoGlobal } from './stateManager.js';

class SceneManager {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.canvas = null;
    this.objetos = new Map();
    this.animationId = null;
    this.clock = new THREE.Clock();
  }

  /**
   * Inicializa cena Three.js
   */
  inicializar(canvasId = 'canvas-3d') {
    // Cria ou obtém canvas
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      this.canvas.id = canvasId;
      this.canvas.className = 'canvas-3d';
      document.body.appendChild(this.canvas);
    }

    // Cria cena
    this.scene = new THREE.Scene();
    this.scene.background = null; // Transparente para overlay

    // Cria câmera
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, 10);
    this.camera.lookAt(0, 0, 0);

    // Cria renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Iluminação básica
    this.configurarIluminacao();

    // Resize handler
    window.addEventListener('resize', () => this.onResize());

    // Inicia loop de animação
    this.animate();
  }

  /**
   * Configura iluminação da cena
   */
  configurarIluminacao() {
    // Luz ambiente suave
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    // Luz direcional principal
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    this.scene.add(directionalLight);

    // Luz de preenchimento
    const fillLight = new THREE.DirectionalLight(0x8888ff, 0.3);
    fillLight.position.set(-5, 0, -5);
    this.scene.add(fillLight);
  }

  /**
   * Adiciona objeto à cena
   */
  adicionarObjeto(nome, objeto) {
    this.objetos.set(nome, objeto);

    if (objeto.mesh) {
      this.scene.add(objeto.mesh);
    }

    // Inicializa objeto se tiver método init
    if (objeto.init && typeof objeto.init === 'function') {
      objeto.init(this.scene);
    }
  }

  /**
   * Remove objeto da cena
   */
  removerObjeto(nome) {
    const objeto = this.objetos.get(nome);
    if (objeto && objeto.mesh) {
      this.scene.remove(objeto.mesh);

      // Limpa recursos se objeto tiver método dispose
      if (objeto.dispose && typeof objeto.dispose === 'function') {
        objeto.dispose();
      }
    }
    this.objetos.delete(nome);
  }

  /**
   * Obtém objeto por nome
   */
  obterObjeto(nome) {
    return this.objetos.get(nome);
  }

  /**
   * Mostra objeto 3D
   */
  mostrarObjeto(nome) {
    const objeto = this.objetos.get(nome);
    if (objeto) {
      if (objeto.mostrar && typeof objeto.mostrar === 'function') {
        objeto.mostrar();
      } else if (objeto.mesh) {
        objeto.mesh.visible = true;
      }
      estadoGlobal.definirObjetoAtivo(nome);
    }
  }

  /**
   * Esconde objeto 3D
   */
  esconderObjeto(nome) {
    const objeto = this.objetos.get(nome);
    if (objeto) {
      if (objeto.esconder && typeof objeto.esconder === 'function') {
        objeto.esconder();
      } else if (objeto.mesh) {
        objeto.mesh.visible = false;
      }

      if (estadoGlobal.obter('objetoAtivo') === nome) {
        estadoGlobal.definirObjetoAtivo(null);
      }
    }
  }

  /**
   * Esconde todos os objetos
   */
  esconderTodos() {
    this.objetos.forEach((objeto, nome) => {
      this.esconderObjeto(nome);
    });
  }

  /**
   * Loop de animação
   */
  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();
    const elapsed = this.clock.getElapsedTime();

    // Atualiza todos os objetos
    this.objetos.forEach(objeto => {
      if (objeto.update && typeof objeto.update === 'function') {
        objeto.update(delta, elapsed);
      }
    });

    this.renderer.render(this.scene, this.camera);
  }

  /**
   * Resize handler
   */
  onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  /**
   * Para animação
   */
  parar() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  /**
   * Resume animação
   */
  resumir() {
    if (!this.animationId) {
      this.animate();
    }
  }

  /**
   * Limpa cena completamente
   */
  limpar() {
    // Remove todos os objetos
    this.objetos.forEach((objeto, nome) => {
      this.removerObjeto(nome);
    });

    // Para animação
    this.parar();

    // Remove event listeners
    window.removeEventListener('resize', this.onResize);

    // Limpa renderer
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer = null;
    }

    // Remove canvas
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
      this.canvas = null;
    }

    this.scene = null;
    this.camera = null;
  }

  /**
   * Define visibilidade do canvas
   */
  definirVisibilidade(visivel) {
    if (this.canvas) {
      this.canvas.style.opacity = visivel ? '1' : '0';
      this.canvas.style.pointerEvents = visivel ? 'auto' : 'none';
    }
  }
}

// Exporta instância singleton
export const cenaGlobal = new SceneManager();
