const response = require('../../helpers/utils/response');
const { getPayments } = require('../../helpers/payment/get');
const { Subscription } = require('../../helpers/db/models/subscription');

const handler = async (event, context) => {
  
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const { user_id } = event.pathParameters;
    if(!user_id) throw { 
      statusCode: 400, 
      message: 'invalid param' 
    }
    let where = { user_id };
    let order =  [['created_at', 'DESC']];
    let include = '';
    const payments = await getPayments(where, order, include);
    return response(200, payments);
  }
  catch (err) {
    console.log(err);
    let { statusCode, message } = err;   
    return response(statusCode || 500, { message } || { message: 'server error' });
  }}

module.exports = { handler }