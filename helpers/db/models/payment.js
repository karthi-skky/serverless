const { db, Sequelize } = require('../postgres');
const { UUIDV4, STRING, TEXT, TIME, FLOAT } = Sequelize;

const Payment = db.define('payment', {
  id: {type: STRING, primaryKey: true },
  user_id: UUIDV4,
  subscription_id: UUIDV4,
  amount: FLOAT,
  currency: STRING,
  provider: TEXT,
  created_at: TIME,
  status: TEXT
}, {
  underscored: true,
});

module.exports = { Payment };