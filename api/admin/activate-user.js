const response = require('../../helpers/utils/response');
const { getUser } = require('../../helpers/user/get');
const { updateUser, updateUserAndPayment } = require('../../helpers/user/update');
const { runQuery } = require('../../helpers/db/query');
const sendMail = require('../../helpers/mail/send');
const { activeEmailTemplate } = require('../../helpers/mail/active-email-template');
const { SENDER_EMAIL } = require('../../config/config.json');


const handler = async (event, context) => {
  
  context.callbackWaitsForEmptyEventLoop = false;

  try {

    const { id } = event.pathParameters;
    let user = await getUser({ id });

    if(!user) throw { 
      statusCode: 404, 
      message: 'user not found' 
    };

    user = user['dataValues'];

    //if new user, check payment, assign subscription_end_date and activate
    if(user.status == 'new') {

      let paymentQuery = `SELECT * FROM payments WHERE user_id = '${id}' AND status='new' order by created_at ASC limit 1`;
      let payment = await runQuery(paymentQuery);
      payment = payment[0];

      if(!payment) throw {
        statusCode: 412,
        message: 'payment not found'
      }
      console.log('payment', payment);

      await updateUserAndPayment(user, payment);

    } else {
      //if user was already deactivated, just change the status
      user.status = 'active';
      await updateUser(user);
    }

    const link = `${event['headers']['origin']}/login`;

    const emailText = `Congrats! Your ICBaazzar account is activated. Please login to access the marketplace: ${link}`;

    await sendMail(SENDER_EMAIL, user.email_address, 'ICBaazzar Account Activated', emailText, activeEmailTemplate(user, link));

    return response(200, {message: 'User account activated: '+user.email_address});
  }
  catch (err) {
    console.log(err);
    let { statusCode, message } = err;   
    return response(statusCode || 500, { message } || { message: 'server error' });
  }}

module.exports = { handler }