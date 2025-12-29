/**
 * Dialogue Manager - Gerenciador de Diálogos
 * Exibe textos narrativos de forma elegante e sincronizada
 */

import { audioGlobal } from './audioManager.js';
import { estadoGlobal } from './stateManager.js';

class DialogueManager {
  constructor() {
    this.dialogoAtual = null;
    this.containerDialogo = null;
    this.fadeVelocidade = 300; // ms
    this.filaDialogos = [];
    this.processando = false;
    this.inicializado = false; // Flag para evitar múltiplas inicializações
  }

  /**
   * Inicializa o container de diálogo
   */
  inicializar() {
    // Cria container de diálogo se não existir
    if (!this.inicializado) {
      this.containerDialogo = document.createElement('div');
      this.containerDialogo.className = 'dialogo-container';
      this.containerDialogo.innerHTML = `
        <div class="dialogo-box">
          <p class="dialogo-texto"></p>
          <button class="dialogo-botao">Continuar</button>
        </div>
      `;
      document.body.appendChild(this.containerDialogo);

      // Event listener para botão continuar (registrado apenas UMA VEZ)
      const botao = this.containerDialogo.querySelector('.dialogo-botao');
      botao.addEventListener('click', () => this.proximoDialogo());

      this.inicializado = true;
    }
  }

  /**
   * Exibe um diálogo
   */
  exibir(texto, opcoes = {}) {
    const config = {
      comAudio: true,
      comBotao: true,
      autoContinuar: false,
      delay: 0,
      callback: null,
      ...opcoes
    };

    this.filaDialogos.push({ texto, config });

    if (!this.processando) {
      this.processarProximoDialogo();
    }
  }

  /**
   * Exibe múltiplos diálogos em sequência
   */
  exibirSequencia(textos, opcoes = {}) {
    textos.forEach((texto, index) => {
      const isUltimo = index === textos.length - 1;
      this.exibir(texto, {
        ...opcoes,
        callback: isUltimo ? opcoes.callback : null
      });
    });
  }

  /**
   * Processa próximo diálogo da fila
   */
  processarProximoDialogo() {
    if (this.filaDialogos.length === 0) {
      this.processando = false;
      return;
    }

    this.processando = true;
    const { texto, config } = this.filaDialogos.shift();

    this.inicializar();

    const textoEl = this.containerDialogo.querySelector('.dialogo-texto');
    const botaoEl = this.containerDialogo.querySelector('.dialogo-botao');

    // Fade out anterior
    if (this.containerDialogo.classList.contains('ativo')) {
      this.fadeOut(() => {
        this.mostrarDialogo(texto, config, textoEl, botaoEl);
      });
    } else {
      this.mostrarDialogo(texto, config, textoEl, botaoEl);
    }
  }

  /**
   * Mostra diálogo após fade
   */
  mostrarDialogo(texto, config, textoEl, botaoEl) {
    // Define texto
    textoEl.textContent = texto;

    // Mostra/esconde botão
    if (config.comBotao) {
      botaoEl.style.display = 'block';
    } else {
      botaoEl.style.display = 'none';
    }

    // Toca áudio se configurado
    if (config.comAudio) {
      audioGlobal.tocarNarracao(() => {
        if (config.autoContinuar) {
          setTimeout(() => this.proximoDialogo(), config.delay);
        }
      });
    }

    // Fade in
    this.fadeIn();

    // Auto continuar sem áudio
    if (config.autoContinuar && !config.comAudio) {
      setTimeout(() => this.proximoDialogo(), config.delay);
    }

    // Callback
    if (config.callback && this.filaDialogos.length === 0) {
      // Executa callback apenas quando é o último da fila
      setTimeout(() => {
        if (typeof config.callback === 'function') {
          config.callback();
        }
      }, 100);
    }
  }

  /**
   * Próximo diálogo (botão continuar)
   */
  proximoDialogo() {
    if (this.filaDialogos.length > 0) {
      this.processarProximoDialogo();
    } else {
      this.fechar();
    }
  }

  /**
   * Exibe escolha ao usuário
   */
  exibirEscolha(pergunta, opcoes, callback) {
    this.inicializar();

    const textoEl = this.containerDialogo.querySelector('.dialogo-texto');
    const botaoEl = this.containerDialogo.querySelector('.dialogo-botao');

    // Esconde botão padrão
    botaoEl.style.display = 'none';

    // Define pergunta
    textoEl.innerHTML = pergunta;

    // Cria botões de escolha
    const containerOpcoes = document.createElement('div');
    containerOpcoes.className = 'dialogo-opcoes';

    opcoes.forEach((opcao, index) => {
      const botaoOpcao = document.createElement('button');
      botaoOpcao.className = 'dialogo-opcao-botao';
      botaoOpcao.textContent = opcao.texto || opcao;

      botaoOpcao.addEventListener('click', () => {
        audioGlobal.tocarSFX('clique');
        this.fechar();
        if (callback) {
          callback(opcao.valor !== undefined ? opcao.valor : index, opcao);
        }
      });

      containerOpcoes.appendChild(botaoOpcao);
    });

    // Remove container de opções anterior se existir
    const opcoesAnteriores = this.containerDialogo.querySelector('.dialogo-opcoes');
    if (opcoesAnteriores) {
      opcoesAnteriores.remove();
    }

    this.containerDialogo.querySelector('.dialogo-box').appendChild(containerOpcoes);

    this.fadeIn();
  }

  /**
   * Fade in do diálogo
   */
  fadeIn() {
    this.containerDialogo.classList.add('ativo');
  }

  /**
   * Fade out do diálogo
   */
  fadeOut(callback) {
    this.containerDialogo.classList.remove('ativo');
    if (callback) {
      setTimeout(callback, this.fadeVelocidade);
    }
  }

  /**
   * Fecha diálogo
   */
  fechar() {
    this.fadeOut();
    this.filaDialogos = [];
    this.processando = false;
    audioGlobal.pararNarracao();
  }

  /**
   * Exibe mensagem rápida (toast)
   */
  exibirMensagemRapida(texto, duracao = 2000, tipo = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${tipo}`;
    toast.textContent = texto;
    document.body.appendChild(toast);

    // Fade in
    setTimeout(() => toast.classList.add('ativo'), 10);

    // Fade out e remove
    setTimeout(() => {
      toast.classList.remove('ativo');
      setTimeout(() => toast.remove(), 300);
    }, duracao);
  }

  /**
   * Verifica se há diálogos ativos ou na fila
   */
  estaAtivo() {
    return this.processando || this.filaDialogos.length > 0;
  }

  /**
   * Limpa todos os diálogos
   */
  limpar() {
    this.filaDialogos = [];
    this.processando = false;
    this.fechar();
  }
}

// Exporta instância singleton
export const dialogoGlobal = new DialogueManager();
