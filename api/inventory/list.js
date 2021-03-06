const response = require('../../helpers/utils/response');
const { getInventories } = require('../../helpers/inventory/get');

const handler = async (event, context) => {
  
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const user_id = event.requestContext.authorizer.principalId;
    const inventories = await getInventories({ user_id });
    return response(200, inventories);
  }
  catch (err) {
    console.log(err);
    let { statusCode, message } = err;   
    return response(statusCode || 500, { message } || { message: 'server error' });
  }}

module.exports = { handler }