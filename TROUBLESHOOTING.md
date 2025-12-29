# 🔧 Solução de Problemas - A Jornada

## 🚨 Problemas Comuns

### 1. Áudio não Toca

**Problema:** Nenhum áudio é reproduzido.

**Causa:** Arquivos de áudio mock não existem.

**Solução:**
1. Criar arquivos MP3 silenciosos temporários:
   ```bash
   # Em public/audio/
   touch chapeu-mock.mp3
   touch sfx-mock.mp3
   touch musica-mock.mp3
   ```

2. Ou desabilitar áudio temporariamente:
   ```javascript
   // Em src/core/audioManager.js
   tocarNarracao(callback) {
     if (callback) callback(); // Pula áudio
   }
   ```

---

### 2. Objetos 3D Não Aparecem

**Problema:** Chapéu e Fênix não são visíveis.

**Verificação:**
1. Abrir console do navegador (F12)
2. Verificar erros do Three.js

**Soluções:**
- Verificar se `cenaGlobal.inicializar()` está sendo chamado
- Confirmar que objetos foram adicionados: `window.cena.obterObjeto('chapeu')`
- Ajustar posição da câmera em `src/core/sceneManager.js`

---

### 3. Scroll Não Funciona

**Problema:** Página não rola ou trava.

**Causas Possíveis:**
1. Desafio não foi concluído
2. ScrollTrigger não inicializou

**Soluções:**
1. Abrir painel debug (Ctrl+D) e pular desafio
2. No console: `window.scroll.refresh()`
3. Verificar se `scrollGlobal.inicializar()` foi chamado

---

### 4. Puzzle Não Aceita Resposta Correta

**Problema:** Código/resposta correta não passa.

**Para Puzzle de Código:**
```javascript
// src/ui/puzzles.js
// Verificar se código está MAIÚSCULO
const codigoCorrecto = 'AURORA'; // Tem que ser exato

// Teste no console:
window.puzzles
```

**Para Memória Afetiva:**
```javascript
// Verificar se as 3 cartas corretas estão no array cartasCorretas
// E se os textos são EXATAMENTE iguais (case-sensitive)
```

---

### 5. Flappy Bird Muito Difícil/Fácil

**Ajustar:**
```javascript
// src/ui/minigames.js (linha ~17)
this.scoreMinimoParaPassar = 8; // Alterar valor

// Também ajustar gravidade e força do pulo:
this.vassoura.gravidade = 0.5;    // Menor = mais fácil
this.vassoura.forcaPulo = -8;     // Mais negativo = pula mais alto
```

---

### 6. CSS Não Carrega / Aparência Quebrada

**Problema:** Estilos não aplicados.

**Solução:**
1. Verificar se `style.css` está sendo importado no `main.js`:
   ```javascript
   import './style.css';
   ```

2. Limpar cache do navegador:
   - Chrome/Edge: Ctrl+Shift+Delete
   - Firefox: Ctrl+Shift+Delete

3. Hard reload:
   - Ctrl+Shift+R (Windows/Linux)
   - Cmd+Shift+R (Mac)

---

### 7. Debug Panel Não Abre

**Problema:** Painel debug não aparece ao pressionar Ctrl+D.

**Soluções:**
1. Verificar se está habilitado em `main.js`:
   ```javascript
   debugGlobal.ativarModoDebug(); // Descomentar
   ```

2. Tentar abrir manualmente no console:
   ```javascript
   window.debug.mostrar();
   ```

---

### 8. Performance Ruim / Travando

**Problema:** Aplicação lenta ou travando.

**Soluções:**
1. Verificar console por erros
2. Desabilitar objetos 3D temporariamente:
   ```javascript
   // Em main.js, comentar:
   // this.criarObjetos3D();
   ```

3. Reduzir qualidade do renderer:
   ```javascript
   // Em src/core/sceneManager.js
   this.renderer.setPixelRatio(1); // Em vez de devicePixelRatio
   ```

