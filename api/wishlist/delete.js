const response = require('../../helpers/utils/response');
const { deleteWishlist } = require('../../helpers/wishlist/delete');


const handler = async (event, context) => {
  
  context.callbackWaitsForEmptyEventLoop = false;

  try {

    const { id } = event.pathParameters;

    await deleteWishlist({id});

    return response(200, {message: 'success'});
  }
  catch (err) {
    console.log(err);
    let { statusCode, message } = err;   
    return response(statusCode || 500, { message } || { message: 'server error' });
  }}

module.exports = { handler }