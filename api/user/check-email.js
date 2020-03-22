const response = require('../../helpers/utils/response');
const { getUser } = require('../../helpers/user/get');

const handler = async (event, context) => {
  try {
    let { email_address } = JSON.parse(event.body);
    
    if(!email_address) throw { 
      statusCode: 400, 
      message: 'email_address required' 
    };

    let user = await getUser({ email_address });
    if(user) throw {
      statusCode: 409,
      message: 'email taken'
    }
    return response(200, { message: 'ok' });

  } catch(err) {
    console.log(err);
    let { statusCode, message } = err;   
    return response(statusCode || 500, { message } || { message: 'server error' });
  }
}

module.exports = { handler }