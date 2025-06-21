const fs = require('fs');
const path = require('path');
const runCli = require('../utils/runCli');
const cleanDemoAppDirs = require('../utils/cleanDemoApp');

const demoAppDir = path.join(__dirname, '../demo-app');
const dbConfigPath = path.join(demoAppDir, 'database/config.js');

beforeAll(() => {
  cleanDemoAppDirs(["database"]);
  if (!fs.existsSync(demoAppDir)) fs.mkdirSync(demoAppDir, { recursive: true });
});

describe('CLI: init:db', () => {
  test('creates db config with default envs', async() => {
    const result = await runCli(['init:db']);
    expect(result.stdout).toMatch(/Database Configuration file Created/);
    expect(fs.existsSync(dbConfigPath)).toBe(true);
  });

  test('respects --envs option', async () => {
    await runCli(['init:db', '--envs', 'test,qa']);
    const content = fs.readFileSync(dbConfigPath, 'utf8');
    expect(content).toMatch(content);
  });

  test('prevents overwrite without --force', async() => {
    await runCli(['init:db']);
    const result =await runCli(['init:db']);
    expect(result.stdout).toMatch(/already exists/);
  });

  test('overwrites with --force', async () => {
    await runCli(['init:db']);
    const result = await runCli(['init:db', '--force']);
    expect(result.stdout).toMatch(/forcefully recreating/);
  });
});