const { spawnSync } = require('child_process');
const path = require('path');

function runCli(args = [], opts = {}) {
  const cliPath = path.join(__dirname, '../../index.js');
  const demoAppDir = path.join(__dirname, '../demo-app');
  const result = spawnSync('node', [cliPath, ...args], {
    cwd: demoAppDir,
    env: { ...process.env, XCLI_TEST: '1', ...opts.env },
    encoding: 'utf-8'
  });
  return result;
}

module.exports = runCli;