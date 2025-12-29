/**
 * Mock Object - Classe base para objetos 3D mock
 * Cria geometrias simples até ter modelos reais
 */

import * as THREE from 'three';

export class MockObject {
  constructor(config = {}) {
    this.config = {
      geometry: 'box', // 'box', 'sphere', 'cone', 'cylinder'
      color: 0x646cff,
      emissive: 0x000000,
      size: 1,
      wireframe: false,
      ...config
    };

    this.mesh = null;
    this.visible = false;
    this.time = 0;

    this.criarMesh();
  }

  /**
   * Cria mesh mock
   */
  criarMesh() {
    let geometry;

    switch (this.config.geometry) {
      case 'sphere':
        geometry = new THREE.SphereGeometry(this.config.size, 32, 32);
        break;
      case 'cone':
        geometry = new THREE.ConeGeometry(this.config.size, this.config.size * 2, 32);
        break;
      case 'cylinder':
        geometry = new THREE.CylinderGeometry(
          this.config.size,
          this.config.size,
          this.config.size * 2,
          32
        );
        break;
      case 'box':
      default:
        geometry = new THREE.BoxGeometry(
          this.config.size,
          this.config.size,
          this.config.size
        );
        break;
    }

    const material = new THREE.MeshStandardMaterial({
      color: this.config.color,
      emissive: this.config.emissive,
      wireframe: this.config.wireframe,
      metalness: 0.3,
      roughness: 0.4,
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.visible = false;
  }

  /**
   * Inicializa objeto na cena
   */
  init(scene) {
    // Implementar em subclasses se necessário
  }

  /**
   * Atualiza objeto (idle animation)
   */
  update(delta, elapsed) {
    if (!this.mesh || !this.mesh.visible) return;

    this.time = elapsed;

    // Animação idle suave
    this.mesh.rotation.y = Math.sin(elapsed * 0.3) * 0.1;
    this.mesh.position.y += Math.sin(elapsed * 2) * 0.001;
  }

  /**
   * Mostra objeto
   */
  mostrar() {
    if (this.mesh) {
      this.mesh.visible = true;
      this.visible = true;
    }
  }

  /**
   * Esconde objeto
   */
  esconder() {
    if (this.mesh) {
      this.mesh.visible = false;
      this.visible = false;
    }
  }

  /**
   * Define posição
   */
  definirPosicao(x, y, z) {
    if (this.mesh) {
      this.mesh.position.set(x, y, z);
    }
  }

  /**
   * Define escala
   */
  definirEscala(escala) {
    if (this.mesh) {
      this.mesh.scale.setScalar(escala);
    }
  }

  /**
   * Limpa recursos
   */
  dispose() {
    if (this.mesh) {
      this.mesh.geometry.dispose();
      this.mesh.material.dispose();
    }
  }
}