---

### 9. Botão "Iniciar Jornada" Não Funciona

**Problema:** Clicar no botão não faz nada.

**Verificações:**
1. Abrir console e procurar erros
2. Verificar se evento está registrado:
   ```javascript
   window.jornada.configurarInicio(); // Chamar manualmente
   ```

3. Rolar manualmente:
   ```javascript
   window.scroll.rolarPara('#cap1');
   ```

---

### 10. Erros de Importação

**Problema:** `Cannot find module` ou `Failed to resolve import`.

**Causas:**
- Caminho de import errado
- Arquivo não existe

**Solução:**
1. Verificar estrutura de pastas
2. Verificar caminhos relativos
3. Reinstalar dependências:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

---

## 🛠️ Comandos Úteis de Debug

### No Console do Navegador:

```javascript
// Ver estado atual
window.estado.obterEstado()

// Pular para capítulo
window.estado.pularParaCapitulo(5)

// Concluir desafio
window.estado.concluirDesafio('codigo')

// Testar áudio
window.audio.tocarSFX('progresso')

// Testar diálogo
window.dialogo.exibir('Teste de diálogo')

// Mostrar chapéu
window.cena.mostrarObjeto('chapeu')

// Refresh scroll
window.scroll.refresh()

// Ver puzzles
window.puzzles

// Exportar estado
JSON.stringify(window.estado.obterEstado(), null, 2)
```

---

## 📱 Problemas Mobile

### Scroll Não Funciona no Mobile

**Causa:** ScrollTrigger pode ter problemas em alguns mobile browsers.

**Solução:**
```javascript
// Adicionar em src/core/scrollManager.js
ScrollTrigger.config({
  autoRefreshEvents: "visibilitychange,DOMContentLoaded,load"
});
```

### Touch Não Funciona no Flappy Bird

**Verificar:**
```javascript
// Em src/ui/minigames.js
// Confirmar que eventos touch estão registrados:
this.canvas.addEventListener('touchstart', (e) => {
  if (this.jogando) {
    e.preventDefault();
    this.pular();
  }
});
```

---

## 🔍 Verificação Pré-Entrega

Checklist antes de mostrar para Aurora:

- [ ] Todos os áudios estão carregando
- [ ] Objetos 3D aparecem
- [ ] Todos os puzzles funcionam
- [ ] Código do cartão está correto
- [ ] Cartas de memória personalizadas
- [ ] Assinatura final alterada
- [ ] Modo debug DESATIVADO (produção)
- [ ] Testado em mobile
- [ ] Testado em fullscreen
- [ ] Volume ajustado
- [ ] Sem erros no console

### Teste Rápido:

```bash
# Rodar o projeto
npm run dev

# Abrir em: http://localhost:5173

# Testar fluxo completo:
# 1. Clicar "Iniciar Jornada"
# 2. Scrollar até primeiro puzzle
# 3. Resolver puzzle
# 4. Continuar até o fim
```

---

## 🆘 Precisa de Ajuda?

Se nada funcionar:

1. **Verificar console do navegador** (F12)
2. **Copiar mensagem de erro**
3. **Verificar estrutura de arquivos**
4. **Reinstalar dependências**
5. **Criar issue no GitHub** (se aplicável)

---

## 🔄 Reset Completo

Se tudo der errado:

```bash
# Parar servidor
# Ctrl+C no terminal

# Limpar tudo
rm -rf node_modules package-lock.json

# Reinstalar
npm install

# Rodar novamente
npm run dev
```

---

## 💾 Backup

Sempre faça backup antes de mudanças grandes:

```bash
# Copiar projeto inteiro
cp -r Jornada-Aurora-V3 Jornada-Aurora-V3-backup

# Ou usar Git
git add .
git commit -m "Backup antes de mudanças"
```

---

**Lembre-se:** A perfeição técnica importa menos que a intenção. Se algo não funcionar 100%, o amor por trás da jornada é o que realmente conta. 💙
