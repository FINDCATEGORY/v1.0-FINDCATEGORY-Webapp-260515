const fs = require('fs');
const path = require('path');

const DIRS = ['app', 'components'];
const EXTENSIONS = ['.tsx', '.ts', '.js', '.jsx'];

const BG_BLACK_REGEX = /\bbg-black\b/g;
const BG_BLACK_OPACITY_REGEX = /\bbg-black\/(\d+|\[.*?\])/g;
const TEXT_WHITE_REGEX = /\btext-white\b/g;
const TEXT_WHITE_OPACITY_REGEX = /\btext-white\/(\d+|\[.*?\])/g;

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;

  // Replacements
  content = content.replace(BG_BLACK_REGEX, 'bg-white');
  content = content.replace(BG_BLACK_OPACITY_REGEX, 'bg-white/$1');
  content = content.replace(TEXT_WHITE_REGEX, 'text-[#1A1A1A]');
  content = content.replace(TEXT_WHITE_OPACITY_REGEX, 'text-[#1A1A1A]/$1');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated: ${filePath}`);
  }
}

function traverse(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverse(fullPath);
    } else if (EXTENSIONS.includes(path.extname(fullPath))) {
      replaceInFile(fullPath);
    }
  }
}

DIRS.forEach(dir => traverse(path.join(process.cwd(), dir)));
console.log("Color replacement complete.");
