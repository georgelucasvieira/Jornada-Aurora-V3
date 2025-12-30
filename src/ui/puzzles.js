/**
 * Puzzles - Sistema de Desafios
 * Implementa todos os puzzles do jogo
 */

import { estadoGlobal } from '../core/stateManager.js';
import { audioGlobal } from '../core/audioManager.js';
import { dialogoGlobal } from '../core/dialogueManager.js';

export class PuzzleManager {
  constructor() {
    this.puzzleAtivo = null;
  }

  /**
   * Inicializa todos os puzzles
   */
  inicializar() {
    // Cap 1 - Novos puzzles
    this.inicializarPuzzleCodigo();
    this.inicializarPuzzleOrdenarFrase();
    this.inicializarPuzzleQualidades();
    this.inicializarPuzzleRiddikulus();

    // Cap 3 - Sliding Blocks
    this.inicializarPuzzleSlidingBlocks();

    // Cap 4 - Memórias
    this.inicializarPuzzleObliviate();
    this.inicializarPuzzleMemoriasQuiz();
    this.inicializarPuzzleMemoriasCronologia();
    this.inicializarPuzzleQuebraCabeca();

    // Cap 5 - Linguagem Sagrada
    this.inicializarPuzzleExpectoPatronum();
    this.inicializarPuzzleWingardiumLeviosa();
    this.inicializarPuzzlePaiNosso1();
    this.inicializarPuzzlePaiNosso2();

    // Cap 6 - Voo
    this.inicializarPuzzleAruossav();

    // Puzzles antigos (manter temporariamente)
    this.inicializarPuzzleEscolha();
    // this.inicializarPuzzleMemoria();
    this.inicializarPuzzleOrtografia();
    // this.inicializarPuzzleLimite();
  }

