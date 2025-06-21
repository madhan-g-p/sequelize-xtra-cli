require("dotenv").config();
  
  const {DB_DIALECT, 
     local_DB_USER, local_DB_PASSWORD, local_DB_NAME, local_DB_HOST, local_DB_PORT,
     dev_DB_USER, dev_DB_PASSWORD, dev_DB_NAME, dev_DB_HOST, dev_DB_PORT,
     prod_DB_USER, prod_DB_PASSWORD, prod_DB_NAME, prod_DB_HOST, prod_DB_PORT} = process.env;
  
  module.exports = {
  local: {
    username: local_DB_USER,
    password: local_DB_PASSWORD,
    database: local_DB_NAME,
    host: local_DB_HOST,
    port: local_DB_PORT
  },
  dev: {
    username: dev_DB_USER,
    password: dev_DB_PASSWORD,
    database: dev_DB_NAME,
    host: dev_DB_HOST,
    port: dev_DB_PORT
  },
  prod: {
    username: prod_DB_USER,
    password: prod_DB_PASSWORD,
    database: prod_DB_NAME,
    host: prod_DB_HOST,
    port: prod_DB_PORT
  },
  common: {
    dialect: DB_DIALECT,
    typeValidation: true
  }
};
