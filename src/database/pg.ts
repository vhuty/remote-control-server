import { Sequelize } from 'sequelize';

export default (config) => {
  const { dialect, user, pwd, uri, dbName, options } = config;

  const connectURI = `${dialect}://${user}:${pwd}@${uri}/${dbName}`;
  const sequelize = new Sequelize(connectURI, options);

  return { Sequelize, sequelize };
};
