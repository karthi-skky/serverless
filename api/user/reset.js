const response = require('../../helpers/utils/response');
const { updatePassword, crearTempCredentials } = require('../../helpers/user/update');

const handler = async (event, context) => {
  
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const id = event.requestContext.authorizer.principalId;

    if(!event.body) throw {
      statusCode: 400,
      message: 'request body required'
    }

    const { password } = JSON.parse(event.body);    
    await updatePassword({ id, password });

    await crearTempCredentials( { id });

    return response(200, { message: 'success' });
  }
  catch (err) {
    console.log(err);
    let { statusCode, message } = err;   
    
    return response(statusCode || 401, { message } || { message: 'login failed' });
  }}

module.exports = { handler }