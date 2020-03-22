const { Admin } = require('../db/models/admin');

const updateToken = async admin => {
  let { login_id, token } = admin;
  return await Admin.update({
    token
  }, {
    where: { login_id }
  });
}

module.exports = { updateToken }