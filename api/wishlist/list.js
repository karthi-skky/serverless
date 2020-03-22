const response = require('../../helpers/utils/response');
const { getWishlists } = require('../../helpers/wishlist/get');

const handler = async (event, context) => {
  
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const user_id = event.requestContext.authorizer.principalId;
    const wishlist = await getWishlists({ user_id });
    return response(200, wishlist);
  }
  catch (err) {
    console.log(err);
    let { statusCode, message } = err;   
    return response(statusCode || 500, { message } || { message: 'server error' });
  }}

module.exports = { handler }