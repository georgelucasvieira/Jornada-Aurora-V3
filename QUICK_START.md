# ⚡ Quick Start - A Jornada

## 🚀 Para Rodar AGORA

```bash
# Já está tudo instalado!
npm run dev
```

Abra: **http://localhost:5173**

---

## 🎮 Como Funciona

1. **Clique em "Iniciar Jornada"**
2. **Scroll para baixo**
3. **Resolva puzzles para avançar**
4. **Aproveite a narrativa**

---

## 🔧 Debug

**Atalho:** `Ctrl + D` (ou `Cmd + D` no Mac)

Painel de debug permite:
- ✅ Pular capítulos
- ✅ Pular puzzles
- ✅ Controlar áudio
- ✅ Ver estado atual

---

## 📝 Personalizar RÁPIDO

### 1. Código do Cartão

**Arquivo:** `src/ui/puzzles.js` → linha 26

```javascript
const codigoCorrecto = 'AURORA'; // ← TROCAR AQUI
```

### 2. Assinatura Final

**Arquivo:** `index.html` → linha 308

```html
<strong>[Seu nome]</strong>  <!-- ← TROCAR AQUI -->
```

### 3. Cartas de Memória

**Arquivo:** `src/ui/puzzles.js` → linhas 112-127

Substituir por momentos reais do relacionamento.

---

## ⚠️ IMPORTANTE

### Antes de Mostrar para Aurora:

1. **Desativar Debug:**
   - Arquivo: `src/main.js` → linha 40
   - Comentar: `// debugGlobal.ativarModoDebug();`

2. **Testar Tudo:**
   - Passar por toda a jornada
   - Resolver todos os puzzles
   - Verificar se não há erros

3. **Preparar Ambiente:**
   - Fullscreen (F11)
   - Volume ajustado
   - Sem distrações

---

## 🎵 Áudios (Opcional)

Por enquanto, áudios são **mocks** (não vão tocar).

Para adicionar áudios reais:
1. Colocar MP3s em `public/audio/`
2. Nomes: `chapeu-mock.mp3`, `sfx-mock.mp3`, `musica-mock.mp3`

**Ou desabilitar áudio:**
- Comentar chamadas `audioGlobal.tocar*()` em `src/main.js`

---

## 🎨 Objetos 3D

Atualmente usando **mocks** (geometrias simples):
- Chapéu = Cone marrom
- Fênix = Cone laranja brilhante

Funcionam perfeitamente! Para modelos reais, ver `PERSONALIZACAO.md`.

---

## 📦 Build para Produção

```bash
npm run build

# Resultado em: dist/
# Fazer upload para Vercel, Netlify, etc.
```

---

## 🆘 Problemas?

1. **Abrir console** (F12)
2. **Ver erros**
3. **Consultar `TROUBLESHOOTING.md`**

### Comandos Úteis:

```javascript
// No console do navegador:
window.estado.obterEstado()      // Ver estado
window.debug.mostrar()           // Abrir debug
window.scroll.refresh()          // Atualizar scroll
```

---

## 📚 Documentação Completa

- **README.md** → Visão geral e estrutura
- **PERSONALIZACAO.md** → Como personalizar tudo
- **TROUBLESHOOTING.md** → Resolver problemas

---

## ✨ Pronto!

A jornada está **100% funcional** e pronta para ser usada.

Personalize o que quiser, ou use assim mesmo. O importante é a intenção. 💙

**Boa sorte!**
