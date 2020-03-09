const fs = require('fs').promises;
const path = require('path');

module.exports.init = async (sequelize) => {
    const files = await fs.readdir(__dirname);
    const scripts = files.filter(file => !file.startsWith('.') && file.endsWith('.sql'));

    const asyncTasks = scripts.map(async script => {
        const buffer = await fs.readFile(path.join(__dirname, script));
        const source = buffer.toString();

        return sequelize.query(source);
    });

    return Promise.all(asyncTasks);
}
