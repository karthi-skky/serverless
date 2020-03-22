const { db, Sequelize } = require('../postgres');
const { STRING, TIME, UUIDV4 } = Sequelize;

const Login = db.define('login', {
  login_id: {type: STRING, primaryKey: true },
  user_id: UUIDV4,
  password: STRING,
  token: STRING,
  salt: STRING,
  reset_token: STRING,
  created_at: TIME,
  updated_at: TIME
},{
  underscored: true,
});

module.exports = { Login };