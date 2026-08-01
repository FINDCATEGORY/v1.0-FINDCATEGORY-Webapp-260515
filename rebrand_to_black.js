const fs = require('fs');
const path = require('path');

const DIRS = ['app', 'components', 'styles', 'lib'];
const EXTENSIONS = ['.tsx', '.ts', '.js', '.jsx', '.css', '.sql', '.mjs', '.json'];

function replaceInFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;

  // Replacements for Burgundy (#4C050C) and its shades to Modern Editorial Black (#1A1A1A and grayscale)
  content = content.replace(/#4C050C/gi, '#1A1A1A');
  content = content.replace(/#731422/gi, '#2A2A2A');
  content = content.replace(/#8C2434/gi, '#404040');
  content = content.replace(/#A63345/gi, '#555555');
  content = content.replace(/#BF4C5E/gi, '#666666');

  // Also check if any text/bg uses specific burgundy classes
  content = content.replace(/\bbg-burgundy\b/gi, 'bg-[#1A1A1A]');
  content = content.replace(/\btext-burgundy\b/gi, 'text-[#1A1A1A]');
  content = content.replace(/\bborder-burgundy\b/gi, 'border-[#1A1A1A]');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated: ${filePath}`);
  }
}

function traverse(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.next' && file !== '.git' && file !== 'reference') {
        traverse(fullPath);
      }
    } else if (EXTENSIONS.includes(path.extname(fullPath))) {
      replaceInFile(fullPath);
    }
  }
}

DIRS.forEach(dir => traverse(path.join(process.cwd(), dir)));

// Also check root files like sql files or configs in root
const rootFiles = fs.readdirSync(process.cwd());
for (const file of rootFiles) {
  const fullPath = path.join(process.cwd(), file);
  if (!fs.statSync(fullPath).isDirectory() && EXTENSIONS.includes(path.extname(fullPath)) && file !== 'rebrand_to_black.js') {
    replaceInFile(fullPath);
  }
}

console.log("Burgundy to Black rebranding complete across entire site!");
