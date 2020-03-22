const { db, Sequelize } = require('../postgres');
const { UUIDV4, STRING, TIME, TEXT, BIGINT, BOOLEAN } = Sequelize;
const { User } = require('./user');
const { Wishlist } = require('./wishlist');

const Inventory = db.define('inventory', {
  id: {type: UUIDV4, primaryKey: true },
  user_id: UUIDV4,
  part_number: STRING,
  description: TEXT,
  date_code: STRING,
  brand_name: STRING,
  quantity_available: BIGINT,
  oem_excess: BOOLEAN,
  hot_offer: BOOLEAN,
  created_at: TIME,
  updated_at: TIME
}, {
  underscored: true,
});

Inventory.belongsTo(User);
Inventory.belongsTo(Wishlist, {foreignKey: 'part_number', targetKey: 'part_number'});


module.exports = { Inventory };