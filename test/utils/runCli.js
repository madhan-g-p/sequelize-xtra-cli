/**
  * Runs the CLI as a child process, returns a Promise with { stdout, stderr, status }.
  * @param {string[]} args - CLI arguments
  * @param {object} opts - Options, e.g. { env }
  * @returns {Promise<{stdout: string, stderr: string, status: number}>}
 */

const { spawn } = require('child_process');
const path = require('path');

function runCli(args = [], opts = {}) {
  const cliPath = path.join(__dirname, '../../index.js');
  const demoAppDir = path.join(__dirname, '../demo-app');

  return new Promise((resolve, reject) => {
    const child = spawn('node', [cliPath, ...args], {
      cwd: demoAppDir,
      env: { ...process.env, XCLI_TEST: '1', ...opts.env },
      encoding: 'utf-8'
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', data => (stdout += data.toString()));
    child.stderr.on('data', data => (stderr += data.toString()));

    child.on('error', reject);

    child.on('close', status => {
      resolve({ stdout, stderr, status });
    });
  });
}

module.exports = runCli;
