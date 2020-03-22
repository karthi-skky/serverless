const response = require('../../helpers/utils/response');
const { getUser } = require('../../helpers/user/get');
const { verify } = require('../../helpers/user/verify');
const { updatePassword } = require('../../helpers/user/update');


const handler = async (event, context) => {
  
  context.callbackWaitsForEmptyEventLoop = false;

  try {

    const id = event.requestContext.authorizer.principalId;
    const user = await getUser({ id });

    if(!user) throw { 
      statusCode: 404, 
      message: 'user not found' 
    };

    let passwords = JSON.parse(event.body);
    let userVerify = {
        "email_address": user.email_address,
        "password": passwords.current_password
    }
    
    const { token } = await verify(userVerify);
    if(!token) throw { 
        statusCode: 401, 
        message: 'password verification failed' 
      };

    let password = passwords.new_password;
    
    await updatePassword({ id, password });

    return response(200, { message: 'success' });
  }
  catch (err) {
    console.log(err);
    let { statusCode, message } = err;   
    return response(statusCode || 500, { message } || { message: 'server error' });
  }}

module.exports = { handler }