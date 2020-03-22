const response = require('../../helpers/utils/response');
const { verify } = require('../../helpers/user/verify');

const handler = async (event, context) => {
  
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const user = JSON.parse(event.body);
    const { token } = await verify(user);

    if(!token) throw { 
      statusCode: 401, 
      message: 'login failed' 
    };

    return response(200, { token });
  }
  catch (err) {
    console.log(err);
    let { statusCode, message } = err;   
    
    return response(statusCode || 401, { message } || { message: 'login failed' });
  }}

module.exports = { handler }