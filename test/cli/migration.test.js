const fs = require('fs');
const path = require('path');
const runCli = require('../utils/runCli');
const cleanDemoAppDirs = require('../utils/cleanDemoApp');

const demoAppDir = path.join(__dirname, '../demo-app');
const migrationsDir = path.join(demoAppDir, 'migrations');

beforeAll(() => {
  cleanDemoAppDirs(["migrations"]);
  if (!fs.existsSync(demoAppDir)) fs.mkdirSync(demoAppDir, { recursive: true });
});

describe('CLI: migration', () => {
  test('generates a migration from model', async () => {
    const result = await runCli(['migration', '--model-path', 'models/User.js']);
    expect(result.stdout).toMatch(/Created the migration/);
    const files = fs.readdirSync(migrationsDir);
    const migrationFile = files.find(f => f.endsWith('.js'));
    expect(migrationFile).toBeDefined();
    const migrationContent = fs.readFileSync(path.join(migrationsDir, migrationFile), 'utf8');
    expect(migrationContent).toMatch(/createTable/);
    expect(migrationContent).toMatch(/users/);
  });

  test('errors when no model-path or file-name', async () => {
    const result = await runCli(['migration']);
    expect(result.stderr).toMatch(/You must provide either model path/);
  });

  test('errors when both model-path and file-name', async () => {
    const result = await runCli(['migration', '--model-path', 'models/User.js', '--file-name', 'foo.js']);
    expect(result.stderr).toMatch(/cannot provide both model path and file name/);
  });
});