/**
 * A JORNADA - Main Entry Point
 * Integra todos os sistemas do projeto
 */

import './style.css';
import gsap from 'gsap';

// Core Systems
import { estadoGlobal } from './core/stateManager.js';
import { audioGlobal } from './core/audioManager.js';
import { dialogoGlobal } from './core/dialogueManager.js';
import { cenaGlobal } from './core/sceneManager.js';
import { scrollGlobal } from './core/scrollManagerStory.js';

// Three.js Objects
import { ChapeuSeletor } from './three/objects/chapeu.js';
import { Fenix } from './three/objects/fenix.js';

// UI Systems
import { puzzleGlobal } from './ui/puzzles.js';
import { flappyBirdGlobal } from './ui/minigames.js';
import { cap7Patronus } from './ui/cap7-patronus.js';
import { cap7Minigames } from './ui/cap7-minigames.js';
import { cap8Final } from './ui/cap8-final.js';

/**
 * Classe principal da aplicação
 */
class JornadaAurora {
  constructor() {
    this.iniciado = false;
  }

  /**
   * Inicializa toda a aplicação
   */
  async inicializar() {
    console.log('🎮 Iniciando A Jornada...');

    // 1. Inicializa Dialogue Manager
    dialogoGlobal.inicializar();

    // 2. Inicializa Audio Manager (já inicializa no constructor)
    console.log('🔊 Sistema de áudio inicializado');

    // 3. Inicializa Scene Manager (Three.js)
    cenaGlobal.inicializar();

    // 4. Cria e adiciona objetos 3D
    this.criarObjetos3D();

    // 5. Inicializa Puzzles
    puzzleGlobal.inicializar();

    // 6. Inicializa Minigame
    flappyBirdGlobal.inicializar();

    // 7. Inicializa Cap 7 Patronus VFX
    cap7Patronus.inicializar();

    // 8. Inicializa Cap 7 Minigames
    cap7Minigames.inicializar();

    // 9. Inicializa Cap 8 Final
    cap8Final.inicializar();

    // 9. Configura botão de início
    this.configurarInicio();

    // 10. Configura botões de debug (desenvolvimento)
    this.configurarBotoesDebug();

    console.log('✅ A Jornada inicializada com sucesso!');
  }

  /**
   * Cria objetos 3D
   */
  criarObjetos3D() {
    // Cria Chapéu Seletor
    const chapeu = new ChapeuSeletor();
    cenaGlobal.adicionarObjeto('chapeu', chapeu);
    console.log('🎩 Chapéu Seletor criado');

    // Cria Fênix
    const fenix = new Fenix();
    cenaGlobal.adicionarObjeto('fenix', fenix);
    console.log('🔥 Fênix criada');

    // Inicialmente todos invisíveis
    cenaGlobal.esconderTodos();
  }

  /**
   * Configura botão de início
   */
  configurarInicio() {
    const botaoIniciar = document.getElementById('btn-iniciar');

    if (botaoIniciar) {
      botaoIniciar.addEventListener('click', () => {
        this.iniciarJornada();
      });
    }
  }

