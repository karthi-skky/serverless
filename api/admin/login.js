const response = require('../../helpers/utils/response');
const { verify } = require('../../helpers/admin/verify');

const handler = async (event, context) => {
  
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const admin = JSON.parse(event.body);
    const { token } = await verify(admin);

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