'use strict';

const fs = require('fs')
    , path = require('path');

const config = require('./../config/')
    , db = require('../database/pg')(config.pg)
    , associations = require('../database/associations');

const { sequelize } = db;

const currentFile = path.basename(__filename);
fs.readdirSync(__dirname)
    .filter((file) => file.indexOf('.') !== 0 && file !== currentFile && file.slice(-3) === '.js').forEach((file) => {
        const model = sequelize['import'](path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

associations(sequelize);

module.exports = db;
