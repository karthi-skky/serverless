const response = require('../../helpers/utils/response');
const { sendWishlistQuoteMail } = require('../../helpers/quote/sendmail');
const { getUser } = require('../../helpers/user/get');


const handler = async (event, context) => {
    try {    
        const user_id = event.requestContext.authorizer.principalId;
        const wishlist = JSON.parse(event.body);

        if(!wishlist) throw { 
            statusCode: 400, 
            message: 'wishlist required' 
        };

        const user = await getUser({ id: user_id });
        if(!user) throw { 
            statusCode: 400, 
            message: 'invalid user' 
        };

        if(!wishlist.id) throw { 
            statusCode: 400, 
            message: 'wishlist id required' 
          };

        await sendWishlistQuoteMail(wishlist, user);

        return response(200, {message: 'success'});
  }
  catch (err) {
    console.log(err);
    let { statusCode, message } = err;   
    return response(statusCode || 500, { message } || { message: 'server error' });
  }}

module.exports = { handler }