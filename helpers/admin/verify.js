const { JWT_ADMIN_SECRET, SESSION_TTL_SECONDS } = require('../../config/config.json');
const util = require('util'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getAdmin } = require('./get');
const { updateToken } = require('./update');

const compareAsync = util.promisify(bcrypt.compare);

const verify = async (credentials) => {

  let admin = await getAdmin({ 
    login_id: credentials['email_address'] 
  });
  
  if(!admin) throw { 
    statusCode: 401, 
    message: 'invalid admin' 
  };

  try {
    const isValid = await compareAsync(credentials['password'], admin['password']);
    
    if(!isValid) throw { 
      statusCode: 401, 
      message: 'invalid password' 
    };

  } catch(err) {
    return { }
  }
  const token = jwt.sign({ 
    sub: admin.login_id,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  }, JWT_ADMIN_SECRET);

  admin.token = token;
  await updateToken(admin);

  return { token };

}

module.exports = { verify };