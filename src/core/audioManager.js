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
    // Narração do Chapéu (PLACEHOLDER - apenas 1 arquivo disponível)
    this.narracao = new Howl({
      src: ['src/assets/audio/voice/hat-phase0-voice-0.mp3'],
      volume: this.volumeNarracao * this.volumeGeral,
      onloaderror: () => {
        console.warn('Áudio de voz não encontrado em src/assets/audio/voice/hat-phase0-voice-0.mp3');
      }
    });

    // SFX individuais (arquivos reais)
    this.sfx = {
      coruja: new Howl({
        src: ['src/assets/audio/sfx/coruja.mp3'],
        volume: this.volumeSFX * this.volumeGeral,
        onloaderror: () => console.warn('SFX coruja não encontrado')
      }),
      clique: new Howl({
        src: ['src/assets/audio/sfx/click.mp3'],
        volume: this.volumeSFX * this.volumeGeral,
        onloaderror: () => console.warn('SFX click não encontrado')
      }),
      progresso: new Howl({
        src: ['src/assets/audio/sfx/progresso.mp3'],
        volume: this.volumeSFX * this.volumeGeral,
        onloaderror: () => console.warn('SFX progresso não encontrado')
      }),
      tenteNovamente: new Howl({
        src: ['src/assets/audio/sfx/erro.mp3'],
        volume: this.volumeSFX * this.volumeGeral,
        onloaderror: () => console.warn('SFX tenteNovamente não encontrado')
      }),
      trovao: new Howl({
        src: ['src/assets/audio/sfx/trovao.mp3'],
        volume: this.volumeSFX * this.volumeGeral,
        onloaderror: () => console.warn('SFX trovao não encontrado')
      }),
      chuva: new Howl({
        src: ['src/assets/audio/sfx/chuva.mp3'],
        loop: true, // Loop para chuva
        volume: this.volumeSFX * this.volumeGeral,
        onloaderror: () => console.warn('SFX chuva não encontrado')
      }),
      voo: new Howl({
        src: ['src/assets/audio/sfx/voo.mp3'],
        volume: this.volumeSFX * this.volumeGeral,
        onloaderror: () => console.warn('SFX voo não encontrado')
      }),
      fenix: new Howl({
        src: ['src/assets/audio/sfx/fenix.mp3'],
        volume: this.volumeSFX * this.volumeGeral,
        onloaderror: () => console.warn('SFX fenix não encontrado')
      }),
      sucesso: new Howl({
        src: ['src/assets/audio/sfx/sucesso.mp3'],
        volume: this.volumeSFX * this.volumeGeral,
        onloaderror: () => console.warn('SFX sucesso não encontrado')
      }),
      erro: new Howl({
        src: ['src/assets/audio/sfx/erro.mp3'],
        volume: this.volumeSFX * this.volumeGeral,
        onloaderror: () => console.warn('SFX erro não encontrado')
      }),
      'expecto-patronum': new Howl({
        src: ['src/assets/audio/sfx/expecto-patronum.mp3'],
        volume: this.volumeSFX * this.volumeGeral,
        onloaderror: () => console.warn('SFX expecto-patronum não encontrado')
      }),
      luz: new Howl({
        src: ['src/assets/audio/sfx/luz.mp3'],
        volume: this.volumeSFX * this.volumeGeral,
        onloaderror: () => console.warn('SFX luz não encontrado')
      }),
      'avada-kedavra': new Howl({
        src: ['src/assets/audio/sfx/avada-kedavra.mp3'],
        volume: this.volumeSFX * this.volumeGeral,
        onloaderror: () => console.warn('SFX avada-kedavra não encontrado')
      }),
      whoosh: new Howl({
        src: ['src/assets/audio/sfx/whoosh.mp3'],
        volume: this.volumeSFX * this.volumeGeral,
        onloaderror: () => console.warn('SFX whoosh não encontrado')
      }),
      pagina: new Howl({
        src: ['src/assets/audio/sfx/pagina.mp3'],
        volume: this.volumeSFX * this.volumeGeral,
        onloaderror: () => console.warn('SFX pagina não encontrado')
      }),
      bau: new Howl({
        src: ['src/assets/audio/sfx/bau.mp3'],
        volume: this.volumeSFX * this.volumeGeral,
        onloaderror: () => console.warn('SFX bau não encontrado')
      }),
      penseira: new Howl({
        src: ['src/assets/audio/sfx/penseira.mp3'],
        volume: this.volumeSFX * this.volumeGeral,
        onloaderror: () => console.warn('SFX penseira não encontrado')
      })
    };

    // Músicas de fundo por capítulo (arquivos reais)
    this.trilhas = {
      inicio: new Howl({
        src: ['src/assets/audio/music/intro.mp3'],
        loop: true,
        volume: this.volumeMusica * this.volumeGeral,
        onloaderror: () => console.warn('Música intro não encontrada')
      }),
      cap1: new Howl({
        src: ['src/assets/audio/music/cap1.mp3'], // "Hedwig's Theme"
        loop: true,
        volume: this.volumeMusica * this.volumeGeral,
        onloaderror: () => console.warn('Música cap1 não encontrada')
      }),
      cap3: new Howl({
        src: ['src/assets/audio/music/cap3.mp3'], // "The Chamber of Secrets"
        loop: true,
        volume: this.volumeMusica * this.volumeGeral,
        onloaderror: () => console.warn('Música cap3 não encontrada')
      }),
      cap4: new Howl({
        src: ['src/assets/audio/music/cap4.mp3'], // "Harry in Winter"
        loop: true,
        volume: this.volumeMusica * this.volumeGeral,
        onloaderror: () => console.warn('Música cap4 não encontrada')
      }),
      cap5: new Howl({
        src: ['src/assets/audio/music/cap5.mp3'], // "Dumbledore's Army"
        loop: true,
        volume: this.volumeMusica * this.volumeGeral,
        onloaderror: () => console.warn('Música cap5 não encontrada')
      }),
      cap6: new Howl({
        src: ['src/assets/audio/music/cap6.mp3'], // "Obliviate"
        loop: true,
        volume: this.volumeMusica * this.volumeGeral,
        onloaderror: () => console.warn('Música cap6 não encontrada')
      }),
      cap7_pre: new Howl({
        src: ['src/assets/audio/music/cap7-pre.mp3'], // "Statues"
        loop: true,
        volume: this.volumeMusica * this.volumeGeral,
        onloaderror: () => console.warn('Música cap7_pre não encontrada')
      }),
      cap7_patronus: new Howl({
        src: ['src/assets/audio/music/cap7-patronus.mp3'], // "The Patronus Light"
        loop: true,
        volume: this.volumeMusica * this.volumeGeral,
        onloaderror: () => console.warn('Música cap7_patronus não encontrada')
      }),
      cap7_batalha: new Howl({
        src: ['src/assets/audio/music/cap7-batalha.mp3'], // "The Battle of Hogwarts"
        loop: true,
        volume: this.volumeMusica * this.volumeGeral,
        onloaderror: () => console.warn('Música cap7_batalha não encontrada')
      }),
      triste: new Howl({
        src: ['src/assets/audio/music/triste.mp3'], // "Lily's Theme"
        loop: true,
        volume: this.volumeMusica * this.volumeGeral,
        onloaderror: () => console.warn('Música triste não encontrada')
      }),
      alegre: new Howl({
        src: ['src/assets/audio/music/alegre.mp3'], // "Leaving Hogwarts"
        loop: true,
        volume: this.volumeMusica * this.volumeGeral,
        onloaderror: () => console.warn('Música alegre não encontrada')
      })
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
    const novaTrilha = this.trilhas[nomeTrilha];

    if (!novaTrilha) {
      console.warn(`Trilha "${nomeTrilha}" não encontrada`);
      return;
    }

    // IMPORTANTE: Se a nova trilha é o MESMO OBJETO Howl que está tocando,
    // NÃO pare e reinicie (isso causa interrupções no sistema placeholder)
    if (this.musicaFundo && this.musicaFundo === novaTrilha) {
      // Verifica se já está tocando
      if (this.musicaFundo.playing()) {
        console.log(`🎵 Música "${nomeTrilha}" já está tocando (mesmo arquivo), mantendo reprodução`);
        estadoGlobal.definir('musicaAtual', nomeTrilha);
        return;
      }
      // Se não está tocando, inicia
      console.log(`🎵 Iniciando música "${nomeTrilha}"`);
      this.musicaFundo.volume(this.volumeMusica * this.volumeGeral);
      this.musicaFundo.play();
      estadoGlobal.definir('musicaAtual', nomeTrilha);
      return;
    }

    // Se chegou aqui, são objetos Howl diferentes (arquivos reais diferentes)

    // Para música atual com fade out
    if (this.musicaFundo && this.musicaFundo.playing()) {
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
    this.musicaFundo = novaTrilha;

    this.musicaFundo.volume(0);
    this.musicaFundo.play();
    this.musicaFundo.fade(0, this.volumeMusica * this.volumeGeral, fadeIn);

    estadoGlobal.definir('musicaAtual', nomeTrilha);
    console.log(`🎵 Música trocada para: ${nomeTrilha}`);
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
