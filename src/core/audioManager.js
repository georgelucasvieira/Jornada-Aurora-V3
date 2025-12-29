/**
 * Audio Manager - Gerenciador de Áudio
 * Controla narração, efeitos sonoros e música de fundo usando Howler.js
 */

import { Howl } from 'howler';
import { estadoGlobal } from './stateManager.js';

class AudioManager {
  constructor() {
    this.narracao = null;
    this.musicaFundo = null;
    this.sfx = {};
    this.volumeGeral = 1.0;
    this.volumeNarracao = 1.0;
    this.volumeMusica = 0.6;
    this.volumeSFX = 0.8;
    this.mudo = false;

    // Trilhas de música
    this.trilhas = {};

    this.inicializar();
  }

  /**
   * Inicializa sistema de áudio com mocks
   */
  inicializar() {
    // UM ÚNICO arquivo de voz (usado para TODAS as narrações)
    this.narracao = new Howl({
      src: ['src/assets/audio/voice/hat-phase0-voice-0.mp3'], // Voz do chapéu
      volume: this.volumeNarracao * this.volumeGeral,
      onloaderror: () => {
        console.warn('Áudio de voz não encontrado em src/assets/audio/voice/hat-phase0-voice-0.mp3');
      }
    });

    // UM ÚNICO arquivo de SFX (usado para TODOS os efeitos)
    const sfxUnico = new Howl({
      src: ['src/assets/audio/sfx/click.mp3'], // SFX único
      volume: this.volumeSFX * this.volumeGeral,
      onloaderror: () => {
        console.warn('SFX não encontrado em src/assets/audio/sfx/click.mp3');
      }
    });

    // Todos os tipos de SFX apontam para o mesmo arquivo
    const tiposSFX = [
      'coruja', 'clique', 'progresso', 'tenteNovamente',
      'trovao', 'chuva', 'voo', 'fenix', 'sucesso', 'erro'
    ];

    tiposSFX.forEach(tipo => {
      this.sfx[tipo] = sfxUnico;
    });

    // UMA ÚNICA música de fundo (usada para tudo)
    const musicaUnica = new Howl({
      src: ['src/assets/audio/music/intro.mp3'], // Música única
      loop: true,
      volume: this.volumeMusica * this.volumeGeral,
      onloaderror: () => console.warn('Música não encontrada em src/assets/audio/music/intro.mp3')
    });

    // Todas as trilhas apontam para a mesma música
    this.trilhas = {
      inicio: musicaUnica,
      jornada: musicaUnica,
      desafio: musicaUnica,
      climax: musicaUnica,
      revelacao: musicaUnica
    };
  }

  /**
   * Toca narração do Chapéu
   */
  tocarNarracao(callback) {
    if (this.mudo) return;

    // Para narração anterior se estiver tocando
    if (this.narracao && this.narracao.playing()) {
      this.narracao.stop();
    }

    // Toca nova narração
    if (this.narracao) {
      const id = this.narracao.play();

      if (callback) {
        this.narracao.on('end', callback, id);
      }
    }
  }

  /**
   * Para narração
   */
  pararNarracao() {
    if (this.narracao) {
      this.narracao.stop();
    }
  }

  /**
   * Toca efeito sonoro
   */
  tocarSFX(tipo) {
    if (this.mudo) return;

    if (this.sfx[tipo]) {
      this.sfx[tipo].play();
    } else {
      console.warn(`SFX "${tipo}" não encontrado`);
    }
  }

  /**
   * Troca música de fundo
   */
  trocarMusicaDeFundo(nomeTrilha, fadeOut = 1000, fadeIn = 1000) {
    // Para música atual com fade out
    if (this.musicaFundo) {
      this.musicaFundo.fade(
        this.volumeMusica * this.volumeGeral,
        0,
        fadeOut
      );

      setTimeout(() => {
        if (this.musicaFundo) {
          this.musicaFundo.stop();
        }
      }, fadeOut);
    }

    // Inicia nova música com fade in
    if (this.trilhas[nomeTrilha]) {
      this.musicaFundo = this.trilhas[nomeTrilha];
      this.musicaFundo.volume(0);
      this.musicaFundo.play();
      this.musicaFundo.fade(0, this.volumeMusica * this.volumeGeral, fadeIn);

      estadoGlobal.definir('musicaAtual', nomeTrilha);
    } else {
      console.warn(`Trilha "${nomeTrilha}" não encontrada`);
    }
  }

  /**
   * Para música de fundo
   */
  pararMusica(fadeOut = 1000) {
    if (this.musicaFundo) {
      this.musicaFundo.fade(
        this.volumeMusica * this.volumeGeral,
        0,
        fadeOut
      );

      setTimeout(() => {
        if (this.musicaFundo) {
          this.musicaFundo.stop();
          this.musicaFundo = null;
          estadoGlobal.definir('musicaAtual', null);
        }
      }, fadeOut);
    }
  }

  /**
   * Pausa música de fundo
   */
  pausarMusica() {
    if (this.musicaFundo) {
      this.musicaFundo.pause();
    }
  }

  /**
   * Resume música de fundo
   */
  resumirMusica() {
    if (this.musicaFundo) {
      this.musicaFundo.play();
    }
  }

  /**
   * Define volume geral
   */
  definirVolumeGeral(volume) {
    this.volumeGeral = Math.max(0, Math.min(1, volume));
    this.atualizarVolumes();
  }

  /**
   * Define volume da narração
   */
  definirVolumeNarracao(volume) {
    this.volumeNarracao = Math.max(0, Math.min(1, volume));
    if (this.narracao) {
      this.narracao.volume(this.volumeNarracao * this.volumeGeral);
    }
  }

  /**
   * Define volume da música
   */
  definirVolumeMusica(volume) {
    this.volumeMusica = Math.max(0, Math.min(1, volume));
    if (this.musicaFundo) {
      this.musicaFundo.volume(this.volumeMusica * this.volumeGeral);
    }
  }

  /**
   * Define volume dos SFX
   */
  definirVolumeSFX(volume) {
    this.volumeSFX = Math.max(0, Math.min(1, volume));
    Object.values(this.sfx).forEach(sfx => {
      sfx.volume(this.volumeSFX * this.volumeGeral);
    });
  }

  /**
   * Atualiza todos os volumes
   */
  atualizarVolumes() {
    this.definirVolumeNarracao(this.volumeNarracao);
    this.definirVolumeMusica(this.volumeMusica);
    this.definirVolumeSFX(this.volumeSFX);
  }

  /**
   * Alterna mudo
   */
  alternarMudo() {
    this.mudo = !this.mudo;

    if (this.mudo) {
      Howler.volume(0);
    } else {
      Howler.volume(this.volumeGeral);
    }

    return this.mudo;
  }

  /**
   * Para todos os áudios
   */
  pararTudo() {
    this.pararNarracao();
    this.pararMusica(500);
    Object.values(this.sfx).forEach(sfx => sfx.stop());
  }
}

// Exporta instância singleton
export const audioGlobal = new AudioManager();
