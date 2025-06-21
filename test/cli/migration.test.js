const fs = require('fs');
const path = require('path');
const runCli = require('../utils/runCli');

const demoAppDir = path.join(__dirname, '../demo-app');
const modelsDir = path.join(demoAppDir, 'models');
const migrationsDir = path.join(demoAppDir, 'migrations');
const modelPath = path.join(modelsDir, 'User.js');

beforeAll(() => {
  if (!fs.existsSync(demoAppDir)) fs.mkdirSync(demoAppDir, { recursive: true });
  // Generate a model for migration
  if (!fs.existsSync(modelsDir)) fs.mkdirSync(modelsDir);
  fs.writeFileSync(
    modelPath,
    `
      module.exports = (sequelize, DataTypes) => {
        return sequelize.define('User', {
          email: { type: DataTypes.STRING, allowNull: false }
        }, { tableName: 'users' });
      };
    `
  );
});

describe('CLI: migration', () => {
  test('generates a migration from model', () => {
    const result = runCli(['migration', '--model-path', 'models/User.js']);
    expect(result.stdout).toMatch(/Created the migration/);
    const files = fs.readdirSync(migrationsDir);
    const migrationFile = files.find(f => f.endsWith('.js'));
    expect(migrationFile).toBeDefined();
    const migrationContent = fs.readFileSync(path.join(migrationsDir, migrationFile), 'utf8');
    expect(migrationContent).toMatch(/createTable/);
    expect(migrationContent).toMatch(/users/);
  });

  test('errors when no model-path or file-name', () => {
    const result = runCli(['migration']);
    expect(result.stderr).toMatch(/You must provide either model path/);
  });

  test('errors when both model-path and file-name', () => {
    const result = runCli(['migration', '--model-path', 'models/User.js', '--file-name', 'foo.js']);
    expect(result.stderr).toMatch(/cannot provide both model path and file name/);
  });
});