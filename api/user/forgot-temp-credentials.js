const response = require('../../helpers/utils/response');
const { getLogin } = require('../../helpers/user/get');
const { updateTempCredentials } = require('../../helpers/user/update');
const { JWT_SECRET, RESET_SESSION_TTL } = require('../../config/config.json');
const jwt = require('jsonwebtoken');

const handler = async (event, context) => {
  
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    let { id } = event.queryStringParameters;
    
    if(!id) throw { 
      statusCode: 400, 
      message: 'id required' 
    };

    let login = await getLogin({ 
      reset_token: id 
    });   
  
    if(!login) throw {
      statusCode: 404,
      message: 'invalid link'
    }

    const token = jwt.sign({ 
      sub: login.user_id,
      exp: Math.floor(Date.now() / 1000) + RESET_SESSION_TTL,
    }, JWT_SECRET);

    login['dataValues'].reset_token = null;
    login['dataValues'].token = token;
    console.log(login['dataValues']);

    await updateTempCredentials(login['dataValues']);

    return response(200, { token, ttl: RESET_SESSION_TTL });
  }
  catch (err) {
    console.log(err);
    let { statusCode, message } = err;   
    
    return response(statusCode || 401, { message } || { message: 'login failed' });
  }}

module.exports = { handler }