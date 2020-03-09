'use strict';

const path = require('path');

require('dotenv').config({
    path: path.resolve(process.cwd(), 'config', '.env') 
});

const env = process.env.NODE_ENV || 'development';
const config = require('./' + env);

module.exports = config;
