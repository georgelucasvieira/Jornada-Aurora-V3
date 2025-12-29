# 🎮 A Jornada - Aurora

Uma experiência narrativa interativa inspirada em **The Boat**, combinando storytelling baseado em scroll, puzzles, minigames e elementos 3D, com tema de Harry Potter e toques de catolicismo.

## 📋 Visão Geral

Este projeto é uma jornada narrativa para Aurora, combinando:
- ✨ **Storytelling baseado em scroll** (GSAP ScrollTrigger)
- 🎯 **Puzzles interativos** (memória, quiz, drag-and-drop)
- 🎮 **Minigame Flappy Bird** narrativo
- 🎨 **Objetos 3D como guias visuais** (Chapéu Seletor e Fênix)
- 🎵 **Sistema de áudio imersivo** (narração, SFX, música)
- 🔧 **Painel de debug completo**

## 🚀 Como Rodar

### Instalação

```bash
# Já instalado! As dependências já foram instaladas

# Para rodar o projeto:
npm run dev
```

O projeto será aberto em `http://localhost:5173`

### Build para Produção

```bash
npm run build
npm run preview
```

## 📁 Estrutura do Projeto

```
Jornada-Aurora-V3/
├── index.html              # HTML principal com todas as sections
├── src/
│   ├── main.js            # Entry point - integra todos os sistemas
│   ├── style.css          # Estilos globais (design elegante e misterioso)
│   ├── core/              # Sistemas core
│   │   ├── stateManager.js      # Gerenciador de estado central
│   │   ├── audioManager.js      # Sistema de áudio (Howler.js)
│   │   ├── dialogueManager.js   # Sistema de diálogos
│   │   ├── debugManager.js      # Painel de debug
│   │   ├── sceneManager.js      # Gerenciador Three.js
│   │   └── scrollManager.js     # Sistema de scroll (GSAP)
│   ├── three/             # Objetos 3D
│   │   └── objects/
│   │       ├── mockObject.js    # Classe base para objetos mock
│   │       ├── chapeu.js        # Chapéu Seletor (cone marrom)
│   │       └── fenix.js         # Fênix (cone laranja emissivo)
│   ├── ui/                # Interface e puzzles
│   │   ├── puzzles.js           # Todos os puzzles
│   │   └── minigames.js         # Flappy Bird narrativo
│   └── assets/            # Assets
│       ├── audio/               # Áudios (mocks)
│       └── textures/            # Texturas
└── public/                # Arquivos públicos
    └── audio/                   # Arquivos de áudio mock
```

## 🎯 Sistemas Implementados

### 1. State Manager
- Gerencia todo o estado da aplicação
- Controla progresso, desafios concluídos, respostas
- Sistema de observers para mudanças de estado

### 2. Audio Manager
- Narração do Chapéu Seletor
- Efeitos sonoros (SFX)
- Música de fundo com crossfade
- Controle de volume independente
- **Nota:** Atualmente usa arquivos mock

### 3. Dialogue Manager
- Exibe diálogos narrativos
- Sincroniza texto + áudio
- Sistema de escolhas
- Mensagens rápidas (toasts)

### 4. Scene Manager (Three.js)
- Cena 3D minimalista
- Iluminação configurada
- Gerenciamento de objetos 3D
- Loop de animação

### 5. Scroll Manager (GSAP ScrollTrigger)
- Scroll controlado por estado
- Trava scroll em desafios
- Animações baseadas em scroll
- Controle de objetos 3D via scroll

### 6. Puzzles
1. **Código do Cartão** - Input de texto
2. **Escolha** - Decisão binária
3. **Memória Afetiva** - Memorização e seleção de cartas
4. **Ortografia (Quiz HP)** - "Expecto Patronum"
5. **Pseudo-desafio Final** - Tentativas que falham (conceito de impotência)

### 7. Minigame - Flappy Bird
- Mecânica simples (gravidade + pulo)
- Score mínimo interno (não mostrado ao usuário)
- Feedback narrativo
- **Nota:** Implementado e funcional

### 8. Debug Manager
- Painel lateral completo
- Navegação entre capítulos
- Pular puzzles
- Controle de áudio
- Exportar estado
- Atalho: **Ctrl/Cmd + D**

## 🎨 Objetos 3D (Mocks)

### Chapéu Seletor
- **Mock:** Cone marrom invertido
- **Animações:**
  - Idle (balança suavemente)
  - Entra/sai da tela
  - Move em trajetória S
  - "Fala" (pulsa)

### Fênix
- **Mock:** Cone laranja com emissão
- **Animações:**
  - Idle (batida de asas)
  - Surge de baixo
  - Desaparece para cima
  - Voa em círculo
  - Pulsação de "fogo"

