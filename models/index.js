'use strict';
const Sequelize = require('sequelize');
const db = {};
require('dotenv').config({})

let sequelize = null;
try {
    sequelize = new Sequelize(process.env.DATABASE, process.env.USERNAME, process.env.PASSWORD, {
        host: process.env.HOST || '127.0.0.1',
        dialect: process.env.DIALECT || 'mysql',
    });
} catch (error) {
    throw new Error('Error initializing Sequelize:', error);
}


db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
