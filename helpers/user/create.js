const { User } = require('../db/models/user');
const { Login } = require('../db/models/login');
const { generateUUID } = require('../../helpers/utils/uuid');
const util = require('util');
const bcrypt = require('bcrypt');


const hash = util.promisify(bcrypt.hash); 
const genSalt = util.promisify(bcrypt.genSalt);

const createUser = async user => {
  user.id = generateUUID();
  return await User.create(user);
};

const createLogin = async credentials => {
  let { email_address, password, user_id } = credentials;
  const salt = await genSalt(10);
  password = await hash(credentials.password, salt);
  return await Login.create({
    login_id: email_address,
    password,
    salt,
    user_id
  });
}

module.exports = { 
  createUser,
  createLogin
};