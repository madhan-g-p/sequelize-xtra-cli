const fs = require('fs');
const path = require('path');

function rmrf(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

function cleanDemoApp() {
  const demoAppDir = path.join(__dirname, '../demo-app');
  rmrf(path.join(demoAppDir, 'models'));
  rmrf(path.join(demoAppDir, 'migrations'));
  rmrf(path.join(demoAppDir, 'database'));
}

module.exports = cleanDemoApp;