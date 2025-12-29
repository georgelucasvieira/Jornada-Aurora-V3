# 📝 Guia de Personalização - A Jornada

Este guia mostra como personalizar a experiência para Aurora.

## 🎯 Personalizações Essenciais

### 1. Código do Cartão Físico

**Arquivo:** `src/ui/puzzles.js` (linha ~26)

```javascript
// Alterar 'AURORA' para o código que estará no cartão físico
const codigoCorrecto = 'AURORA';
```

**Sugestões de códigos:**
- Data importante (ex: `14022020`)
- Palavra especial (ex: `ESPERANCA`)
- Código secreto entre vocês

---

### 2. Cartas de Memória Afetiva

**Arquivo:** `src/ui/puzzles.js` (linha ~112)

Personalizar com momentos reais do relacionamento:

```javascript
const todasCartas = [
  'Primeiro filme juntos',      // → Trocar por momento real
  'Uma briga boba',             // → Trocar por momento real
  'Uma oração compartilhada',   // → Trocar por momento real
  'Uma promessa',               // → Trocar por momento real
  'Uma viagem',                 // → Trocar por momento real
  'Um silêncio importante',     // → Trocar por momento real
  'Um presente especial',       // → Trocar por momento real
  'Uma música marcante'         // → Trocar por momento real
];

// As 3 cartas que ela deve selecionar (as que "permaneceram")
const cartasCorretas = [
  'Uma oração compartilhada',   // → Trocar
  'Uma promessa',               // → Trocar
  'Um silêncio importante'      // → Trocar
];
```

**Ideias de momentos:**
- Primeiro encontro
- Primeira vez que disse "eu te amo"
- Uma viagem marcante
- Um momento difícil superado juntos
- Uma promessa importante
- Um lugar especial
- Uma música/filme marcante
- Uma oração/momento espiritual compartilhado

---

### 3. Assinatura Final

**Arquivo:** `index.html` (linha ~308)

```html
<p class="assinatura">
  Com todo o amor,<br>
  <strong>[Seu nome]</strong>  <!-- TROCAR AQUI -->
</p>
```

---

### 4. Dificuldade do Flappy Bird

**Arquivo:** `src/ui/minigames.js` (linha ~17)

```javascript
// Score mínimo para passar (não é mostrado para o usuário)
this.scoreMinimoParaPassar = 8; // Quanto menor, mais fácil
```

**Sugestões:**
- `5` → Muito fácil
- `8` → Médio (recomendado)
- `12` → Difícil

---

### 5. Tempo de Memorização das Cartas

**Arquivo:** `src/ui/puzzles.js` (linha ~127)

```javascript
const TEMPO_MEMORIZAR = 5000; // 5 segundos
```

Alterar para mais ou menos tempo (em milissegundos).

---

## 🎵 Adicionar Áudios Reais

### Estrutura de Áudio

Coloque os arquivos MP3 em `public/audio/`:

```
public/audio/
├── chapeu-mock.mp3     → Narração do Chapéu Seletor
├── sfx-mock.mp3        → Efeitos sonoros
└── musica-mock.mp3     → Música de fundo
```

### Opções de Áudio:

#### 1. Narração
- Gravar sua própria voz lendo as falas do Chapéu
- Usar TTS (Text-to-Speech) com voz agradável
- Usar música instrumental suave como placeholder

