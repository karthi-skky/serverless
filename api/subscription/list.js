const response = require('../../helpers/utils/response');
const { getSubscriptions } = require('../../helpers/subscription/get');

const handler = async (event, context) => {

  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const subscriptions = await getSubscriptions();
    return response(200, subscriptions);
  }
  catch (err) {
    console.log(err);
    let { statusCode, message } = err;
    return response(statusCode || 500, { message } || { message: 'server error' });
  }}

module.exports = { handler }
