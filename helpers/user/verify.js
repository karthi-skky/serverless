
const { JWT_SECRET, SESSION_TTL_SECONDS } = require('../../config/config.json');
const util = require('util'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getLogin, getUser } = require('./get');
const { updateToken } = require('./update');


const compareAsync = util.promisify(bcrypt.compare);

const verify = async (credentials) => {

  let login = await getLogin({ 
    login_id: credentials['email_address'] 
  });
  
  if(!login) throw { 
    statusCode: 401, 
    message: 'invalid user' 
  };

  try {
    const isValid = await compareAsync(credentials['password'], login['password']);
    
    if(!isValid) throw { 
      statusCode: 401, 
      message: 'invalid password' 
    };

  } catch(err) {
    return { }
  }

  const user = await getUser({ 
    email_address: login['login_id'] 
  });

  if(!user) throw { 
    statusCode: 401, 
    message: 'invalid user' 
  };

  if(!user.subscription_end_date) throw {
    statusCode: 303, 
    message: 'no subscription' 
  };
  
  if(user.status == 'expired' || new Date().getTime() > new Date(user.subscription_end_date).getTime()) throw { 
    statusCode: 303, 
    message: 'subscription expired' 
  }; 
  
  if(user.status != 'active') throw { 
    statusCode: 401, 
    message: 'inactive user' 
  };

  const token = jwt.sign({ 
    sub: user.id,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  }, JWT_SECRET);

  login.token = token;
  await updateToken(login);

  return { token };

}

module.exports = { verify };