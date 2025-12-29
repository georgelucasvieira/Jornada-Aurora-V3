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
      'trovao', 'chuva', 'voo', 'fenix', 'sucesso', 'erro',
      'expecto-patronum', 'luz', 'avada-kedavra', 'whoosh',
      'pagina', 'bau'
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

    // Todas as trilhas apontam para a mesma música (PLACEHOLDER)
    this.trilhas = {
      inicio: musicaUnica,
      jornada: musicaUnica,
      desafio: musicaUnica,
      climax: musicaUnica,
      revelacao: musicaUnica,
      // Músicas específicas por capítulo (placeholders)
      cap1: musicaUnica,      // "Hedwig's Theme" ou música de introdução
      cap3: musicaUnica,      // "The Chamber of Secrets"
      cap4: musicaUnica,      // "Harry in Winter"
      cap5: musicaUnica,      // "Dumbledore's Army"
      cap6: musicaUnica,      // "Obliviate"
      cap7_pre: musicaUnica,  // "Statues"
      cap7_patronus: musicaUnica, // "The Patronus Light" (Prisoner of Azkaban)
      cap7_batalha: musicaUnica, // "The Battle of Hogwarts"
      triste: musicaUnica,    // "Lily's Theme" (Cap 8 pós-derrota)
      alegre: musicaUnica     // "Leaving Hogwarts" (Cap 8 vida nova)
    };

    // Mapeamento de capítulos para trilhas
    this.mapeamentoCapitulos = {
      0: 'inicio',        // Tela inicial
      1: 'cap1',          // Cap 1 - A Convocação
      2: 'cap1',          // (Cap 2 fundiu com Cap 1)
      3: 'cap3',          // Cap 3 - Segredos Guardados
      4: 'cap4',          // Cap 4 - Memórias
      5: 'cap5',          // Cap 5 - Linguagem Sagrada
      6: 'cap6',          // Cap 6 - O Voo
      7: 'cap7_pre',      // Cap 7 - Sombra e Luz (início)
      '7_patronus': 'cap7_patronus', // Cap 7 - Expecto Patronum
      '7_batalha': 'cap7_batalha', // Cap 7 - Batalha
      8: 'triste',        // Cap 8 - Pós-derrota
      '8_alegre': 'alegre' // Cap 8 - Vida Nova
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
   * Troca música de fundo baseada no capítulo
   * @param {number|string} capitulo - Número do capítulo ou identificador especial ('7_batalha', '8_alegre')
   * @param {number} fadeOut - Tempo de fade out em ms (padrão: 2000)
   * @param {number} fadeIn - Tempo de fade in em ms (padrão: 2000)
   */
  trocarMusicaPorCapitulo(capitulo, fadeOut = 2000, fadeIn = 2000) {
    const nomeTrilha = this.mapeamentoCapitulos[capitulo];

    if (!nomeTrilha) {
      console.warn(`Capítulo "${capitulo}" não possui música mapeada`);
      return;
    }

    console.log(`🎵 Trocando música para Capítulo ${capitulo}: ${nomeTrilha}`);
    this.trocarMusicaDeFundo(nomeTrilha, fadeOut, fadeIn);
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
