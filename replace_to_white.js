const fs = require('fs');
const path = require('path');

const DIRS = ['app', 'components'];
const EXTENSIONS = ['.tsx', '.ts', '.js', '.jsx', '.css', '.sql'];

const REGEX_EBEBDF = /#EBEBDF/gi;
const REGEX_F2F2ED = /#F2F2ED/gi;
const REGEX_F7F7F4 = /#F7F7F4/gi;

function replaceInFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;

  content = content.replace(REGEX_EBEBDF, '#FFFFFF');
  content = content.replace(REGEX_F2F2ED, '#FFFFFF');
  content = content.replace(REGEX_F7F7F4, '#FFFFFF');

  // Simplify Tailwind arbitrary white hex to standard white utilities where applicable
  content = content.replace(/bg-\[#FFFFFF\]\/(\d+|\[.*?\])/g, 'bg-white/$1');
  content = content.replace(/text-\[#FFFFFF\]\/(\d+|\[.*?\])/g, 'text-white/$1');
  content = content.replace(/border-\[#FFFFFF\]\/(\d+|\[.*?\])/g, 'border-white/$1');
  content = content.replace(/bg-\[#FFFFFF\]/g, 'bg-white');
  content = content.replace(/text-\[#FFFFFF\]/g, 'text-white');
  content = content.replace(/border-\[#FFFFFF\]/g, 'border-white');

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
      traverse(fullPath);
    } else if (EXTENSIONS.includes(path.extname(fullPath))) {
      replaceInFile(fullPath);
    }
  }
}

DIRS.forEach(dir => traverse(path.join(process.cwd(), dir)));
replaceInFile(path.join(process.cwd(), 'app/globals.css'));
replaceInFile(path.join(process.cwd(), 'replace_colors.js'));
console.log("Color replacement to white (#FFFFFF) complete.");
