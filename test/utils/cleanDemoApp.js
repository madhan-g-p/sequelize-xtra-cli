const fs = require('fs');
const path = require('path');

function rmrf(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
    return "deleted";
  }
  return "does not exist";
}

function cleanDemoAppDirs(dirNamesArray) {
  const demoAppDir = path.join(__dirname, '../demo-app');
  return dirNamesArray.map((dirName) => {
    return rmrf(path.join(demoAppDir, dirName));
  });
}

module.exports = cleanDemoAppDirs;