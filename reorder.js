const fs = require('fs');

const content = fs.readFileSync('src/App.tsx', 'utf8');

// We need to find the start and end of each section.
// The sections are marked by comments like {/*  SECTION NAME  */}

const sections = [
  "SOBRE / NOSSA ESSÊNCIA",
  "DIFERENCIAIS",
  "TABELA COMPARATIVA",
  "ESPECIALIDADES TECNOLÓGICAS",
  "ÁGUA ALCALINA",
  "ÁGUA OZONIZADA",
  "INSTALAÇÃO PREMIUM"
];

let newContent = content;

// Let's just use regex to extract the sections
function extractSection(name, nextName) {
  const startStr = `{/*  ${name}`;
  const endStr = `{/*  ${nextName}`;
  
  const startIndex = newContent.indexOf(startStr);
  const endIndex = newContent.indexOf(endStr);
  
  if (startIndex === -1 || endIndex === -1) {
      console.log("Could not find", name, "or", nextName);
      return "";
  }
  
  return newContent.substring(startIndex, endIndex);
}

const sobre = extractSection("SOBRE / NOSSA ESSÊNCIA", "DIFERENCIAIS");
const diferenciais = extractSection("DIFERENCIAIS", "TABELA COMPARATIVA");
const tabela = extractSection("TABELA COMPARATIVA", "ESPECIALIDADES TECNOLÓGICAS");
const especialidades = extractSection("ESPECIALIDADES TECNOLÓGICAS", "ÁGUA ALCALINA");
const alcalina = extractSection("ÁGUA ALCALINA", "ÁGUA OZONIZADA");
const ozonizada = extractSection("ÁGUA OZONIZADA", "INSTALAÇÃO PREMIUM");

// Now we replace the whole block from SOBRE to INSTALAÇÃO PREMIUM
const startReplace = newContent.indexOf("{/*  SOBRE / NOSSA ESSÊNCIA");
const endReplace = newContent.indexOf("{/*  INSTALAÇÃO PREMIUM");

const before = newContent.substring(0, startReplace);
const after = newContent.substring(endReplace);

// New order:
// 1. DIFERENCIAIS
// 2. ÁGUA ALCALINA
// 3. ÁGUA OZONIZADA
// 4. TABELA COMPARATIVA
// 5. ESPECIALIDADES TECNOLÓGICAS
// 6. SOBRE

const reordered = diferenciais + alcalina + ozonizada + tabela + especialidades + sobre;

fs.writeFileSync('src/App.tsx', before + reordered + after);
console.log("Reordered successfully!");
