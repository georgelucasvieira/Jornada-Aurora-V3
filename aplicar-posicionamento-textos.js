/**
 * Script para aplicar posicionamento aos textos
 * Execute este script UMA VEZ para adicionar as classes
 */

const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// Padrão de posicionamento sugerido
const padroes = ['texto-esquerda', 'texto-direita', 'texto-centro'];
let contador = 0;

// Lista de IDs das sections que devem ter posicionamento
const sectionsParaPosicionar = [
  'cap1', 'cap1-2', 'cap1-3',
  'cap2', 'cap2-2', 'cap2-3',
  'cap3',
  'cap4', 'cap4-2',
  'cap5',
  'cap6', 'cap6-2',
  'cap7',
  'cap-final', 'cap-final-2', 'cap-final-3', 'cap-final-4', 'cap-final-5',
  'epilogo'
];

sectionsParaPosicionar.forEach(id => {
  const regex = new RegExp(`(<section id="${id}"[^>]*>\\s*<div class="section-content)(">)`, 'i');

  const posicionamento = padroes[contador % padroes.length];

  html = html.replace(regex, `$1 ${posicionamento}$2`);

  console.log(`✅ ${id} → ${posicionamento}`);

  contador++;
});

fs.writeFileSync(htmlPath, html, 'utf8');

console.log('\n✨ Posicionamento aplicado com sucesso!');
console.log(`📍 Total de sections modificadas: ${contador}`);
console.log('\n📝 Padrão aplicado (cíclico):');
console.log('  1. texto-esquerda');
console.log('  2. texto-direita');
console.log('  3. texto-centro');
