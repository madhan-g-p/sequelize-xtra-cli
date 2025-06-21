const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const { errored,success } = require("./logHelpers");
const prettier = require("prettier");

const generateMigraion = async({modelPath,fileName}) => {
  const absoluteModelPath = path.join(process.cwd(), modelPath);
  if (!fs.existsSync(absoluteModelPath)) {
    errored(`Model file not found at ${absoluteModelPath}`);
    process.exit(1);
  }

  const modelDefinition = require(absoluteModelPath);

  
  let dbConfig = process.env.DB_DIALECT || {};

  // Create a Sequelize instance with correct dialect but without connecting
  const sequelize = new Sequelize({
    dialect: dbConfig.dialect || 'mysql', // Default to SQLite if dialect is missing
    storage: dbConfig.dialect === 'sqlite' ? ':memory:' : undefined, // Avoid actual DB connection
    logging: false,
  });

  const model = modelDefinition(sequelize, DataTypes);

  if (!model?.rawAttributes) {
    errored(`Invalid model file. Ensure it exports a Sequelize model.`);
    process.exit(1);
  }

  const attributes = model.rawAttributes;
  const indexes = model.options.indexes || [];
  const tableName = model.tableName;

  // Generate migration content
  const migrationContent = `
'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('${tableName}', {
      ${Object.entries(attributes)
        .map(([key, value]) => {
        let valueType = "";
        if(value.type.key.includes("ENUM")){
          valueType = `${value.type.key}${JSON.stringify(value.type.key.values)}`;
        }else{
          valueType = value.type.key;
        }
        console.log(value.type);
        let columnDefinition = `type: Sequelize.${valueType}`;
        if (value.allowNull === false) columnDefinition += `, allowNull: false`;
        if (value.primaryKey) columnDefinition += `, primaryKey: true`;
        if (value.autoIncrement) columnDefinition += `, autoIncrement: true`;
        if (value.defaultValue !== undefined) columnDefinition += `, defaultValue: ${JSON.stringify(value.defaultValue)}`;
        if (value.references) columnDefinition += `, references: { model: '${value.references.model}', key: '${value.references.key}' }`;
        if (value.unique) columnDefinition += `, unique: true`;
        if (value.index) columnDefinition += `, index: true`;
        return `${key}: { ${columnDefinition} }`;
      })
      .join(',\n      ')},
    });
    ${indexes
      .map(
        (index) => `
    await queryInterface.addIndex('${tableName}', {
      fields: ${JSON.stringify(index.fields)},
      unique: ${index.unique || false},
      where: ${index.where ? JSON.stringify(index.where,null,2) : 'null'}
    });`
      )
      .join('\n')}
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('${tableName}');
  }
};
`;

  // Save migration file
  const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, '');
  const migrationFilename = `${timestamp}-create-${tableName}.js`;
  const migrationPath = path.join(process.cwd(), 'migrations', migrationFilename);

  fs.mkdirSync(path.dirname(migrationPath), { recursive: true });
  await prettier.format(migrationContent, {
    parser: "babel"
  }).then((formattedCode) => {
    fs.writeFileSync(migrationPath, formattedCode);
    success(`Created the migration at ${migrationPath} successfully`);
  })

}


module.exports = generateMigraion
