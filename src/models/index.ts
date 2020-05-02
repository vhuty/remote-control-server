import { readdirSync } from 'fs';
import { join, basename } from 'path';
import config from '../config';
import pg from '../database/pg';
import associations from '../database/associations';
  
const db = pg(config.pg);
const { sequelize } = db;

const currentFile = basename(__filename);
readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf('.') !== 0 &&
      file !== currentFile &&
      file.slice(-3) === '.js'
  )
  .forEach((file) => {
    const model = sequelize.import(join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

associations(sequelize);

export default db;
