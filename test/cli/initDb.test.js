const fs = require('fs');
const path = require('path');
const runCli = require('../utils/runCli');
const cleanDemoApp = require('../utils/cleanDemoApp');

const demoAppDir = path.join(__dirname, '../demo-app');
const dbConfigPath = path.join(demoAppDir, 'database/config.js');

beforeAll(() => {
  cleanDemoApp();
  if (!fs.existsSync(demoAppDir)) fs.mkdirSync(demoAppDir, { recursive: true });
});

describe('CLI: init:db', () => {
  test('creates db config with default envs', () => {
    const result = runCli(['init:db']);
    expect(result.stdout).toMatch(/Database Configuration file Created/);
    expect(fs.existsSync(dbConfigPath)).toBe(true);
  });

  test('respects --envs option', () => {
    runCli(['init:db', '--envs', 'test,qa']);
    const content = fs.readFileSync(dbConfigPath, 'utf8');
    expect(content).toMatch(/test:/);
    expect(content).toMatch(/qa:/);
  });

  test('prevents overwrite without --force', () => {
    runCli(['init:db']);
    const result = runCli(['init:db']);
    expect(result.stdout).toMatch(/already exists/);
  });

  test('overwrites with --force', () => {
    runCli(['init:db']);
    const result = runCli(['init:db', '--force']);
    expect(result.stdout).toMatch(/forcefully recreating/);
  });
});