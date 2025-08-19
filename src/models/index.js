const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
// Note: You might need to adjust the path to your config file
const config = require(path.join(__dirname, '..', '..', 'config', 'config.json'))[env];
const db = {};

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
        ...config,
        define: { underscored: true, timestamps: true },
        pool: {
            max: 20,
            min: 20,
            acquire: 30000,
            idle: 10000,
        },
    },
);

/**
 * Recursively read all folder paths
 * @param {string} dirPath - Root directory
 * @param {string[]} arrayOfDirs - Accumulator for results
 * @returns {string[]} - All folder paths
 */
function getAllFolders(dirPath, arrayOfDirs = []) {
    const files = fs.readdirSync(dirPath);

    files.forEach((file) => {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            arrayOfDirs.push(fullPath);          // save folder path
            getAllFolders(fullPath, arrayOfDirs); // recursive call
        }
    });

    return arrayOfDirs;
}

/**
 * Import models
 * @param dirPath
 */
function importModels(dirPath) {
    fs
        .readdirSync(dirPath)
        .filter(file => {
            return (
                file.indexOf('.') !== 0 &&
                file !== basename &&
                (file.slice(-3) === '.js' || file.slice(-9) === '.model.js') && // Handles both .js and .model.js
                file.indexOf('.test.js') === -1
            );
        })
        .forEach(file => {
            const model = require(path.join(dirPath, file))(sequelize, Sequelize.DataTypes);
            db[model.name] = model;
        });
}

// get all directories
const directories = getAllFolders(__dirname);
// import models
for (let dirPath of directories) {
    importModels(dirPath);
}

// associate fix
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
