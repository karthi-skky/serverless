const { User } = require('../db/models/user');
const { Login } = require('../db/models/login');
const { getSubscription } = require('../subscription/get');
const { addDays } = require('../utils/date');const { updatePayment } = require('../payment/update');
const { db } = require('../db/postgres');

const util = require('util');
const bcrypt = require('bcrypt');

const hash = util.promisify(bcrypt.hash); 
const genSalt = util.promisify(bcrypt.genSalt);

const updateUser = async (user, trans) => {
  console.log("user update", user);
  if(trans) {
    return await User.update(user, {
      where: { 
        email_address: user['email_address'] 
      }, 
      transaction: trans
    });
  } else {
    return await User.update(user, {
      where: { 
        email_address: user['email_address'] 
      }
    });
  }
};

const updateToken = async login => {
  let { login_id, token } = login;
  return await Login.update({
    token
  }, {
    where: { login_id }
  });
}

const updatePassword = async credentials => {
  let { id, password } = credentials;
  const salt = await genSalt(10);
  password = await hash(credentials.password, salt);
  return await Login.update({
    password,
    salt
  }, {
    where: { user_id: id }
  });
}

const updateResetToken = async login => {
  let { login_id, reset_token } = login;
  return await Login.update({
    reset_token, 
  }, {
    where: { login_id }
  });
}

const updateTempCredentials = async login => {
  let { login_id, reset_token, token } = login;
  return await Login.update({
    reset_token, 
    token
  }, {
    where: { login_id }
  });
}

const crearTempCredentials = async credentials => {
  let { id } = credentials;
  return await Login.update({
    token: null,
    reset_token: null
  }, {
    where: { user_id: id }
  });
}

const updateUserAndPayment = async (user, payment) => {

  const subscription = await getSubscription({ id: payment.subscription_id });

  let days = Number(subscription['dataValues']['validity_days']);
  let date = addDays(days);

  user.subscription_id = payment.subscription_id;
  user.subscription_end_date = date;
  user.status = 'active';
  payment.status = `used for ${days} days - till ${date}`;

  return await db.transaction(async (t) => {
    await updatePayment(payment, t);
    return await updateUser(user, t);
  });
}


module.exports = { 
  updateUser,
  updateToken,
  updatePassword,
  updateResetToken,
  updateTempCredentials,
  crearTempCredentials,
  updateUserAndPayment
};