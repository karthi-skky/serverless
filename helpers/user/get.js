const { User } = require('../db/models/user');
const { Login } = require('../db/models/login');

const getUser = async where => {
  return await User.findOne({
    where
  });
};

const getLogin = async where => {
  return await Login.findOne({
    where
  });
};

const getUsers = async (where, order) => {
  return await User.findAll({
    where, order
  });
};

module.exports = { 
  getUser, 
  getLogin,
  getUsers
};