#### 2. Efeitos Sonoros
Sites gratuitos:
- [Freesound.org](https://freesound.org/)
- [Zapsplat.com](https://www.zapsplat.com/)

Sugestões de SFX:
- Coruja: som de coruja
- Clique: som suave de clique
- Progresso: sino/campaninha
- Erro: som suave de "ops"
- Voo: whoosh/vento
- Fênix: fogo crepitando

#### 3. Música de Fundo
Sugestões (royalty-free):
- [Incompetech](https://incompetech.com/)
- [Purple Planet Music](https://www.purple-planet.com/)
- Trilha sonora de Harry Potter (uso pessoal)

---

## 🎨 Modelos 3D Reais

### Como Substituir Mocks

1. **Encontrar modelos:**
   - [Sketchfab](https://sketchfab.com/) → Buscar "sorting hat" / "phoenix"
   - [TurboSquid](https://www.turbosquid.com/)
   - [Free3D](https://free3d.com/)

2. **Formato:** Converter para `.glb` ou `.gltf`

3. **Carregar no código:**

**Arquivo:** `src/three/objects/chapeu.js`

```javascript
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// Substituir criarMesh() por:
async carregarModelo() {
  const loader = new GLTFLoader();
  const gltf = await loader.loadAsync('/models/chapeu.glb');
  this.mesh = gltf.scene;
}
```

---

## 🎭 Personalizar Textos Narrativos

Todos os textos estão em `index.html`. Você pode:

1. **Adicionar mais seções:**
   - Copiar uma `<section>` existente
   - Trocar o ID
   - Adicionar texto personalizado

2. **Modificar textos existentes:**
   - Procurar a section no `index.html`
   - Editar o conteúdo dentro de `<div class="texto-narrativo">`

**Exemplo:**

```html
<section id="cap-extra" class="section" data-capitulo="9">
  <div class="section-content">
    <div class="texto-narrativo">
      <p>Seu texto aqui...</p>
      <p>Outro parágrafo...</p>
    </div>
  </div>
</section>
```

---

## 🃏 Cartões Físicos

### Sugestões de Cartões para Imprimir:

#### Cartão 1 - Código Inicial
```
┌─────────────────────────┐
│  A JORNADA              │
│                         │
│  "Algumas portas        │
│   só se abrem           │
│   fora daqui."          │
│                         │
│  Código: AURORA         │ ← Seu código
│                         │
└─────────────────────────┘
```

#### Cartão 2 - Enigma (Opcional)
```
┌─────────────────────────┐
│  Nem tudo o que         │
│  parece perdido         │
│  está esquecido.        │
│                         │
│  Observe com atenção.   │
└─────────────────────────┘
```

#### Cartão 3 - Final (Entregar apenas no fim)
```
┌─────────────────────────┐
│  PARA AURORA            │
│                         │
│  Você nunca caminhou    │
│  sozinha.               │
│                         │
│  E nunca caminhará.     │
│                         │
│  Com amor,              │
│  [Seu nome]             │
└─────────────────────────┘
```

**Como entregar:**
1. Cartão 1: Dar no início
2. Cartão 2: Esconder em algum lugar (opcional)
3. Cartão 3: Dar apenas quando ela terminar a jornada

---

## 🔧 Ajustes de Dificuldade

### Tornar Mais Fácil
- Aumentar tempo de memorização das cartas
- Diminuir score do Flappy Bird
- Dar dicas nos puzzles

### Tornar Mais Difícil
- Diminuir tempo de memorização
- Aumentar score do Flappy Bird
- Adicionar mais puzzles

---

## 🎬 Sequência Sugerida

1. **Antes de começar:**
   - Deixar o site aberto em fullscreen
   - Ajustar volume
   - Entregar Cartão 1

2. **Durante a jornada:**
   - Deixar ela explorar sozinha
   - Não dar dicas (a não ser que peça)

3. **Ao terminar:**
   - Entregar Cartão 3
   - Conversar sobre a experiência

---

## 💡 Dicas Finais

1. **Teste tudo antes!** Rode a jornada você mesmo pelo menos uma vez
2. **Prepare os áudios** com antecedência
3. **Imprima os cartões** em papel bom
4. **Configure ambiente:** iluminação baixa, sem distrações
5. **Tenha tecido** por perto (ela provavelmente vai chorar)

---

**Boa sorte! 💙**

Esta jornada é só o começo. O mais importante é a jornada que vocês constroem juntos, todos os dias.
