const fs = require('fs');
const path = require('path');
const runCli = require('../utils/runCli');

const demoAppDir = path.join(__dirname, '../demo-app');
const modelsDir = path.join(demoAppDir, 'models');
const modelPath = path.join(modelsDir, 'User.js');

beforeAll(() => {
  if (!fs.existsSync(demoAppDir)) fs.mkdirSync(demoAppDir, { recursive: true });
});

describe('CLI: model', () => {
  test('generates a model with required options', () => {
    const result = runCli([
      'model',
      '--mn', 'User',
      '--tn', 'users',
      '-a', 'email:string:notNull,age:int'
    ]);
    expect(result.stdout).toMatch(/Created the model User/);
    expect(fs.existsSync(modelPath)).toBe(true);
  });

  test('warns if model exists and no --force', () => {
    runCli(['model', '--mn', 'User', '--tn', 'users', '-a', 'email:string:notNull']);
    const result = runCli(['model', '--mn', 'User', '--tn', 'users', '-a', 'email:string:notNull']);
    expect(result.stdout).toMatch(/already exists/);
  });

  test('overwrites model with --force', () => {
    runCli(['model', '--mn', 'User', '--tn', 'users', '-a', 'email:string:notNull']);
    const result = runCli(['model', '--mn', 'User', '--tn', 'users', '-a', 'email:string:notNull', '--force']);
    expect(result.stdout).toMatch(/forcefully recreating/);
  });

  test('supports --soft-delete and --timestamps', () => {
    runCli([
      'model', '--mn', 'User', '--tn', 'users',
      '-a', 'email:string:notNull',
      '--soft-delete', '-t', 'snake'
    ]);
    const modelContent = fs.readFileSync(modelPath, 'utf8');
    expect(modelContent).toMatch(/paranoid: true/);
    expect(modelContent).toMatch(/createdAt/);
  });
});