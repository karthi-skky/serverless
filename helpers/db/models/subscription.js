const { db, Sequelize } = require('../postgres');
const { UUIDV4, STRING, TIME, BIGINT, FLOAT, TEXT } = Sequelize;

const Subscription = db.define('subscription', {
  id: {type: UUIDV4, primaryKey: true },
  name: STRING,
  validity_days: BIGINT,
  price_in_usd: FLOAT,
  inventory_limit: STRING, 
  description: TEXT, 
  created_at: TIME,
  updated_at: TIME
}, {
  underscored: true,
});

module.exports = { Subscription };