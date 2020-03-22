const { db, Sequelize } = require('../postgres');
const { UUIDV4, STRING, TIME, BIGINT, TEXT } = Sequelize;
const { User } = require('./user');

const Wishlist = db.define('wishlist', {
  id: {type: UUIDV4, primaryKey: true },
  user_id: UUIDV4,
  part_number: STRING,
  quantity: BIGINT,
  brand_name: STRING,
  notes: TEXT,
  created_at: TIME,
  updated_at: TIME
}, {
  underscored: true,
});

Wishlist.belongsTo(User);

module.exports = { Wishlist };