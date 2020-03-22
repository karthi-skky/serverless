const response = require('../../helpers/utils/response');
const { getLogin, getUser } = require('../../helpers/user/get');
const { updateResetToken } = require('../../helpers/user/update');
const { generateUUID } = require('../../helpers/utils/uuid');
const sendMail = require('../../helpers/mail/send');
const { resetPasswordTemplate } = require('../../helpers/mail/reset-password-template');
const { SENDER_EMAIL } = require('../../config/config.json');

const handler = async (event, context) => {
  
  context.callbackWaitsForEmptyEventLoop = false;

  try {

    if(!event.body) throw {
      statusCode: 400,
      message: 'request body required'
    }

    const { email_address } = JSON.parse(event.body);    

    if(!email_address) throw { 
      statusCode: 400, 
      message: 'email_address required' 
    };

    let login = await getLogin({ 
      login_id: email_address 
    });

    let user = await getUser({ 
      email_address 
    });

    if(!login) throw {
      statusCode: 404,
      message: 'invalid user'
    }
  
    const reset_token = generateUUID();
    await updateResetToken({ login_id: email_address, reset_token });

    const link = `${event['headers']['origin']}/reset-password?id=${reset_token}`;

    const name = user['dataValues']['first_name'];
    console.log(user);
    await sendMail(SENDER_EMAIL, email_address, 'reset password', `Reset password link ${link}`, resetPasswordTemplate(name, email_address, link));
    return response(200, { message: 'email sent' });
  }
  catch (err) {
    console.log(err);
    let { statusCode, message } = err;   
    
    return response(statusCode || 500, { message } || { message: 'server error' });
  }}

module.exports = { handler }