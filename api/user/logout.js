const response = require('../../helpers/utils/response');
const { updateToken } = require('../../helpers/user/update');
const { getLogin } = require('../../helpers/user/get');

const handler = async (event, context) => {
  
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const id = event.requestContext.authorizer.principalId;
    let login = await getLogin({ user_id: id });
    login.token = null;
    await updateToken(login);
    return response(200, { message: 'success' });
  }
  catch (err) {
    console.log(err);
    let { statusCode, message } = err;   
    
    return response(statusCode || 401, { message } || { message: 'login failed' });
  }}

module.exports = { handler }