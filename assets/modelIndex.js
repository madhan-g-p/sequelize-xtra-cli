const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const basename = path.basename(__filename);

const env = process.env.NODE_ENV || 'DEV';
const DB_CONFIG = require("../database/config");
const { database ,...DB_AUTH_CONFIG} = DB_CONFIG[env];

const sequelize = new Sequelize({ ...DB_AUTH_CONFIG, ...DB_CONFIG.common });

const db = {};

// Check Sequelize models with the database
sequelize.authenticate()
    .then(async() => {
        console.log('Connection to DB Server Successful');
            // Check if the database exists
        const dbExists = await sequelize.query(`SHOW DATABASES LIKE '${database}'`, {
            type: sequelize.QueryTypes.SELECT,
        });
  
        // If the database doesn't exist, create it
        if (dbExists.length === 0) {
            await sequelize.query(`CREATE DATABASE ${database}`);
            console.log(`Database ${database} created.`);
        }
    
        // Now reconnect using the newly created or existing database
        sequelize.config.database = database;
        await sequelize.authenticate();
        console.log(`Connected to the ${database} database.`);
        
        if(process.env.NODE_ENV==="local"){
            await sequelize.sync({alter:{drop:false}})
        }
    })
    .catch((error) => {
        console.error('Database connection error:', error);
    });

fs.readdirSync(path.join(__dirname))
    .filter(fileName => {
        return (
            fileName.includes('.') &&
            fileName !== basename &&
            fileName.endsWith(".js") &&
            !fileName.endsWith('.test.js')
        );
    })
    .forEach(file => {
        const model = require(path.join(__dirname, file))(sequelize, DataTypes);
        db[model.modelName] = model;
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;