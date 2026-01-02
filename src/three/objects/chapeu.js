/**
 * Chapéu Seletor - Objeto 3D Narrativo
 * Cone representando o chapéu com animações complexas
 */

import * as THREE from 'three';
import { MockObject } from './mockObject.js';
import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Registra plugin
gsap.registerPlugin(MotionPathPlugin);

export class ChapeuSeletor extends MockObject {
  constructor() {
    super({
      geometry: 'cone',
      color: 0x4a3728, // Marrom escuro (temporário até carregar GLB)
      emissive: 0x2a1a18,
      size: 0.8,
      wireframe: false
    });

    // Escalas de referência
    this.escalaNormal = 3;
    this.escalaGrande = 3.9; // 30% maior mesmo (não proporcional)

    // Timeline ativa para controlar animações complexas
    this.timeline = null;

    // Flag de carregamento do modelo
    this.modeloCarregado = false;

    // Posições de referência em coordenadas do canvas 3D
    // X: -3 (esquerda) a +3 (direita)
    // Y: -2 (baixo) a +2 (cima)
    this.posicoes = {
      foraTelaEmbaixo: { x: 0, y: -4, z: 0 },
      umTercoTela: { x: 0, y: -0.8, z: 0 }, // 1/3 da tela = aproximadamente -0.8
      direitaSecao1: { x: 2, y: 0, z: 0 },
      esquerdaSecao2: { x: -1, y: -0.2, z: 0 },
      centroAcima: { x: 0, y: 0.8, z: 0 },
      centroDireita: { x: 1.5, y: 0, z: 0 },
      centroAbaixo: { x: 0, y: -0.5, z: 0 }
    };

    // Inicia carregamento do modelo GLB
    this.carregarModelo();
  }

  /**
   * Carrega modelo GLB do Chapéu Seletor
   * Substitui o cone temporário quando carregar
   */
  carregarModelo() {
    const loader = new GLTFLoader();

    loader.load(
      'src/assets/models/sorting-hat.glb',

      // onLoad: Modelo carregado com sucesso
      (gltf) => {
        console.log('✅ Modelo GLB do Chapéu Seletor carregado');

        // Salva estado atual (posição, escala, rotação, visibilidade)
        const posAtual = this.mesh.position.clone();
        const escalaAtual = this.mesh.scale.clone();
        const rotacaoAtual = this.mesh.rotation.clone();
        const visibilidadeAtual = this.mesh.visible;
        const cenaAtual = this.mesh.parent;

        // Remove cone antigo da cena
        if (cenaAtual) {
          cenaAtual.remove(this.mesh);
        }

        // Substitui pelo modelo GLB
        this.mesh = gltf.scene;

        // Restaura estado anterior
        this.mesh.position.copy(posAtual);
        this.mesh.scale.copy(escalaAtual);
        this.mesh.rotation.copy(rotacaoAtual);
        this.mesh.visible = visibilidadeAtual;

        // Adiciona de volta à cena
        if (cenaAtual) {
          cenaAtual.add(this.mesh);
        }

        this.modeloCarregado = true;
        console.log('🎩 Chapéu GLB integrado à cena (escala 3x)');
      },

      // onProgress: Progresso do carregamento
      (xhr) => {
        const percentual = Math.round((xhr.loaded / xhr.total) * 100);
        console.log(`📦 Chapéu GLB: ${percentual}% carregado`);
      },

      // onError: Erro ao carregar
      (error) => {
        console.error('❌ Erro ao carregar modelo do Chapéu:', error);
        console.warn('⚠️ Usando cone como fallback');
        this.modeloCarregado = false;
      }
    );
  }

  /**
   * Inicializa chapéu (SEM inverter - cone normal)
   */
  init(scene) {
    // Não rotaciona - deixa cone normal (ponta pra cima)
    this.mesh.rotation.z = 0;

    // Começa escondido fora da tela
    this.definirPosicao(
      this.posicoes.foraTelaEmbaixo.x,
      this.posicoes.foraTelaEmbaixo.y,
      this.posicoes.foraTelaEmbaixo.z
    );
    this.definirEscala(this.escalaGrande);
    this.esconder();
  }

