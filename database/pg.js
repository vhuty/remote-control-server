'use strict';

const { Sequelize } = require('sequelize');

module.exports = (config) => {
    const { dialect, user, pwd, uri, dbName, options } = config;
    
    const connectURI = `${ dialect }://${ user }:${ pwd }@${ uri }/${ dbName }`;
    const sequelize = new Sequelize(connectURI, options);

    return { Sequelize, sequelize }
}