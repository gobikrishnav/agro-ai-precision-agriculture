const fs = require('fs');
const path = require('path');

const rootNext = path.join(__dirname, '..', '.next');
const subfolderNext = path.join(__dirname, '..', 'agro-ai-web', '.next');

try {
  if (fs.existsSync(rootNext)) {
    fs.mkdirSync(path.dirname(subfolderNext), { recursive: true });
    fs.cpSync(rootNext, subfolderNext, { recursive: true });
    console.log('✓ Build output successfully mirrored to agro-ai-web/.next');
  }
} catch (err) {
  console.warn('Notice: Build output mirror skipped:', err.message);
}
