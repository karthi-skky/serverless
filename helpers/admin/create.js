const { Admin } = require('../db/models/admin');
const util = require('util');
const bcrypt = require('bcrypt');

const hash = util.promisify(bcrypt.hash); 
const genSalt = util.promisify(bcrypt.genSalt);

const createAdmin = async credentials => {
  let admins = await Admin.findAll();
  if(admins.length > 0) throw {
    statusCode: 400,
    message: 'admin exists'
  }
  let { email_address, password } = credentials;
  const salt = await genSalt(10);
  password = await hash(credentials.password, salt);
  return await Admin.create({
    login_id: email_address,
    password,
    salt
  });
}

module.exports = { 
  createAdmin
};