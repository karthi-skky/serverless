const { Admin } = require('../db/models/admin');

const getAdmin = async where => {
  return await Admin.findOne({
    where
  });
};

module.exports = { getAdmin };