  /**
   * Inicia a jornada (quando usuário clica em "Iniciar Jornada")
   *
   * NOVA SEQUÊNCIA:
   * 1. Música de fundo
   * 2. Chapéu spawna embaixo e sobe para 1/3 da tela (4s total: 2s subida + 2s parado)
   * 3. Durante pausa, toca "Hmmm... muito bem"
   * 4. Scroll para seção 1
   * 5. Chapéu faz animação para direita da seção 1
   */
  iniciarJornada() {
    if (this.iniciado) return;

    this.iniciado = true;

    console.log('🚀 Iniciando jornada...');

    // 0. DESAPARECE O BOTÃO IMEDIATAMENTE
    const botaoIniciar = document.getElementById('btn-iniciar');
    if (botaoIniciar) {
      gsap.to(botaoIniciar, {
        opacity: 0,
        scale: 0.8,
        duration: 0.5,
        ease: 'power2.in',
        onComplete: () => {
          botaoIniciar.style.display = 'none';
        }
      });
    }

    // 1. Inicia música de fundo
    audioGlobal.trocarMusicaDeFundo('inicio', 0, 2000);

    // 2. Inicializa sistema de scroll
    scrollGlobal.inicializar();

    // 3. Chapéu: animação de entrada (4s total)
    const chapeu = cenaGlobal.obterObjeto('chapeu');
    if (chapeu) {
      estadoGlobal.definirObjetoAtivo('chapeu');

      // TOCA FALA ASSIM QUE SPAWNAR
      audioGlobal.tocarNarracao(); // "Hmmm... muito bem"

      // Inicia animação de entrada (spawna embaixo, sobe, para por 2s)
      chapeu.animacaoEntrada(() => {
        console.log('✅ Chapéu completou entrada');

        // Após os 4s (2s subida + 2s pausa), INICIA SCROLL E ANIMAÇÃO JUNTOS
        scrollGlobal.irParaSecao(1, 1.2);

        // Chapéu faz animação SIMULTANEAMENTE com o scroll
        chapeu.animacaoSecao1(() => {
          console.log('✅ Chapéu posicionado na Seção 1');
        });
      });
    }

    // Define capítulo inicial
    estadoGlobal.definir('capituloAtual', 1);
  }

  /**
   * Reinicia jornada
   */
  reiniciar() {
    console.log('🔄 Reiniciando jornada...');

    // Para tudo
    audioGlobal.pararTudo();
    scrollGlobal.destruir();
    cenaGlobal.esconderTodos();
    flappyBirdGlobal.parar();
    cap7Patronus.reset();
    cap8Final.destruir();
    dialogoGlobal.limpar();

    // Reseta estado
    estadoGlobal.reiniciar();

    // Rola para o topo
    window.scrollTo(0, 0);

    // Recarrega a página para reiniciar completamente
    setTimeout(() => {
      window.location.reload();
    }, 500);
  }

  /**
   * Atualiza estado do jogo para uma seção específica (DEBUG MODE)
   * Desbloqueia capítulos necessários SEM marcar desafios como completos
   * para evitar triggers de diálogos e side effects
   */
  atualizarEstadoParaSecao(secao, idSecao) {
    console.log(`🎯 [DEBUG] Ir Para: #${idSecao}`);

    // 1. Encontra índice da seção no array
    const indiceSecao = scrollGlobal.secoes.indexOf(secao);

    if (indiceSecao === -1) {
      console.error(`❌ Seção #${idSecao} não encontrada no array de seções`);
      return;
    }

    console.log(`📍 Índice da seção: ${indiceSecao}`);

    // 2. Detecta o capítulo alvo
    const dataCapitulo = secao.getAttribute('data-capitulo');
    let capituloAlvo = 0;

    if (dataCapitulo) {
      capituloAlvo = parseInt(dataCapitulo);
    } else if (idSecao.startsWith('cap')) {
      const match = idSecao.match(/cap(\d+)/);
      if (match) {
        capituloAlvo = parseInt(match[1]);
      }
    } else if (idSecao.startsWith('desafio-')) {
      // Mapeia desafios para capítulos
      const mapeamentoDesafios = {
        'desafio-sabedoria': 1,
        'desafio-ordenar-frase': 1,
        'desafio-qualidades': 1,
        'desafio-riddikulus': 1,
        'desafio-sliding-blocks': 3,
        'desafio-obliviate': 4,
        'desafio-memorias-quiz': 4,
        'desafio-memorias-cronologia': 4,
        'desafio-quebra-cabeca': 4,
        'desafio-tom-riddle': 5,
        'desafio-aruossav': 6,
        'desafio-voo': 6,
        'desafio-lumos': 7,
        'desafio-protego': 7,
        'desafio-maze-runner': 7,
      };
      capituloAlvo = mapeamentoDesafios[idSecao] || 0;
    }

    console.log(`📚 Capítulo alvo: ${capituloAlvo}`);

    // 3. Desbloqueia TODOS os capítulos até o alvo
    // Isso permite que o conteúdo do capítulo seja renderizado
    for (let i = 0; i <= capituloAlvo; i++) {
      estadoGlobal.desbloquearProgresso(i);
    }
    console.log(`🔓 Capítulos 0-${capituloAlvo} desbloqueados`);

    // 4. Define capítulo atual
    estadoGlobal.definir('capituloAtual', capituloAlvo);

    // 5. IMPORTANTE: NÃO marca desafios como concluídos
    // Isso evita triggers de diálogos e side effects
    // O usuário pode completar manualmente com o botão "Pular Desafio"

    // 6. Desbloqueia scroll (permite navegação livre)
    estadoGlobal.desbloquearScroll();
    scrollGlobal.bloqueado = false;

    // 7. Atualiza índice atual do scroll manager
    scrollGlobal.indiceAtual = indiceSecao;

    // 8. Troca música para o capítulo correto
    if (capituloAlvo > 0) {
      audioGlobal.trocarMusicaPorCapitulo(capituloAlvo, 500, 1000);
    }

    // 9. Navega visualmente para a seção
    scrollGlobal.irParaSecao(indiceSecao, 1.2);

    console.log(`✅ [DEBUG] Estado atualizado para seção #${idSecao} (índice ${indiceSecao}, cap ${capituloAlvo})`);
  }

