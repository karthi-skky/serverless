const { db, Sequelize } = require('../postgres');
const { STRING, TIME } = Sequelize;

const Admin = db.define('admin', {
  login_id: {type: STRING, primaryKey: true },
  password: STRING,
  token: STRING,
  salt: STRING,
  created_at: TIME,
  updated_at: TIME
},{
  underscored: true,
});

module.exports = { Admin };