  /**
   * PUZZLE 1 - Código do Cartão
   */
  inicializarPuzzleCodigo() {
    const input = document.getElementById('input-codigo');
    const botao = document.getElementById('btn-codigo');
    const mensagem = document.querySelector('#puzzle-codigo .mensagem-erro');

    // Palavra correta: SABEDORIA (embaralhada no cartão: SABERIDOA)
    const codigoCorrecto = 'SABEDORIA';

    botao.addEventListener('click', () => {
      const codigoDigitado = input.value.trim().toUpperCase();

      if (codigoDigitado === '') {
        mensagem.textContent = 'Digite algo...';
        return;
      }

      if (codigoDigitado === codigoCorrecto) {
        // Acertou!
        audioGlobal.tocarSFX('progresso');
        estadoGlobal.concluirDesafio('codigo');
        estadoGlobal.salvarResposta('codigo', codigoDigitado);

        dialogoGlobal.exibir('Sabedoria... A primeira chave.', {
          comAudio: true,
          callback: () => {
            this.desbloquearProgresso();
          }
        });

        // Limpa e desabilita
        input.disabled = true;
        botao.disabled = true;
        mensagem.textContent = '';
      } else {
        // Errou
        audioGlobal.tocarSFX('tenteNovamente');
        mensagem.textContent = 'Não é essa palavra... Tente novamente.';

        setTimeout(() => {
          mensagem.textContent = '';
        }, 3000);
      }
    });

    // Enter para submeter
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        botao.click();
      }
    });
  }

  /**
   * PUZZLE 2 - Escolha
   */
  inicializarPuzzleEscolha() {
    const botoes = document.querySelectorAll('.btn-escolha');

    botoes.forEach(botao => {
      botao.addEventListener('click', () => {
        const escolha = botao.dataset.escolha;

        audioGlobal.tocarSFX('clique');
        estadoGlobal.concluirDesafio('escolha');
        estadoGlobal.salvarResposta('escolha', escolha);

        // Desabilita todos os botões
        botoes.forEach(b => b.disabled = true);

        // Feedback
        dialogoGlobal.exibir('Interessante escolha.', {
          comAudio: true,
          callback: () => {
            this.desbloquearProgresso();
          }
        });
      });
    });
  }

  /**
   * PUZZLE 3 - Memória Afetiva
   */
  inicializarPuzzleMemoria() {
    const containerMemorizar = document.getElementById('cartas-memorizar');
    const containerSelecionar = document.getElementById('cartas-selecionar');
    const botaoConfirmar = document.getElementById('btn-confirmar-memoria');
    const mensagem = document.querySelector('#puzzle-memoria .mensagem-erro');

    // Cartas de memória (personalizar com momentos reais)
    const todasCartas = [
      'Primeiro filme juntos',
      'Uma briga boba',
      'Uma oração compartilhada',
      'Uma promessa',
      'Uma viagem',
      'Um silêncio importante',
      'Um presente especial',
      'Uma música marcante'
    ];

    // Cartas corretas (as que "permaneceram")
    const cartasCorretas = [
      'Uma oração compartilhada',
      'Uma promessa',
      'Um silêncio importante'
    ];

    const TEMPO_MEMORIZAR = 5000; // 5 segundos
    const MAX_SELECAO = 3;
    let cartasSelecionadas = [];

    // Mostra cartas para memorizar
    function mostrarCartasMemorizar() {
      containerMemorizar.innerHTML = '';
      containerMemorizar.style.display = 'grid';

      todasCartas.forEach(texto => {
        const carta = document.createElement('div');
        carta.className = 'carta';
        carta.textContent = texto;
        containerMemorizar.appendChild(carta);
      });

      // Após tempo, esconde e mostra para seleção
      setTimeout(() => {
        esconderEMostrarSelecao();
      }, TEMPO_MEMORIZAR);
    }

    function esconderEMostrarSelecao() {
      containerMemorizar.style.display = 'none';

      // Embaralha cartas
      const cartasEmbaralhadas = [...todasCartas].sort(() => Math.random() - 0.5);

      containerSelecionar.innerHTML = '';
      containerSelecionar.style.display = 'grid';

      cartasEmbaralhadas.forEach(texto => {
        const carta = document.createElement('div');
        carta.className = 'carta';
        carta.textContent = texto;
        carta.dataset.texto = texto;

        carta.addEventListener('click', () => {
          if (carta.classList.contains('desabilitada')) return;

          if (carta.classList.contains('selecionada')) {
            // Desseleciona
            carta.classList.remove('selecionada');
            cartasSelecionadas = cartasSelecionadas.filter(c => c !== texto);
          } else {
            // Seleciona
            if (cartasSelecionadas.length < MAX_SELECAO) {
              carta.classList.add('selecionada');
              cartasSelecionadas.push(texto);
            } else {
              mensagem.textContent = `Apenas ${MAX_SELECAO} cartas podem ser selecionadas.`;
              setTimeout(() => {
                mensagem.textContent = '';
              }, 2000);
            }
          }

          // Mostra botão confirmar se tiver selecionado 3
          if (cartasSelecionadas.length === MAX_SELECAO) {
            botaoConfirmar.style.display = 'block';
          } else {
            botaoConfirmar.style.display = 'none';
          }
        });

        containerSelecionar.appendChild(carta);
      });
    }

    // Confirmar seleção
    botaoConfirmar.addEventListener('click', () => {
      // Verifica se acertou todas
      const acertou = cartasSelecionadas.every(c => cartasCorretas.includes(c)) &&
                      cartasSelecionadas.length === cartasCorretas.length;

      if (acertou) {
        audioGlobal.tocarSFX('sucesso');
        estadoGlobal.concluirDesafio('memoria');
        estadoGlobal.salvarResposta('memoria', cartasSelecionadas);

        botaoConfirmar.disabled = true;

        dialogoGlobal.exibir('Você lembrou. Pode seguir.', {
          comAudio: true,
          callback: () => {
            this.desbloquearProgresso();
          }
        });
      } else {
        audioGlobal.tocarSFX('erro');
        mensagem.textContent = 'Nem toda lembrança vem na primeira vez. Olhe com mais atenção.';

        // Reseta
        cartasSelecionadas = [];
        containerSelecionar.querySelectorAll('.carta').forEach(c => {
          c.classList.remove('selecionada');
        });
        botaoConfirmar.style.display = 'none';

        setTimeout(() => {
          mensagem.textContent = '';
        }, 3000);
      }
    });

    // Inicia quando a section estiver visível
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !estadoGlobal.desafioConcluido('memoria')) {
          mostrarCartasMemorizar();
          observer.disconnect();
        }
      });
    });

    const section = document.getElementById('desafio-memoria');
    if (section) {
      observer.observe(section);
    }
  }

  /**
   * PUZZLE 4 - Ortografia (Quiz Harry Potter)
   */
  inicializarPuzzleOrtografia() {
    const botoes = document.querySelectorAll('#puzzle-ortografia .btn-opcao');
    const mensagem = document.querySelector('#puzzle-ortografia .mensagem-erro');

    botoes.forEach(botao => {
      botao.addEventListener('click', () => {
        const correto = botao.dataset.correto === 'true';

        // Desabilita todos
        botoes.forEach(b => b.disabled = true);

        if (correto) {
          botao.classList.add('correto');
          audioGlobal.tocarSFX('sucesso');
          estadoGlobal.concluirDesafio('ortografia');
          estadoGlobal.salvarResposta('ortografia', botao.textContent);

          dialogoGlobal.exibir('Pequenos detalhes também protegem.', {
            comAudio: true,
            callback: () => {
              this.desbloquearProgresso();
            }
          });
        } else {
          botao.classList.add('incorreto');
          audioGlobal.tocarSFX('erro');
          mensagem.textContent = 'Nem tudo o que parece certo está correto. Tente outra vez.';

          setTimeout(() => {
            // Reabilita
            botoes.forEach(b => {
              b.disabled = false;
              b.classList.remove('incorreto');
            });
            mensagem.textContent = '';
          }, 2000);
        }
      });
    });
  }

  /**
   * PUZZLE FINAL - O Limite (impossível)
   */
  inicializarPuzzleLimite() {
    const botaoTentar = document.getElementById('btn-tentar');
    const botaoContinuar = document.getElementById('btn-continuar-limite');
    const textoLimite = document.getElementById('texto-limite');

    let tentativas = 0;
    const MAX_TENTATIVAS = 3;

    botaoTentar.addEventListener('click', () => {
      tentativas++;
      audioGlobal.tocarSFX('erro');

      if (tentativas < MAX_TENTATIVAS) {
        textoLimite.textContent = 'Nada acontece.';

        setTimeout(() => {
          textoLimite.textContent = '';
        }, 2000);
      } else {
        // Após 3 tentativas, revela que não há solução
        botaoTentar.style.display = 'none';
        textoLimite.textContent = 'Há lutas que não se vencem insistindo. Apenas permanecendo.';

        setTimeout(() => {
          botaoContinuar.style.display = 'block';
        }, 2000);
      }
    });

    botaoContinuar.addEventListener('click', () => {
      audioGlobal.tocarSFX('progresso');
      estadoGlobal.concluirDesafio('limite');

      botaoContinuar.disabled = true;

      dialogoGlobal.exibir('Você compreendeu.', {
        comAudio: true,
        callback: () => {
          this.desbloquearProgresso();
        }
      });
    });
  }

  /**
   * PUZZLE 2 - Ordenar Frase Bíblica
   */
  inicializarPuzzleOrdenarFrase() {
    const containerFragmentos = document.getElementById('fragmentos-frase');
    const areaMontagem = document.getElementById('area-montagem');
    const btnLimpar = document.getElementById('btn-limpar-frase');
    const btnConfirmar = document.getElementById('btn-confirmar-frase');
    const mensagem = document.querySelector('#puzzle-ordenar-frase .mensagem-erro');

    if (!containerFragmentos) return; // Puzzle não existe ainda

    // Fragmentos da frase (ordem correta)
    const fragmentosCorretos = [
      'Antes que eu',
      'te formasse',
      'no ventre materno,',
      'eu te conheci'
    ];

    // Embaralha fragmentos
    const fragmentosEmbaralhados = [...fragmentosCorretos].sort(() => Math.random() - 0.5);
    let fragmentosSelecionados = [];

    // Renderiza fragmentos
    const renderizarFragmentos = () => {
      containerFragmentos.innerHTML = '';
      fragmentosEmbaralhados.forEach((texto) => {
        const fragmento = document.createElement('div');
        fragmento.className = 'fragmento';
        fragmento.textContent = texto;
        fragmento.dataset.texto = texto;

        if (fragmentosSelecionados.includes(texto)) {
          fragmento.classList.add('selecionado');
        }

        fragmento.addEventListener('click', () => {
          if (!fragmento.classList.contains('selecionado')) {
            fragmentosSelecionados.push(texto);
            audioGlobal.tocarSFX('clique');
            renderizarFragmentos();
            atualizarMontagem();
          }
        });

        containerFragmentos.appendChild(fragmento);
      });
    };

    // Atualiza área de montagem
    const atualizarMontagem = () => {
      const instrucao = areaMontagem.querySelector('.instrucao');

      if (fragmentosSelecionados.length === 0) {
        if (!instrucao) {
          areaMontagem.innerHTML = '<p class="instrucao">Clique nos fragmentos na ordem correta</p>';
        }
        return;
      }

      if (instrucao) {
        instrucao.remove();
      }

      let fraseMontada = areaMontagem.querySelector('.frase-montada');
      if (!fraseMontada) {
        fraseMontada = document.createElement('div');
        fraseMontada.className = 'frase-montada';
        areaMontagem.appendChild(fraseMontada);
      }

      fraseMontada.innerHTML = '';
      fragmentosSelecionados.forEach(texto => {
        const fragmento = document.createElement('span');
        fragmento.className = 'fragmento-montado';
        fragmento.textContent = texto;
        fraseMontada.appendChild(fragmento);
      });
    };

    // Limpar seleção
    btnLimpar.addEventListener('click', () => {
      fragmentosSelecionados = [];
      renderizarFragmentos();
      areaMontagem.innerHTML = '<p class="instrucao">Clique nos fragmentos na ordem correta</p>';
      mensagem.textContent = '';
      audioGlobal.tocarSFX('clique');
    });

    // Confirmar
    btnConfirmar.addEventListener('click', () => {
      if (fragmentosSelecionados.length !== fragmentosCorretos.length) {
        mensagem.textContent = 'Complete a frase primeiro...';
        audioGlobal.tocarSFX('erro');
        return;
      }

      const correto = fragmentosSelecionados.every((frag, idx) => frag === fragmentosCorretos[idx]);

      if (correto) {
        audioGlobal.tocarSFX('sucesso');
        estadoGlobal.concluirDesafio('ordenar-frase');
        estadoGlobal.salvarResposta('ordenar-frase', fragmentosSelecionados.join(' '));

        btnLimpar.disabled = true;
        btnConfirmar.disabled = true;

        dialogoGlobal.exibir('Antes de existir... você já era conhecida.', {
          comAudio: true,
          callback: () => {
            this.desbloquearProgresso();
          }
        });
      } else {
        audioGlobal.tocarSFX('erro');
        mensagem.textContent = 'A ordem não está correta. Tente novamente.';
        setTimeout(() => {
          mensagem.textContent = '';
        }, 2500);
      }
    });

    renderizarFragmentos();
  }

  /**
   * PUZZLE 3 - Quiz de Qualidades (Casas de Hogwarts)
   */
  inicializarPuzzleQualidades() {
    const btnContinuar = document.getElementById('btn-continuar-qualidades');
    const momentosItems = document.querySelectorAll('.momento-item');
    const casasItems = document.querySelectorAll('.casa-item');

    if (!btnContinuar || momentosItems.length === 0 || casasItems.length === 0) return;

    let respostas = {};
    let momentoSelecionado = null;

    // Click em momento (esquerda)
    momentosItems.forEach(momentoItem => {
      momentoItem.addEventListener('click', () => {
        // Desmarca todos
        momentosItems.forEach(m => m.classList.remove('selecionado'));

        // Marca este
        momentoItem.classList.add('selecionado');
        momentoSelecionado = momentoItem.dataset.momento;

        audioGlobal.tocarSFX('clique');
      });
    });

    // Click em casa (direita)
    casasItems.forEach(casaItem => {
      casaItem.addEventListener('click', () => {
        if (!momentoSelecionado) {
          // Mostra mensagem de erro
          const mensagemErro = document.querySelector('#puzzle-qualidades .mensagem-erro');
          if (mensagemErro) {
            mensagemErro.textContent = 'Selecione um momento primeiro!';
            setTimeout(() => mensagemErro.textContent = '', 2000);
          }
          return;
        }

        // Salva resposta
        const casa = casaItem.dataset.casa;
        respostas[momentoSelecionado] = casa;

        // Marca momento como completo
        const momentoCompleto = document.querySelector(`.momento-item[data-momento="${momentoSelecionado}"]`);
        if (momentoCompleto) {
          momentoCompleto.classList.remove('selecionado');
          momentoCompleto.classList.add('completo');

          // Adiciona badge da casa no conector
          const conector = momentoCompleto.querySelector('.momento-conector');
          if (conector) {
            conector.textContent = casa.charAt(0).toUpperCase();
            conector.classList.add('ativo', casa.toLowerCase().replace('-', ''));
          }
        }

        audioGlobal.tocarSFX('progresso');
        momentoSelecionado = null;

        // Verifica se completou todos
        if (Object.keys(respostas).length === 4) {
          btnContinuar.style.display = 'block';
        }
      });
    });

    btnContinuar.addEventListener('click', () => {
      audioGlobal.tocarSFX('progresso');
      estadoGlobal.concluirDesafio('qualidades');
      estadoGlobal.salvarResposta('qualidades', respostas);

      btnContinuar.disabled = true;

      dialogoGlobal.exibir('O Chapéu vê suas escolhas e reconhece a verdade.', {
        comAudio: true,
        callback: () => {
          this.desbloquearProgresso();
        }
      });
    });
  }

  /**
   * PUZZLE 4 - Riddikulus (Transformar Medo)
   */
  inicializarPuzzleRiddikulus() {
    const selectMedo = document.getElementById('select-medo');
    const areaRiddikulus = document.getElementById('area-riddikulus');
    const inputRiddikulus = document.getElementById('input-riddikulus');
    const btnRiddikulus = document.getElementById('btn-riddikulus');
    const mensagem = document.querySelector('#puzzle-riddikulus .mensagem-erro');

    if (!selectMedo) return;

    selectMedo.addEventListener('change', () => {
      if (selectMedo.value) {
        areaRiddikulus.style.display = 'block';
        audioGlobal.tocarSFX('clique');
      }
    });

    btnRiddikulus.addEventListener('click', () => {
      const medo = selectMedo.value;
      const transformacao = inputRiddikulus.value.trim();

      if (!medo) {
        mensagem.textContent = 'Escolha um medo primeiro...';
        return;
      }

      if (transformacao.length < 10) {
        mensagem.textContent = 'Descreva melhor a transformação...';
        return;
      }

      audioGlobal.tocarSFX('sucesso');
      estadoGlobal.concluirDesafio('riddikulus');
      estadoGlobal.salvarResposta('riddikulus', { medo, transformacao });

      selectMedo.disabled = true;
      inputRiddikulus.disabled = true;
      btnRiddikulus.disabled = true;

      dialogoGlobal.exibir('Riddikulus! O medo perde seu poder quando vira ridículo.', {
        comAudio: true,
        callback: () => {
          this.desbloquearProgresso();
        }
      });
    });
  }

  /**
   * CAP 3 - SLIDING BLOCKS (3 NÍVEIS)
   */
  inicializarPuzzleSlidingBlocks() {
    const grid = document.getElementById('sliding-grid');
    const nivelAtualSpan = document.getElementById('nivel-atual');
    const contadorMovimentos = document.getElementById('contador-movimentos');
    const btnReset = document.getElementById('btn-reset-sliding');
    const mensagem = document.querySelector('#desafio-sliding-blocks .mensagem-erro');
    const secaoDesafio = document.querySelector('#desafio-sliding-blocks');

    if (!grid || !nivelAtualSpan || !contadorMovimentos || !btnReset) return;

    // SFX: Trovão quando o baú/desafio se revela
    if (secaoDesafio) {
      let trovaoJaTocado = false;
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5 && !trovaoJaTocado) {
            trovaoJaTocado = true;
            audioGlobal.tocarSFX('trovao');
            console.log('⚡ SFX: Trovão (revelação do baú Cap 3)');
          }
        });
      }, { threshold: 0.5 });

      observer.observe(secaoDesafio);
    }

    // Configurações dos 3 níveis
    const niveis = [
      { nivel: 1, linhas: 3, colunas: 3, numBlocos: 8 }, // 3x3 = 9 células, 8 blocos + 1 vazio
      { nivel: 2, linhas: 4, colunas: 4, numBlocos: 15 }, // 4x4 = 16 células, 15 blocos + 1 vazio
      { nivel: 3, linhas: 4, colunas: 5, numBlocos: 19 }  // 4x5 = 20 células, 19 blocos + 1 vazio
    ];

    let nivelAtual = 0;
    let movimentos = 0;
    let estadoAtual = [];
    let posicaoVazia = { linha: 0, coluna: 0 };

    /**
     * Gera configuração inicial embaralhada
     */
    const gerarEstadoInicial = (config) => {
      const numeros = Array.from({ length: config.numBlocos }, (_, i) => i + 1);
      numeros.push(0); // 0 representa o espaço vazio

      // Embaralha
      for (let i = numeros.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numeros[i], numeros[j]] = [numeros[j], numeros[i]];
      }

      // Converte para matriz
      const estado = [];
      for (let i = 0; i < config.linhas; i++) {
        estado.push(numeros.slice(i * config.colunas, (i + 1) * config.colunas));
      }

      // Encontra posição do vazio
      for (let linha = 0; linha < config.linhas; linha++) {
        for (let coluna = 0; coluna < config.colunas; coluna++) {
          if (estado[linha][coluna] === 0) {
            posicaoVazia = { linha, coluna };
            break;
          }
        }
      }

      return estado;
    };

    /**
     * Renderiza o grid
     */
    const renderizarGrid = (config) => {
      grid.innerHTML = '';
      grid.setAttribute('data-nivel', config.nivel);

      estadoAtual.forEach((linha, linhaIdx) => {
        linha.forEach((valor, colunaIdx) => {
          const bloco = document.createElement('div');
          bloco.className = 'sliding-block';
          bloco.dataset.linha = linhaIdx;
          bloco.dataset.coluna = colunaIdx;

          if (valor === 0) {
            bloco.classList.add('empty');
          } else {
            bloco.textContent = valor;

            // Verifica se é adjacente ao vazio (movível)
            const eMovivel = verificarMovivel(linhaIdx, colunaIdx);
            if (eMovivel) {
              bloco.classList.add('movable');
            }

            bloco.addEventListener('click', () => {
              if (verificarMovivel(linhaIdx, colunaIdx)) {
                moverBloco(linhaIdx, colunaIdx, config);
              }
            });
          }

          grid.appendChild(bloco);
        });
      });
    };

    /**
     * Verifica se um bloco pode se mover (é adjacente ao vazio)
     */
    const verificarMovivel = (linha, coluna) => {
      const difLinha = Math.abs(linha - posicaoVazia.linha);
      const difColuna = Math.abs(coluna - posicaoVazia.coluna);

      // Adjacente horizontal ou vertical (não diagonal)
      return (difLinha === 1 && difColuna === 0) || (difLinha === 0 && difColuna === 1);
    };

    /**
     * Move um bloco para o espaço vazio
     */
    const moverBloco = (linha, coluna, config) => {
      // Troca posições
      const temp = estadoAtual[linha][coluna];
      estadoAtual[linha][coluna] = estadoAtual[posicaoVazia.linha][posicaoVazia.coluna];
      estadoAtual[posicaoVazia.linha][posicaoVazia.coluna] = temp;

      // Atualiza posição do vazio
      posicaoVazia = { linha, coluna };

      // Incrementa movimentos
      movimentos++;
      contadorMovimentos.textContent = movimentos;

      // Re-renderiza
      audioGlobal.tocarSFX('clique');
      renderizarGrid(config);

      // Verifica se completou
      if (verificarCompleto(config)) {
        nivelCompleto(config);
      }
    };

    /**
     * Verifica se o puzzle está completo
     */
    const verificarCompleto = (config) => {
      let numeroEsperado = 1;

      // for (let linha = 0; linha < config.linhas; linha++) {
      //   for (let coluna = 0; coluna < config.colunas; coluna++) {
      //     const isUltimaCelula = linha === config.linhas - 1 && coluna === config.colunas - 1;

      //     if (isUltimaCelula) {
      //       // Última célula deve ser 0 (vazio)
      //       if (estadoAtual[linha][coluna] !== 0) return false;
      //     } else {
      //       // Outras células devem estar em ordem
      //       if (estadoAtual[linha][coluna] !== numeroEsperado) return false;
      //       numeroEsperado++;
      //     }
      //   }
      // }

      return true;
    };

    /**
     * Nível completo
     */
    const nivelCompleto = (config) => {
      grid.classList.add('nivel-completo');
      audioGlobal.tocarSFX('sucesso');

      setTimeout(() => {
        grid.classList.remove('nivel-completo');

        if (nivelAtual < niveis.length - 1) {
          // Próximo nível
          dialogoGlobal.exibir(`Nível ${config.nivel} completo! Preparando próximo desafio...`, {
            comAudio: true,
            callback: () => {
              nivelAtual++;
              iniciarNivel(niveis[nivelAtual]);
            }
          });
        } else {
          // Todos os níveis completos
          // SFX: Baú abrindo
          audioGlobal.tocarSFX('bau');
          console.log('📦 SFX: Baú abrindo (Cap 3 completo)');

          dialogoGlobal.exibir('Os três selos foram quebrados. O baú se abre...', {
            comAudio: true,
            callback: () => {
              estadoGlobal.concluirDesafio('sliding-blocks');
              this.desbloquearProgresso();
            }
          });
        }
      }, 800);
    };

    /**
     * Inicia um nível
     */
    const iniciarNivel = (config) => {
      nivelAtualSpan.textContent = config.nivel;
      movimentos = 0;
      contadorMovimentos.textContent = movimentos;
      mensagem.textContent = '';

      estadoAtual = gerarEstadoInicial(config);
      renderizarGrid(config);
    };

    /**
     * Reset do nível atual
     */
    btnReset.addEventListener('click', () => {
      audioGlobal.tocarSFX('clique');
      iniciarNivel(niveis[nivelAtual]);
    });

    // Inicia o primeiro nível
    iniciarNivel(niveis[nivelAtual]);
  }

  /**
   * CAP 4.1 - CÓDIGO OBLIVIATE (COM HINT APÓS 2MIN)
   */
  inicializarPuzzleObliviate() {
    const input = document.getElementById('input-obliviate');
    const btn = document.getElementById('btn-obliviate');
    const mensagem = document.querySelector('#desafio-obliviate .mensagem-erro');
    const hint = document.getElementById('hint-obliviate');

    if (!input || !btn) return;

    const codigoCorreto = 'OBLIVIATE';
    let hintMostrado = false;

    // Timer para mostrar hint após 2 minutos
    setTimeout(() => {
      if (!hintMostrado && hint) {
        hint.style.display = 'block';
        hintMostrado = true;
      }
    }, 120000); // 2 minutos = 120000ms

    btn.addEventListener('click', () => {
      const valor = input.value.trim().toUpperCase();

      if (valor === codigoCorreto) {
        audioGlobal.tocarSFX('sucesso');
        mensagem.textContent = '';

        dialogoGlobal.exibir('Obliviate... O feitiço que apaga memórias. Mas algumas, não podem ser esquecidas.', {
          comAudio: true,
          callback: () => {
            estadoGlobal.concluirDesafio('obliviate');
            this.desbloquearProgresso();
          }
        });
      } else {
        audioGlobal.tocarSFX('erro');
        mensagem.textContent = 'Código incorreto. Verifique o cartão.';
      }
    });

    // Enter para submeter
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') btn.click();
    });
  }

  /**
   * CAP 4.2 - QUIZ PERGUNTAS SOBRE MEMÓRIAS
   */
  inicializarPuzzleMemoriasQuiz() {
    const container = document.getElementById('quiz-memorias-container');

    if (!container) return;

    // Perguntas personalizadas sobre memórias do casal
    const perguntas = [
      {
        pergunta: 'Qual a cor do vestido que usou na primeira vez que saímos?',
        opcoes: ['Vermelho', 'Azul', 'Preto', 'Branco'],
        respostaCorreta: 0 // Índice da resposta correta (VOCÊ DEVE PERSONALIZAR!)
      },
      {
        pergunta: 'Quais pratos pedimos no restaurante que conversamos pela primeira vez sobre intenção de namoro?',
        opcoes: ['Pizza e Massa', 'Hambúrguer e Batata', 'Sushi e Sashimi', 'Salada e Risoto'],
        respostaCorreta: 0 // (VOCÊ DEVE PERSONALIZAR!)
      },
      {
        pergunta: 'Qual foi o primeiro filme que assistimos juntos?',
        opcoes: ['Harry Potter', 'Senhor dos Anéis', 'Star Wars', 'Marvel'],
        respostaCorreta: 0 // (VOCÊ DEVE PERSONALIZAR!)
      }
    ];

    let perguntaAtual = 0;
    let respostas = [];

    const renderizarPergunta = () => {
      if (perguntaAtual >= perguntas.length) {
        // Quiz completo
        mostrarResultado();
        return;
      }

      const pergunta = perguntas[perguntaAtual];

      container.innerHTML = `
        <div class="quiz-pergunta-card">
          <p class="quiz-numero">Pergunta ${perguntaAtual + 1} de ${perguntas.length}</p>
          <p class="quiz-pergunta-texto">${pergunta.pergunta}</p>
          <div class="quiz-opcoes">
            ${pergunta.opcoes.map((opcao, idx) => `
              <button class="quiz-opcao" data-idx="${idx}">
                ${opcao}
              </button>
            `).join('')}
          </div>
          <p class="mensagem-erro"></p>
        </div>
      `;

      // Event listeners nas opções
      const opcoes = container.querySelectorAll('.quiz-opcao');
      const mensagemErro = container.querySelector('.mensagem-erro');

      opcoes.forEach(opcao => {
        opcao.addEventListener('click', () => {
          const idx = parseInt(opcao.dataset.idx);

          // Desabilita todas as opções
          opcoes.forEach(o => o.disabled = true);

          if (idx === pergunta.respostaCorreta) {
            // Resposta correta
            opcao.classList.add('correta');
            audioGlobal.tocarSFX('sucesso');
            respostas.push(true);

            setTimeout(() => {
              perguntaAtual++;
              renderizarPergunta();
            }, 1500);
          } else {
            // Resposta errada
            opcao.classList.add('errada');
            opcoes[pergunta.respostaCorreta].classList.add('correta');
            audioGlobal.tocarSFX('erro');
            respostas.push(false);

            mensagemErro.textContent = 'Ops! Mas vamos continuar...';

            setTimeout(() => {
              perguntaAtual++;
              renderizarPergunta();
            }, 2500);
          }
        });
      });
    };

    const mostrarResultado = () => {
      const acertos = respostas.filter(r => r).length;
      const total = perguntas.length;

      container.innerHTML = `
        <div class="quiz-resultado">
          <p class="quiz-resultado-titulo">Quiz Completo!</p>
          <p class="quiz-resultado-pontos">Você acertou ${acertos} de ${total}</p>
          <p class="quiz-resultado-mensagem">As memórias importam mais que a pontuação.</p>
          <button id="btn-continuar-quiz" class="btn-primary">Continuar</button>
        </div>
      `;

      const btnContinuar = container.querySelector('#btn-continuar-quiz');
      btnContinuar.addEventListener('click', () => {
        audioGlobal.tocarSFX('progresso');
        estadoGlobal.concluirDesafio('memorias-quiz');
        estadoGlobal.salvarResposta('memorias-quiz', { acertos, total });

        dialogoGlobal.exibir('Cada lembrança é um tesouro guardado...', {
          comAudio: true,
          callback: () => {
            this.desbloquearProgresso();
          }
        });
      });
    };

    renderizarPergunta();
  }

  /**
   * CAP 4.3 - QUIZ CRONOLOGIA (ORDENAR EVENTOS)
   */
  inicializarPuzzleMemoriasCronologia() {
    const containerEventos = document.getElementById('eventos-cronologia');
    const containerOrdenados = document.getElementById('eventos-ordenados');
    const btnLimpar = document.getElementById('btn-limpar-cronologia');
    const btnConfirmar = document.getElementById('btn-confirmar-cronologia');
    const mensagem = document.querySelector('#desafio-memorias-cronologia .mensagem-erro');

    if (!containerEventos || !containerOrdenados) return;

    // Eventos do relacionamento (VOCÊ DEVE PERSONALIZAR!)
    const eventosCorretos = [
      'Nos conhecemos no trabalho',
      'Primeira conversa no café',
      'Primeiro encontro oficial',
      'Primeira viagem juntos',
      'Conheci sua família'
    ];

    // Embaralha
    const eventosEmbaralhados = [...eventosCorretos].sort(() => Math.random() - 0.5);
    let eventosEscolhidos = [];

    const renderizarEventos = () => {
      containerEventos.innerHTML = '';
      eventosEmbaralhados.forEach((texto) => {
        const card = document.createElement('div');
        card.className = 'evento-card';
        card.textContent = texto;

        if (eventosEscolhidos.includes(texto)) {
          card.classList.add('selecionado');
        } else {
          card.addEventListener('click', () => {
            eventosEscolhidos.push(texto);
            audioGlobal.tocarSFX('clique');
            renderizarEventos();
            atualizarLinhaTempo();
          });
        }

        containerEventos.appendChild(card);
      });
    };

    const atualizarLinhaTempo = () => {
      containerOrdenados.innerHTML = '';
      eventosEscolhidos.forEach((texto, idx) => {
        const div = document.createElement('div');
        div.className = 'evento-ordenado';

        const numero = document.createElement('span');
        numero.className = 'evento-numero';
        numero.textContent = idx + 1;

        const textoSpan = document.createElement('span');
        textoSpan.textContent = texto;

        div.appendChild(numero);
        div.appendChild(textoSpan);
        containerOrdenados.appendChild(div);
      });
    };

    const limpar = () => {
      eventosEscolhidos = [];
      audioGlobal.tocarSFX('clique');
      renderizarEventos();
      atualizarLinhaTempo();
      mensagem.textContent = '';
    };

    btnLimpar.addEventListener('click', limpar);

    btnConfirmar.addEventListener('click', () => {
      if (eventosEscolhidos.length !== eventosCorretos.length) {
        mensagem.textContent = 'Selecione todos os eventos primeiro.';
        audioGlobal.tocarSFX('erro');
        return;
      }

      const correto = eventosEscolhidos.every((ev, idx) => ev === eventosCorretos[idx]);

      if (correto) {
        audioGlobal.tocarSFX('sucesso');
        mensagem.textContent = '';

        dialogoGlobal.exibir('Perfeito. Cada passo trouxe vocês até aqui.', {
          comAudio: true,
          callback: () => {
            estadoGlobal.concluirDesafio('memorias-cronologia');
            this.desbloquearProgresso();
          }
        });
      } else {
        audioGlobal.tocarSFX('erro');
        mensagem.textContent = 'A ordem não está correta. Tente novamente.';
      }
    });

    renderizarEventos();
  }

  /**
   * CAP 4.4 - QUEBRA-CABEÇA DE FOTO VERTICAL (24 PEÇAS)
   *
   * RESOLUÇÃO DA FOTO DO USUÁRIO: 2268x4032px
   * - Cortada para: 2268x3402px (4 colunas x 6 linhas)
   * - Cada peça: 567x567px (quadrada)
   * - Grid: 4 colunas x 6 linhas = 24 peças
   * - Proporção final: 2:3 (portrait)
   * - Formato: JPG
   */
  inicializarPuzzleQuebraCabeca() {
    const grid = document.getElementById('quebra-cabeca-grid');
    const contadorPecas = document.getElementById('contador-pecas');
    const btnReset = document.getElementById('btn-reset-quebra-cabeca');

    if (!grid || !contadorPecas) return;

    // Configuração do grid: 4 colunas x 6 linhas = 24 peças
    const COLUNAS = 4;
    const LINHAS = 6;
    const totalPecas = COLUNAS * LINHAS; // 24 peças
    let pecas = [];
    let pecasCorretas = 0;

    const imagemFoto = 'src/assets/images/foto-casal.png';

    // Gera peças embaralhadas
    const gerarPecas = () => {
      const numeros = Array.from({ length: totalPecas }, (_, i) => i);
      // Embaralha (Fisher-Yates)
      for (let i = numeros.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numeros[i], numeros[j]] = [numeros[j], numeros[i]];
      }
      return numeros;
    };

    pecas = gerarPecas();

    // Renderiza grid
    const renderizar = () => {
      grid.innerHTML = '';
      pecas.forEach((numeroPeca, posicaoAtual) => {
        const peca = document.createElement('div');
        peca.className = 'peca-quebra-cabeca';
        peca.dataset.numero = numeroPeca + 1;
        peca.dataset.posicao = posicaoAtual;
        peca.draggable = true;

        // Calcula posição da peça na imagem original
        const col = numeroPeca % COLUNAS; // 0-4
        const row = Math.floor(numeroPeca / COLUNAS); // 0-3

        // Define imagem de fundo com posição correta
        peca.style.backgroundImage = `url('${imagemFoto}')`;

        // IMPORTANTE: O tamanho das peças muda com media queries (200px, 150px, 100px)
        // Mas o cálculo sempre usa a proporção da imagem original (1000x800px)
        // O CSS usa background-size para escalar, então usamos porcentagem
        const bgPosX = (col / (COLUNAS - 1)) * 100; // 0%, 25%, 50%, 75%, 100%
        const bgPosY = (row / (LINHAS - 1)) * 100;   // 0%, 33.33%, 66.66%, 100%

        peca.style.backgroundPosition = `${bgPosX}% ${bgPosY}%`;
        peca.style.backgroundSize = `${COLUNAS * 100}% ${LINHAS * 100}%`; // 500% 400%

        // Verifica se está na posição correta
        if (numeroPeca === posicaoAtual) {
          peca.classList.add('correta');
        }

        // Drag and Drop
        peca.addEventListener('dragstart', (e) => {
          e.dataTransfer.setData('posicaoOrigem', posicaoAtual);
        });

        peca.addEventListener('dragover', (e) => {
          e.preventDefault();
        });

        peca.addEventListener('drop', (e) => {
          e.preventDefault();
          const posicaoOrigem = parseInt(e.dataTransfer.getData('posicaoOrigem'));
          const posicaoDestino = posicaoAtual;

          // Troca peças
          [pecas[posicaoOrigem], pecas[posicaoDestino]] = [pecas[posicaoDestino], pecas[posicaoOrigem]];

          audioGlobal.tocarSFX('clique');
          renderizar();
          verificarCompleto();
        });

        grid.appendChild(peca);
      });
    };

    const verificarCompleto = () => {
      pecasCorretas = pecas.filter((num, idx) => num === idx).length;
      contadorPecas.textContent = pecasCorretas;

      if (pecasCorretas === totalPecas) {
        setTimeout(() => {
          audioGlobal.tocarSFX('sucesso');

          dialogoGlobal.exibir('A imagem se completa... E com ela, a memória de tudo que viveram juntos.', {
            comAudio: true,
            callback: () => {
              estadoGlobal.concluirDesafio('quebra-cabeca');
              this.desbloquearProgresso();
            }
          });
        }, 500);
      }
    };

    btnReset.addEventListener('click', () => {
      pecas = gerarPecas();
      pecasCorretas = 0;
      audioGlobal.tocarSFX('clique');
      renderizar();
      verificarCompleto();
    });

    // Inicializa
    renderizar();
    verificarCompleto();
  }

  /**
   * CAP 5.1 - FEITIÇO EXPECTO PATRONUM (QUIZ)
   */
  inicializarPuzzleExpectoPatronum() {
    const botoes = document.querySelectorAll('#puzzle-expecto-patronum .btn-opcao');
    const mensagem = document.querySelector('#desafio-expecto-patronum .mensagem-erro');

    if (botoes.length === 0) return;

    botoes.forEach((btn) => {
      btn.addEventListener('click', () => {
        const correto = btn.dataset.correto === 'true';

        // Remove classes anteriores
        botoes.forEach(b => {
          b.classList.remove('correto', 'incorreto');
          b.style.pointerEvents = 'none';
        });

        if (correto) {
          btn.classList.add('correto');
          audioGlobal.tocarSFX('sucesso');
          mensagem.textContent = '';

          setTimeout(() => {
            dialogoGlobal.exibir('Exatamente. Uma memória verdadeiramente feliz.', {
              comAudio: true,
              callback: () => {
                estadoGlobal.concluirDesafio('expecto-patronum');
                this.desbloquearProgresso();
              }
            });
          }, 800);
        } else {
          btn.classList.add('incorreto');
          audioGlobal.tocarSFX('erro');
          mensagem.textContent = 'Não é isso. Tente novamente.';

          setTimeout(() => {
            botoes.forEach(b => b.style.pointerEvents = 'auto');
            btn.classList.remove('incorreto');
          }, 1500);
        }
      });
    });
  }

  /**
   * CAP 5.2 - FEITIÇO WINGARDIUM LEVIOSA (QUIZ)
   */
  inicializarPuzzleWingardiumLeviosa() {
    const botoes = document.querySelectorAll('#puzzle-wingardium-leviosa .btn-opcao');
    const mensagem = document.querySelector('#desafio-wingardium-leviosa .mensagem-erro');

    if (botoes.length === 0) return;

    botoes.forEach((btn) => {
      btn.addEventListener('click', () => {
        const correto = btn.dataset.correto === 'true';

        botoes.forEach(b => {
          b.classList.remove('correto', 'incorreto');
          b.style.pointerEvents = 'none';
        });

        if (correto) {
          btn.classList.add('correto');
          audioGlobal.tocarSFX('sucesso');
          mensagem.textContent = '';

          setTimeout(() => {
            dialogoGlobal.exibir('É Levi-O-sa, não Levio-SA! Perfeito.', {
              comAudio: true,
              callback: () => {
                estadoGlobal.concluirDesafio('wingardium-leviosa');
                this.desbloquearProgresso();
              }
            });
          }, 800);
        } else {
          btn.classList.add('incorreto');
          audioGlobal.tocarSFX('erro');
          mensagem.textContent = 'Não... A pronúncia importa!';

          setTimeout(() => {
            botoes.forEach(b => b.style.pointerEvents = 'auto');
            btn.classList.remove('incorreto');
          }, 1500);
        }
      });
    });
  }

  /**
   * CAP 5.3 - PAI NOSSO EM LATIM 1 (QUIZ TRADUÇÃO)
   */
  inicializarPuzzlePaiNosso1() {
    const botoes = document.querySelectorAll('#puzzle-pai-nosso-1 .btn-opcao');
    const mensagem = document.querySelector('#desafio-pai-nosso-1 .mensagem-erro');

    if (botoes.length === 0) return;

    botoes.forEach((btn) => {
      btn.addEventListener('click', () => {
        const correto = btn.dataset.correto === 'true';

        botoes.forEach(b => {
          b.classList.remove('correto', 'incorreto');
          b.style.pointerEvents = 'none';
        });

        if (correto) {
          btn.classList.add('correto');
          audioGlobal.tocarSFX('sucesso');
          mensagem.textContent = '';

          setTimeout(() => {
            dialogoGlobal.exibir('Sim. Perdão... A palavra que liberta.', {
              comAudio: true,
              callback: () => {
                estadoGlobal.concluirDesafio('pai-nosso-1');
                this.desbloquearProgresso();
              }
            });
          }, 800);
        } else {
          btn.classList.add('incorreto');
          audioGlobal.tocarSFX('erro');
          mensagem.textContent = 'Não é essa. Reflita sobre o significado.';

          setTimeout(() => {
            botoes.forEach(b => b.style.pointerEvents = 'auto');
            btn.classList.remove('incorreto');
          }, 1500);
        }
      });
    });
  }

  /**
   * CAP 5.4 - PAI NOSSO EM LATIM 2 (COMPLETAR LACUNA)
   */
  inicializarPuzzlePaiNosso2() {
    const botoes = document.querySelectorAll('#puzzle-pai-nosso-2 .btn-lacuna');
    const mensagem = document.querySelector('#desafio-pai-nosso-2 .mensagem-erro');

    if (botoes.length === 0) return;

    const palavraCorreta = 'dimittimus';
    let selecionado = false;

    botoes.forEach((btn) => {
      btn.addEventListener('click', () => {
        if (selecionado) return;

        const palavra = btn.dataset.palavra;
        const correto = palavra === palavraCorreta;

        // Remove seleções anteriores
        botoes.forEach(b => {
          b.classList.remove('selecionado', 'correto', 'incorreto');
          b.style.pointerEvents = 'none';
        });

        btn.classList.add('selecionado');

        if (correto) {
          btn.classList.add('correto');
          audioGlobal.tocarSFX('sucesso');
          mensagem.textContent = '';
          selecionado = true;

          setTimeout(() => {
            dialogoGlobal.exibir('Sicut et nos dimittimus... Assim como nós perdoamos.', {
              comAudio: true,
              callback: () => {
                estadoGlobal.concluirDesafio('pai-nosso-2');
                this.desbloquearProgresso();
              }
            });
          }, 800);
        } else {
          btn.classList.add('incorreto');
          audioGlobal.tocarSFX('erro');
          mensagem.textContent = 'Não é essa palavra. Tente novamente.';

          setTimeout(() => {
            botoes.forEach(b => {
              b.classList.remove('selecionado', 'incorreto');
              b.style.pointerEvents = 'auto';
            });
          }, 1500);
        }
      });
    });
  }

  /**
   * CAP 6 - PUZZLE CÓDIGO ARUOSSAV
   * Código "Aruossav" (vassoura ao contrário) com hint após 2 minutos
   */
  inicializarPuzzleAruossav() {
    const input = document.querySelector('#input-aruossav');
    const btn = document.querySelector('#btn-aruossav');
    const hint = document.querySelector('#hint-aruossav');
    const mensagemErro = document.querySelector('#puzzle-aruossav .mensagem-erro');

    if (!input || !btn) return;

    const codigoCorreto = 'VASSOURA';
    let hintMostrado = false;

    // Timer para mostrar hint após 2 minutos (120000ms)
    setTimeout(() => {
      if (!hintMostrado && hint) {
        hint.style.display = 'block';
        hintMostrado = true;
      }
    }, 120000); // 2 minutos

    btn.addEventListener('click', () => {
      const valor = input.value.trim().toUpperCase();

      if (valor === codigoCorreto) {
        audioGlobal.tocarSFX('sucesso');
        btn.disabled = true;
        input.disabled = true;

        dialogoGlobal.exibir('VASSOURA... Não se trata apenas de voar, mas de não cair.', {
          comAudio: true,
          callback: () => {
            estadoGlobal.concluirDesafio('aruossav');
            this.desbloquearProgresso();
          }
        });
      } else {
        audioGlobal.tocarSFX('erro');
        mensagemErro.textContent = 'Código incorreto. Tente novamente.';
        mensagemErro.style.color = 'rgba(255, 100, 100, 0.9)';
        input.value = '';
        input.focus();

        setTimeout(() => {
          mensagemErro.textContent = '';
        }, 3000);
      }
    });

    // Também aceita Enter
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        btn.click();
      }
    });
  }

  /**
   * Desbloqueia progresso (libera scroll)
   */
  desbloquearProgresso() {
    estadoGlobal.desbloquearScroll();
  }
}

// Exporta instância
export const puzzleGlobal = new PuzzleManager();
