const { db, Sequelize } = require('../postgres');
const { UUIDV4, TIME, BIGINT, TEXT } = Sequelize;
const { User } = require('./user');

const Quote = db.define('quote', {
  id: {type: UUIDV4, primaryKey: true },
  inventory_id: UUIDV4,
  user_id: UUIDV4,
  quantity: BIGINT,
  message: TEXT,
  created_at: TIME,
  updated_at: TIME
},{
  underscored: true,
});

Quote.belongsTo(User);


module.exports = { Quote };