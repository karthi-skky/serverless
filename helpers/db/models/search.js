const { db, Sequelize } = require('../postgres');
const { STRING, BIGINT, TIME } = Sequelize;
const { Counter } = require('../models/counter');

const Search = db.define('search', {
  id: {type: BIGINT, primaryKey: true },
  search_term: { type: STRING, unique: true },
  created_at: TIME,
  updated_at: TIME
},{
  underscored: true,
});

Search.hasMany(Counter)

module.exports = { Search };