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

    // 7. Configura botão de início
    this.configurarInicio();

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
