const { db, Sequelize } = require('../postgres');
const {BIGINT, TIME, SMALLINT } = Sequelize;
const { Search } = require('./search');

const Counter = db.define('counter', {
  id: { type: BIGINT, primaryKey: true },
  search_id: BIGINT,
  value: SMALLINT,
  created_at: TIME,
  updated_at: TIME
}, {
  underscored: true,
});

Counter.belongsTo(Search);


module.exports = { Counter };