const response = require('../../helpers/utils/response');
const { getWishlists } = require('../../helpers/wishlist/get');

const handler = async (event, context) => {
  
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const wishlists = await getWishlists();
    return response(200, wishlists);
  }
  catch (err) {
    console.log(err);
    let { statusCode, message } = err;   
    return response(statusCode || 500, { message } || { message: 'server error' });
  }}

module.exports = { handler }