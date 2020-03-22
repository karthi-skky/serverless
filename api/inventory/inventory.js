const response = require('../../helpers/utils/response');
const { getInventory } = require('../../helpers/inventory/get');

const handler = async (event, context) => {
  
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const { id } = event.pathParameters;
    if(!id) throw { 
      statusCode: 400, 
      message: 'invalid param' 
    }
    const inventory = await getInventory({ id });
    return response(200, inventory);
  }
  catch (err) {
    console.log(err);
    let { statusCode, message } = err;   
    return response(statusCode || 500, { message } || { message: 'server error' });
  }}

module.exports = { handler }