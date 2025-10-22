const fs = require('fs');
const path = require('path');

const src = path.join(__dirname);
const dest = path.join(__dirname, 'dist');

function copyRecursive(srcDir, destDir) {
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    // skip node_modules and .git and dist itself
    if (['node_modules', '.git', 'dist'].includes(entry.name)) continue;

    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else if (entry.isFile()) {
      const data = fs.readFileSync(srcPath);
      fs.writeFileSync(destPath, data);
    }
  }
}

// Clean dest
if (fs.existsSync(dest)) {
  fs.rmSync(dest, { recursive: true, force: true });
}

copyRecursive(src, dest);
console.log('Build complete: dist/ created');
