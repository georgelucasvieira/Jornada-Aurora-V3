/**
 * State Manager - Gerenciador de Estado Central
 * Controla todo o estado da aplicação narrativa
 */

class StateManager {
  constructor() {
    this.estado = {
      capituloAtual: 0,
      desafioAtual: null,
      progressoDesbloqueado: new Set([0]), // Capítulo inicial sempre desbloqueado
      flagsConclusao: new Set(),
      respostasUsuario: {},
      modoDebug: false,
      scrollBloqueado: false,
      objetoAtivo: null, // 'chapeu', 'fenix', null
      musicaAtual: null,
    };

    this.listeners = new Map();
  }

  /**
   * Obtém o estado atual
   */
  obterEstado() {
    return { ...this.estado };
  }

  /**
   * Obtém valor específico do estado
   */
  obter(chave) {
    return this.estado[chave];
  }

  /**
   * Define valor no estado e notifica listeners
   */
  definir(chave, valor) {
    const valorAnterior = this.estado[chave];
    this.estado[chave] = valor;

    // Notifica listeners desta chave
    if (this.listeners.has(chave)) {
      this.listeners.get(chave).forEach(callback => {
        callback(valor, valorAnterior);
      });
    }

    // Notifica listeners gerais
    if (this.listeners.has('*')) {
      this.listeners.get('*').forEach(callback => {
        callback(chave, valor, valorAnterior);
      });
    }
  }

  /**
   * Registra listener para mudanças de estado
   */
  observar(chave, callback) {
    if (!this.listeners.has(chave)) {
      this.listeners.set(chave, []);
    }
    this.listeners.get(chave).push(callback);
  }

  /**
   * Avança para próximo capítulo
   */
  avancarCapitulo() {
    const proximoCapitulo = this.estado.capituloAtual + 1;
    this.definir('capituloAtual', proximoCapitulo);
    this.desbloquearProgresso(proximoCapitulo);
  }

  /**
   * Volta para capítulo anterior
   */
  voltarCapitulo() {
    if (this.estado.capituloAtual > 0) {
      this.definir('capituloAtual', this.estado.capituloAtual - 1);
    }
  }

  /**
   * Desbloqueia progresso de um capítulo
   */
  desbloquearProgresso(capitulo) {
    this.estado.progressoDesbloqueado.add(capitulo);
    this.definir('progressoDesbloqueado', new Set(this.estado.progressoDesbloqueado));
  }

  /**
   * Verifica se capítulo está desbloqueado
   */
  estaDesbloqueado(capitulo) {
    return this.estado.progressoDesbloqueado.has(capitulo);
  }

  /**
   * Marca desafio como concluído
   */
  concluirDesafio(idDesafio) {
    this.estado.flagsConclusao.add(idDesafio);
    this.definir('flagsConclusao', new Set(this.estado.flagsConclusao));
  }

  /**
   * Verifica se desafio foi concluído
   */
  desafioConcluido(idDesafio) {
    return this.estado.flagsConclusao.has(idDesafio);
  }

  /**
   * Salva resposta do usuário
   */
  salvarResposta(idDesafio, resposta) {
    this.estado.respostasUsuario[idDesafio] = resposta;
    this.definir('respostasUsuario', { ...this.estado.respostasUsuario });
  }

  /**
   * Obtém resposta do usuário
   */
  obterResposta(idDesafio) {
    return this.estado.respostasUsuario[idDesafio];
  }

  /**
   * Bloqueia scroll
   */
  bloquearScroll() {
    this.definir('scrollBloqueado', true);
  }

  /**
   * Desbloqueia scroll
   */
  desbloquearScroll() {
    this.definir('scrollBloqueado', false);
  }

  /**
   * Define objeto 3D ativo
   */
  definirObjetoAtivo(nomeObjeto) {
    this.definir('objetoAtivo', nomeObjeto);
  }

  /**
   * Alterna modo debug
   */
  alternarDebug() {
    this.definir('modoDebug', !this.estado.modoDebug);
  }

  /**
   * Reinicia jogo completamente
   */
  reiniciar() {
    this.estado = {
      capituloAtual: 0,
      desafioAtual: null,
      progressoDesbloqueado: new Set([0]),
      flagsConclusao: new Set(),
      respostasUsuario: {},
      modoDebug: this.estado.modoDebug, // Mantém estado do debug
      scrollBloqueado: false,
      objetoAtivo: null,
      musicaAtual: null,
    };

    // Notifica todos os listeners
    this.listeners.forEach((callbacks, chave) => {
      if (chave !== '*') {
        callbacks.forEach(callback => {
          callback(this.estado[chave], undefined);
        });
      }
    });
  }

  /**
   * Pula para capítulo específico (modo debug)
   */
  pularParaCapitulo(numeroCapitulo) {
    if (!this.estado.modoDebug) {
      console.warn('Só é possível pular capítulos em modo debug');
      return;
    }
    this.definir('capituloAtual', numeroCapitulo);
    this.desbloquearProgresso(numeroCapitulo);
  }

  /**
   * Pula desafio atual (modo debug)
   */
  pularDesafio() {
    if (!this.estado.modoDebug) {
      console.warn('Só é possível pular desafios em modo debug');
      return;
    }
    if (this.estado.desafioAtual) {
      this.concluirDesafio(this.estado.desafioAtual);
      this.definir('desafioAtual', null);
    }
  }
}

// Exporta instância singleton
export const estadoGlobal = new StateManager();
