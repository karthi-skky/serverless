const { User } = require('../db/models/user');

const deleteUser = async where => {
  return await User.destroy({ where })
};

module.exports = { 
  deleteUser
};