  /**
   * Helper: retorna o capítulo de um desafio
   */
  obterCapituloDoDesafio(nomeDesafio) {
    const mapa = {
      'sabedoria': 1, 'ordenar-frase': 1, 'qualidades': 1, 'riddikulus': 1,
      'sliding-blocks': 3,
      'obliviate': 4, 'memorias-quiz': 4, 'memorias-cronologia': 4, 'quebra-cabeca': 4,
      'tom-riddle': 5,
      'aruossav': 6, 'voo': 6,
      'lumos': 7, 'protego': 7, 'maze-runner': 7
    };
    return mapa[nomeDesafio] || 0;
  }

  /**
   * Configura botões de debug (DESENVOLVIMENTO)
   *
   * SISTEMA DE DEBUG:
   *
   * Botão 1 - "Liberar Scroll":
   *   - Libera overflow CSS (permite scroll manual)
   *   - Desbloqueia scroll no StateManager
   *   - Desbloqueia flag no ScrollManager
   *
   * Botão 2 - "Pular Desafio":
   *   - Input: nome do desafio (ex: "lumos", "voo", "protego")
   *   - Marca desafio como concluído (concluirDesafio)
   *   - Desbloqueia scroll
   *   - NOTA: Pode disparar diálogos se o puzzle tiver callback
   *
   * Botão 3 - "Ir Para":
   *   - Input: ID da seção (ex: "cap7-patronus-vfx", "desafio-lumos")
   *   - Detecta capítulo alvo
   *   - Desbloqueia todos os capítulos até o alvo
   *   - Atualiza capituloAtual
   *   - Desbloqueia scroll
   *   - Atualiza índice do ScrollManager
   *   - Troca música
   *   - Navega para seção
   *   - NÃO marca desafios como concluídos (evita side effects)
   *
   * WORKFLOW RECOMENDADO:
   * 1. Use "Ir Para" para navegar até a seção desejada
   * 2. Se necessário, use "Pular Desafio" para completar desafios específicos
   * 3. Use "Liberar Scroll" se precisar scroll manual livre
   */
  configurarBotoesDebug() {
    const btnLiberarScroll = document.getElementById('btn-debug-scroll');
    const btnPularEtapa = document.getElementById('btn-debug-skip');
    const inputDesafio = document.getElementById('input-debug-desafio');
    const btnIrPara = document.getElementById('btn-debug-ir');
    const inputSecao = document.getElementById('input-debug-secao');

    if (!btnLiberarScroll || !btnPularEtapa || !inputDesafio || !btnIrPara || !inputSecao) {
      console.warn('⚠️ Botões/inputs de debug não encontrados');
      return;
    }

    // Ativa modo debug (permite pular seções)
    estadoGlobal.definir('modoDebug', true);
    console.log('🛠️ Modo Debug ATIVADO');

    // Botão 1: Liberar Scroll (libera CSS + desbloqeia no state)
    btnLiberarScroll.addEventListener('click', () => {
      // Libera overflow CSS
      document.documentElement.style.overflow = 'auto';
      document.documentElement.style.scrollbarWidth = '2px';
      document.documentElement.style.msOverflowStyle = 'auto';

      // Desbloqueia no state manager
      estadoGlobal.desbloquearScroll();
      scrollGlobal.bloqueado = false;

      console.log('🔓 Scroll liberado manualmente (CSS + State)');

      // Feedback visual
      btnLiberarScroll.textContent = '✅ Scroll Liberado!';
      setTimeout(() => {
        btnLiberarScroll.textContent = '🔓 Liberar Scroll';
      }, 2000);
    });

    // Botão 2: Pular Desafio (usa valor do input)
    const pularDesafio = () => {
      const nomeDesafio = inputDesafio.value.trim();

      if (!nomeDesafio) {
        btnPularEtapa.textContent = '❌ Digite o nome!';
        setTimeout(() => {
          btnPularEtapa.textContent = '⏭️ Pular';
        }, 2000);
        return;
      }

      console.log(`⏭️ Tentando pular desafio: ${nomeDesafio}`);

      // Completa o desafio e desbloqueia scroll
      estadoGlobal.concluirDesafio(nomeDesafio);
      estadoGlobal.desbloquearScroll();

      // Feedback visual
      btnPularEtapa.textContent = `✅ ${nomeDesafio} pulado!`;
      inputDesafio.value = '';

      setTimeout(() => {
        btnPularEtapa.textContent = '⏭️ Pular';
      }, 2000);
    };

    btnPularEtapa.addEventListener('click', pularDesafio);

    // Permite pressionar Enter no input
    inputDesafio.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        pularDesafio();
      }
    });

    // Botão 3: Ir Para Seção (navega E ATUALIZA ESTADO COMPLETO)
    const irParaSecao = () => {
      const idSecao = inputSecao.value.trim();

      if (!idSecao) {
        btnIrPara.textContent = '❌ Digite o ID!';
        setTimeout(() => {
          btnIrPara.textContent = '📍 Ir Para';
        }, 2000);
        return;
      }

      // Busca a seção pelo ID
      const secao = document.getElementById(idSecao);

      if (!secao) {
        console.warn(`⚠️ Seção #${idSecao} não encontrada`);
        btnIrPara.textContent = `❌ #${idSecao} não existe!`;
        setTimeout(() => {
          btnIrPara.textContent = '📍 Ir Para';
        }, 2500);
        return;
      }
      // *** ATUALIZA O ESTADO COMPLETO (capítulos, desafios, música) ***
      this.atualizarEstadoParaSecao(secao, idSecao);

      // Feedback visual
      btnIrPara.textContent = `✅ Indo para #${idSecao}`;
      inputSecao.value = '';

      setTimeout(() => {
        btnIrPara.textContent = '📍 Ir Para';
      }, 2000);
    };

    btnIrPara.addEventListener('click', irParaSecao);

    // Permite pressionar Enter no input de seção
    inputSecao.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        irParaSecao();
      }
    });

    console.log('🛠️ Botões de debug configurados (3 botões)');
  }
}

// Cria instância da aplicação
const app = new JornadaAurora();

// Aguarda DOM carregar completamente
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    app.inicializar();
  });
} else {
  app.inicializar();
}

// Exporta para console (caso necessário para debug)
window.jornada = app;
window.estado = estadoGlobal;
window.audio = audioGlobal;
window.cena = cenaGlobal;
window.scroll = scrollGlobal;

// Hot Module Replacement (HMR) para desenvolvimento
if (import.meta.hot) {
  import.meta.hot.accept();
}
