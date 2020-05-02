import { Sequelize } from 'sequelize';
import { promises as fs } from 'fs';
import { join } from 'path';

export default {
  init: async (sequelize: Sequelize) => {
    const files = await fs.readdir(__dirname);
    const scripts = files.filter(
      (file) => !file.startsWith('.') && file.endsWith('.sql')
    );

    const asyncTasks = scripts.map(async (script) => {
      const buffer = await fs.readFile(join(__dirname, script));
      const source = buffer.toString();

      return sequelize.query(source);
    });

    return Promise.all(asyncTasks);
  }
};
