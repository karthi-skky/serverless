const { db, Sequelize } = require('./postgres');

const executeQuery = async query => await db.query(query, { type: Sequelize.QueryTypes.UPSERT });
const runQuery = async query => await db.query(query, { type: Sequelize.QueryTypes.SELECT });

module.exports = { 
  executeQuery, 
  runQuery 
};