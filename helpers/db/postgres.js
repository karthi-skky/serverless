
const { db } = require('../../config/config.json');
const Sequelize = require('sequelize');

console.log(db);

const workingDB = process.env.STAGE ? db[process.env.STAGE] : db['local'];

const { user, password, host, dbInstance } = db;
const sequelize = new Sequelize(dbInstance, user, password, {
  host,
  dialect: 'postgres',
  operatorsAliases: 0,
  pool: {
    max: 50,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

module.exports = {
  db: sequelize,
  Sequelize
};
