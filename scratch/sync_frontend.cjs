const fs = require('fs');
const path = require('path');

const srcDir = 'C:/Users/X/Documents/ERP/src';
const destDir = 'C:/Users/X/Documents/Ashara-ERP/atelier-app/src';

function copyRecursive(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

copyRecursive(srcDir, destDir);
console.log('Successfully mirrored ERP/src -> Ashara-ERP/atelier-app/src');
