const response = require('../../helpers/utils/response');
const { getUser } = require('../../helpers/user/get');
const { updateUser } = require('../../helpers/user/update');
const { getSubscription } = require('../../helpers/subscription/get');
const { addDays } = require('../../helpers/utils/date'); 
const { isUUID } = require('../../helpers/utils/uuid');

const handler = async (event, context) => {
  
  context.callbackWaitsForEmptyEventLoop = false;

  try {

    const { id } = event.pathParameters;

    if(!event.body) throw {
      statusCode: 400,
      message: 'request body required'
    }

    const { subscription_id } = JSON.parse(event.body);

    if(!subscription_id) throw {
      statusCode: 400,
      message: 'subscription_id required'
    }

    if(!isUUID(subscription_id)) throw {
      statusCode: 400,
      message: 'invalid subscription_id'    
    }

    let user = await getUser({ id });

    if(!user) throw { 
      statusCode: 404, 
      message: 'user not found' 
    };

    const subscription = await getSubscription({ id: subscription_id });

    if(!subscription) throw {
      statusCode: 404,
      message: 'subscription not found'
    }

    if(user['dataValues']['status'] != 'expired' && (new Date().getTime() < new Date(user['dataValues']['subscription_end_date']).getTime())) throw { 
      statusCode: 400,
      message: 'subscription still valid'
    }

    const date = addDays(Number(subscription['dataValues']['validity_days']));
    user['dataValues'].subscription_id = subscription.id;
    user['dataValues'].subscription_end_date = date;
    
    if(user['dataValues']['status'] == 'expired') {
      user['dataValues']['status'] = 'active';
    }

    await updateUser(user['dataValues']);
    return response(200, { message: 'success' });
  }
  catch (err) {
    console.log(err);
    let { statusCode, message } = err;   
    return response(statusCode || 500, { message } || { message: 'server error' });
  }}

module.exports = { handler }