  /**
   * Animação idle (balançar suavemente)
   */
  update(delta, elapsed) {
    if (!this.mesh || !this.mesh.visible) return;

    this.time = elapsed;

    // Balanço suave muito sutil
    this.mesh.rotation.z = Math.sin(elapsed * 0.8) * 0.05;

    // Movimento vertical suave (flutuação)
    const baseY = this.mesh.position.y;
    const offsetY = Math.sin(elapsed * 1.5) * 0.08;
    // Não sobrescreve posição Y totalmente, só adiciona flutuação
    // (isso permite que animações GSAP funcionem)
  }

  /**
   * ANIMAÇÃO DE ENTRADA (ao clicar "Iniciar Jornada")
   *
   * 1. Spawna fora da tela embaixo com escala 30% maior
   * 2. Sobe para 1/3 da tela MANTENDO escala grande
   * 3. Para por 2s
   * 4. (depois vai rolar para seção 1 - controlado externamente)
   *
   * FALA TOCA ASSIM QUE SPAWNA (controlado externamente)
   */
  animacaoEntrada(callback) {
    console.log('🎩 Iniciando animação de entrada do Chapéu');

    // Para qualquer animação anterior
    this.pararAnimacoes();

    // Posição inicial: fora da tela embaixo, escala grande
    this.definirPosicao(
      this.posicoes.foraTelaEmbaixo.x,
      this.posicoes.foraTelaEmbaixo.y,
      this.posicoes.foraTelaEmbaixo.z
    );
    this.definirEscala(this.escalaGrande);
    this.mostrar();

    // Timeline: apenas subida (MANTÉM escala grande)
    this.timeline = gsap.timeline({
      onComplete: () => {
        console.log('🎩 Animação de entrada completa');
        if (callback) callback();
      }
    });

    // Sobe para 1/3 da tela (MANTÉM escala grande)
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
   *
   * Quando scroll acontece:
   * 1. Sobe (acompanhando texto anterior)
   * 2. Desce para lateral direita do texto
   * 3. Escala volta ao normal
   *
   * Movimento suave/mágico/flutuante
   */
  animacaoSecao1(callback) {
    console.log('🎩 Animação Seção 1: movimento para direita');

    this.pararAnimacoes();

    this.timeline = gsap.timeline({
      onComplete: () => {
        console.log('🎩 Seção 1 posicionada');
        if (callback) callback();
      }
    });


    // 1. Sobe (acompanhando texto anterior subindo)
    this.timeline.to(this.mesh.position, {
      y: 2.0,
      duration: 0.5,
      ease: 'none'
    });

    // 2. Trajetória CURVA para lateral direita (bezier quadrática)
    // Ponto inicial: (0, 2.0)
    // Ponto controle: (3, 1.5) - cria a curva para direita
    // Ponto final: (2, 0)
    this.timeline.to(this.mesh.position, {
      motionPath: {
        path: [
          { x: 0, y: 2 },           // Ponto atual (topo)
          { x: 3, y: 1.5 },           // Ponto de controle (curva à direita)
          { x: this.posicoes.direitaSecao1.x, y: this.posicoes.direitaSecao1.y }  // Destino final
        ],
        curviness: 1,  // Intensidade da curva (1 = suave, 2 = muito curva)
        autoRotate: false
      },
      duration: 0.8,
      ease: 'power2.out'
    });

    // 3. Garante escala normal (simultâneo com movimento curvo)
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
   *
   * Texto vai para direita, chapéu vai para esquerda
   * 1. Sobe (acompanhando texto anterior)
   * 2. Desce para lateral esquerda do texto
   */
  animacaoSecao2(callback) {
    console.log('🎩 Animação Seção 2: movimento para esquerda');

    this.pararAnimacoes();

    this.timeline = gsap.timeline({
      onComplete: () => {
        console.log('🎩 Seção 2 posicionada');
        if (callback) callback();
      }
    });

    // 2. Trajetória CURVA para lateral esquerda (bezier quadrática)
    // Ponto inicial: (0, 2.0)
    // Ponto controle: (-3, 1.5) - cria a curva para esquerda
    // Ponto final: (-2, 0)
    this.timeline.to(this.mesh.position, {
      motionPath: {
        path: [
          { x: 0, y: 0 },       
          { x: -0.6, y: -0.15 },
          { x: -0.7, y: -0.17 },
          { x: -0.65, y: -0.2 }  
        ],
        curviness: 1,  // Intensidade da curva (1 = suave, 2 = muito curva)
        autoRotate: false
      },
      duration: 1.2,
      ease: 'power3.out'
    });

    return this.timeline;
  }

  /**
   * ANIMAÇÃO PARA SEÇÃO 3
   *
   * Animação FLUIDA em trajetória curvilínea contínua:
   * Passa por 3 pontos (acima → direita → abaixo) em movimento suave
   * Escala muda ao longo do trajeto (80% → 100% → 130%)
   * PERMANECE VISÍVEL no final (não desaparece)
   */
  animacaoSecao3(callback) {
    console.log('🎩 Animação Seção 3: trajetória curvilínea fluida');

    this.pararAnimacoes();

    this.timeline = gsap.timeline({
      onComplete: () => {
        console.log('🎩 Seção 3 completa - chapéu permanece visível');
        if (callback) callback();
      }
    });

    // MOVIMENTO: Trajetória curvilínea fluida passando pelos 3 pontos
    this.timeline.to(this.mesh.position, {
      motionPath: {
        path: [
          { x: this.posicoes.centroAcima.x, y: this.posicoes.centroAcima.y },      // Frame 1: acima
          { x: this.posicoes.centroDireita.x, y: this.posicoes.centroDireita.y }, // Frame 2: direita
          { x: this.posicoes.centroAbaixo.x, y: this.posicoes.centroAbaixo.y }    // Frame 3: abaixo
        ],
        curviness: 1.2,  // Curva suave entre os pontos
        autoRotate: false
      },
      duration: 1.2,  // Duração total do movimento
      ease: 'power1.inOut'
    }, 0);

    // ESCALA: Muda suavemente ao longo do trajeto (80% → 100% → 130%)
    // Keyframes para sincronizar escala com posições
    this.timeline.to(this.mesh.scale, {
      keyframes: [
        { x: this.escalaNormal * 0.8, y: this.escalaNormal * 0.8, z: this.escalaNormal * 0.8, duration: 0.4 },  // 80% (acima)
        { x: this.escalaNormal, y: this.escalaNormal, z: this.escalaNormal, duration: 0.4 },                     // 100% (direita)
        { x: this.escalaGrande, y: this.escalaGrande, z: this.escalaGrande, duration: 0.4 }                      // 130% (abaixo)
      ],
      ease: 'power1.inOut'
    }, 0); // Inicia junto com movimento

    return this.timeline;
  }

  /**
   * ANIMAÇÃO PARA SEÇÃO 4
   *
   * Chapéu desce para fora da tela (indo um pouco para a esquerda)
   * Desaparece completamente
   */
  animacaoSecao4(callback) {
    console.log('🎩 Animação Seção 4: descida para fora da tela');

    this.pararAnimacoes();

    this.timeline = gsap.timeline({
      onComplete: () => {
        console.log('🎩 Seção 4 completa - chapéu desapareceu');
        this.esconder();
        if (callback) callback();
      }
    });

    // MOVIMENTO: Desce para fora da tela indo para a esquerda
    this.timeline.to(this.mesh.position, {
      motionPath: {
        path: [
          { x: this.posicoes.centroAbaixo.x, y: this.posicoes.centroAbaixo.y }, // Posição atual (abaixo)
          { x: -1.5, y: -2 },  // Movimento diagonal esquerda-baixo
          { x: -2, y: -6 }     // Fora da tela (esquerda e embaixo)
        ],
        curviness: 1,
        autoRotate: false
      },
      duration: 1,
      ease: 'power2.out'
    }, 0);

    // FADE OUT: Desaparece durante a descida
    this.timeline.to(this.mesh.material, {
      opacity: 0,
      duration: 1.2,
      ease: 'power2.in',
      onStart: () => {
        this.mesh.material.transparent = true;
      }
    }, 0.3); // Começa um pouco depois do movimento

    return this.timeline;
  }

  /**
   * Animação de "falar" (pulsa levemente)
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

    // Reseta material
    if (this.mesh && this.mesh.material) {
      this.mesh.material.transparent = false;
      this.mesh.material.opacity = 1;
    }

    this.esconder();
  }
}
