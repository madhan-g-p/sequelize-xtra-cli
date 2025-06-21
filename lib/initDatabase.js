const fs = require('fs');
const path = require('path');
const {info,warn,errored,success} = require("./logHelpers");


const generateDbConfigTemplate=(envs)=>{

  const keyValuePairs = (env)=>{
    return {
      username: `${env}_DB_USER`,
      password: `${env}_DB_PASSWORD`,
      database: `${env}_DB_NAME`,
      host: `${env}_DB_HOST`,
      port: `${env}_DB_PORT`,
    }
  }
  
  const configKeys = (envs).map((env)=>Object.values(keyValuePairs(env)).join(", ")).join(",\n     ")
  
  
  const configTemplate = `require("dotenv").config();
  
  const {DB_DIALECT, 
     ${configKeys}} = process.env;
  
  module.exports = {
${envs
    .map((env) =>
  `  ${env}: {
${Object.entries(keyValuePairs(env))
    .map(([key, value]) => `    ${key}: ${value}`)
    .join(",\n")}
  },`)
   .join("\n")}
  common: {
    dialect: DB_DIALECT,
    typeValidation: true
  }
};
`;

  return configTemplate;
}


const initDatabase = async (options) => {

  try {
    const databaseDir = path.join(process.cwd(), 'database');
    const configFile = path.join(databaseDir, 'config.js');
    
    if (!fs.existsSync(databaseDir)) {
      fs.mkdirSync(databaseDir, { recursive: true });
    }
    
    if (fs.existsSync(configFile) && !options.force) {
      warn("Database Configuration file already exists! No Changes made.");
      return;
    }

    if(options.force){
      info("[-f, --force] option provided ,forcefully recreating the database configuration")
    }

    const configTemplate = generateDbConfigTemplate(options.envs)
    fs.writeFileSync(configFile, configTemplate, 'utf8');
    success("Database Configuration file Created successsfully at database/config.js")
  } catch (error) {
    errored("Failed to create Database configuration file:",error.message,error.stack )
    return;
  }
};

module.exports = initDatabase;