## 📝 Capítulos Implementados

1. **Start** - Botão "Iniciar Jornada"
2. **Capítulo 1** - A Convocação → Puzzle: Código
3. **Capítulo 2** - O Chapéu Observa → Puzzle: Escolha
4. **Capítulo 3** - A Ordem Imperfeita → Puzzle: Memória Afetiva
5. **Capítulo 4** - A Passagem → Fênix aparece
6. **Capítulo 4b** - Puzzle: Ortografia (Expecto Patronum)
7. **Capítulo 5** - O Voo → Minigame: Flappy Bird
8. **Capítulo 6** - A Sombra → Puzzle: O Limite
9. **Capítulo 7** - O Limiar
10. **Capítulo Final** - A Revelação (4 sub-seções)
11. **Epílogo** - Mensagem final para Aurora

## ⚙️ Configurações e Personalizações

### Alterar Código do Cartão

Em `src/ui/puzzles.js`, linha ~26:

```javascript
const codigoCorrecto = 'AURORA'; // Alterar para código do cartão físico
```

### Alterar Cartas de Memória

Em `src/ui/puzzles.js`, linha ~112:

```javascript
const todasCartas = [
  'Primeiro filme juntos',
  // ... adicionar momentos reais do relacionamento
];

const cartasCorretas = [
  // ... cartas que "permaneceram"
];
```

### Alterar Score Mínimo do Flappy Bird

Em `src/ui/minigames.js`, linha ~17:

```javascript
this.scoreMinimoParaPassar = 8; // Ajustar dificuldade
```

### Desativar Modo Debug em Produção

Em `src/main.js`, linha ~40, comentar:

```javascript
// debugGlobal.ativarModoDebug(); // Comentar esta linha
```

## 🎵 Adicionar Áudios Reais

1. Colocar arquivos MP3 em `public/audio/`:
   - `chapeu-mock.mp3` → Narração do Chapéu
   - `sfx-mock.mp3` → Efeitos sonoros
   - `musica-mock.mp3` → Música de fundo

2. Para áudios específicos, editar `src/core/audioManager.js`

## 🔧 Debug e Testes

### Atalhos de Teclado
- **Ctrl/Cmd + D** - Abre/fecha painel debug

### Painel Debug Permite:
- ✅ Avançar/voltar capítulos
- ✅ Pular para capítulo específico
- ✅ Pular puzzles
- ✅ Controlar áudio
- ✅ Reiniciar jogo
- ✅ Exportar estado (JSON)

### Console Global
No console do navegador, você tem acesso a:

```javascript
window.jornada  // Instância principal
window.estado   // State Manager
window.audio    // Audio Manager
window.dialogo  // Dialogue Manager
window.debug    // Debug Manager
window.cena     // Scene Manager
window.scroll   // Scroll Manager
window.puzzles  // Puzzle Manager
```

## 📱 Responsivo

O projeto é totalmente responsivo:
- Mobile: 320px+
- Tablet: 768px+
- Desktop: 1024px+

## 🎨 Design

### Paleta de Cores
- Fundo: `#0a0a0f` (quase preto)
- Texto: `#e8e8f0` (branco suave)
- Destaque: `#646cff` (azul violeta)
- Erro: `#ff6b6b`
- Sucesso: `#51cf66`

### Fontes
- Principal: Georgia (narrativa)
- Secundária: System UI (botões, UI)

### Animações
- Fade rápido: 0.2s
- Fade médio: 0.4s
- Fade lento: 0.8s

## 🚧 Próximos Passos

### Essencial
- [ ] Adicionar áudios reais (narração + SFX + música)
- [ ] Substituir objetos 3D mocks por modelos reais (.glb)
- [ ] Personalizar cartas de memória com momentos reais
- [ ] Definir código do cartão físico
- [ ] Trocar "[Seu nome]" no epílogo

### Melhorias Opcionais
- [ ] Adicionar mais puzzles entre capítulos
- [ ] Implementar sistema de save (localStorage)
- [ ] Adicionar mais interações com objetos 3D
- [ ] Criar cartões físicos impressos
- [ ] Adicionar partículas de magia
- [ ] Implementar sistema de achievements

### Produção
- [ ] Desativar modo debug
- [ ] Otimizar assets
- [ ] Testar em diferentes navegadores
- [ ] Deploy (Vercel, Netlify, etc.)

## 🎁 Para Aurora

Esta jornada foi criada com muito carinho. Cada puzzle, cada palavra, cada animação foi pensada para criar uma experiência única e memorável.

Lembre-se: não é sobre acertar tudo. É sobre **permanecer**.

---

**Desenvolvido com ❤️ para Aurora**

*"O que nos define é Quem caminha conosco quando cessam as respostas."*
