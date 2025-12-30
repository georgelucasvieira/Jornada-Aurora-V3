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
        html5: true, // Use HTML5 Audio for better reliability
        onload: () => console.log('✅ Música "intro" carregada'),
        onloaderror: (id, err) => console.error('❌ Música intro não carregou:', err),
        onplayerror: (id, err) => console.error('❌ Erro ao tocar intro:', err)
      }),
      cap1: new Howl({
        src: ['src/assets/audio/music/cap1.mp3'],
        loop: true,
        volume: this.volumeMusica * this.volumeGeral,
        html5: true,
        onload: () => console.log('✅ Música "cap1" carregada'),
        onloaderror: (id, err) => console.error('❌ Música cap1 não carregou:', err),
        onplayerror: (id, err) => console.error('❌ Erro ao tocar cap1:', err)
      }),
      cap3: new Howl({
        src: ['src/assets/audio/music/cap3.mp3'],
        loop: true,
        volume: this.volumeMusica * this.volumeGeral,
        html5: true,
        onload: () => console.log('✅ Música "cap3" carregada'),
        onloaderror: (id, err) => console.error('❌ Música cap3 não carregou:', err),
        onplayerror: (id, err) => console.error('❌ Erro ao tocar cap3:', err)
      }),
      cap4: new Howl({
        src: ['src/assets/audio/music/cap4.mp3'],
        loop: true,
        volume: this.volumeMusica * this.volumeGeral,
        html5: true,
        onload: () => console.log('✅ Música "cap4" carregada'),
        onloaderror: (id, err) => console.error('❌ Música cap4 não carregou:', err),
        onplayerror: (id, err) => console.error('❌ Erro ao tocar cap4:', err)
      }),
      cap5: new Howl({
        src: ['src/assets/audio/music/cap5.mp3'],
        loop: true,
        volume: this.volumeMusica * this.volumeGeral,
        html5: true,
        onload: () => console.log('✅ Música "cap5" carregada'),
        onloaderror: (id, err) => console.error('❌ Música cap5 não carregou:', err),
        onplayerror: (id, err) => console.error('❌ Erro ao tocar cap5:', err)
      }),
      cap6: new Howl({
        src: ['src/assets/audio/music/cap6.mp3'],
        loop: true,
        volume: this.volumeMusica * this.volumeGeral,
        html5: true,
        onload: () => console.log('✅ Música "cap6" carregada'),
        onloaderror: (id, err) => console.error('❌ Música cap6 não carregou:', err),
        onplayerror: (id, err) => console.error('❌ Erro ao tocar cap6:', err)
      }),
      cap7_pre: new Howl({
        src: ['src/assets/audio/music/cap7_pre.mp3'],
        loop: true,
        volume: this.volumeMusica * this.volumeGeral,
        html5: true,
        onload: () => console.log('✅ Música "cap7_pre" carregada'),
        onloaderror: (id, err) => console.error('❌ Música cap7_pre não carregou:', err),
        onplayerror: (id, err) => console.error('❌ Erro ao tocar cap7_pre:', err)
      }),
      cap7_patronus: new Howl({
        src: ['src/assets/audio/music/cap7_patronus.mp3'],
        loop: true,
        volume: this.volumeMusica * this.volumeGeral,
        html5: true,
        onload: () => console.log('✅ Música "cap7_patronus" carregada'),
        onloaderror: (id, err) => console.error('❌ Música cap7_patronus não carregou:', err),
        onplayerror: (id, err) => console.error('❌ Erro ao tocar cap7_patronus:', err)
      }),
      cap7_batalha: new Howl({
        src: ['src/assets/audio/music/cap7_batalha.mp3'],
        loop: true,
        volume: this.volumeMusica * this.volumeGeral,
        html5: true,
        onload: () => console.log('✅ Música "cap7_batalha" carregada'),
        onloaderror: (id, err) => console.error('❌ Música cap7_batalha não carregou:', err),
        onplayerror: (id, err) => console.error('❌ Erro ao tocar cap7_batalha:', err)
      }),
      triste: new Howl({
        src: ['src/assets/audio/music/triste.mp3'],
        loop: true,
        volume: this.volumeMusica * this.volumeGeral,
        html5: true,
        onload: () => console.log('✅ Música "triste" carregada'),
        onloaderror: (id, err) => console.error('❌ Música triste não carregou:', err),
        onplayerror: (id, err) => console.error('❌ Erro ao tocar triste:', err)
      }),
      alegre: new Howl({
        src: ['src/assets/audio/music/alegre.mp3'],
        loop: true,
        volume: this.volumeMusica * this.volumeGeral,
        html5: true,
        onload: () => console.log('✅ Música "alegre" carregada'),
        onloaderror: (id, err) => console.error('❌ Música alegre não carregou:', err),
        onplayerror: (id, err) => console.error('❌ Erro ao tocar alegre:', err)
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
      console.error(`❌ Trilha "${nomeTrilha}" não encontrada no mapeamento`);
      console.log('📋 Trilhas disponíveis:', Object.keys(this.trilhas));
      return;
    }

    console.log(`🎵 [MÚSICA] Solicitando troca para "${nomeTrilha}"`);
    console.log(`🎵 [MÚSICA] Música atual: ${estadoGlobal.obter('musicaAtual') || 'nenhuma'}`);

    // IMPORTANTE: Se a nova trilha é o MESMO OBJETO Howl que está tocando,
    // NÃO pare e reinicie (isso causa interrupções)
    if (this.musicaFundo && this.musicaFundo === novaTrilha) {
      // Verifica se já está tocando
      if (this.musicaFundo.playing()) {
        console.log(`✅ [MÚSICA] "${nomeTrilha}" já está tocando, mantendo reprodução`);
        estadoGlobal.definir('musicaAtual', nomeTrilha);
        return;
      }
      // Se não está tocando, inicia
      console.log(`▶️ [MÚSICA] Reiniciando "${nomeTrilha}" (mesmo objeto Howl)`);
      this.musicaFundo.volume(this.volumeMusica * this.volumeGeral);
      this.musicaFundo.play();
      estadoGlobal.definir('musicaAtual', nomeTrilha);
      return;
    }

    // Se chegou aqui, são objetos Howl diferentes (arquivos reais diferentes)
    const musicaAnterior = estadoGlobal.obter('musicaAtual');

    // Para música atual com fade out
    if (this.musicaFundo && this.musicaFundo.playing()) {
      console.log(`⏸️ [MÚSICA] Fazendo fade out de "${musicaAnterior}" (${fadeOut}ms)`);

      this.musicaFundo.fade(
        this.musicaFundo.volume(),
        0,
        fadeOut
      );

      setTimeout(() => {
        if (this.musicaFundo) {
          this.musicaFundo.stop();
          console.log(`⏹️ [MÚSICA] "${musicaAnterior}" parada`);
        }
      }, fadeOut);
    } else if (this.musicaFundo) {
      // Se não estava tocando, para imediatamente
      this.musicaFundo.stop();
      console.log(`⏹️ [MÚSICA] "${musicaAnterior}" parada (não estava tocando)`);
    }

    // Inicia nova música com fade in
    this.musicaFundo = novaTrilha;

    console.log(`▶️ [MÚSICA] Iniciando "${nomeTrilha}" com fade in (${fadeIn}ms)`);

    this.musicaFundo.volume(0);
    const playId = this.musicaFundo.play();

    // Verifica se play foi bem-sucedido
    if (playId !== undefined) {
      this.musicaFundo.fade(0, this.volumeMusica * this.volumeGeral, fadeIn);
      estadoGlobal.definir('musicaAtual', nomeTrilha);
      console.log(`✅ [MÚSICA] "${nomeTrilha}" tocando (ID: ${playId})`);
    } else {
      console.error(`❌ [MÚSICA] Falha ao iniciar "${nomeTrilha}"`);
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
