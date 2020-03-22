const response = require('../../helpers/utils/response');
const { createWishlist } = require('../../helpers/wishlist/create');
const { getUser } = require('../../helpers/user/get');

const handler = async (event, context) => {
  try {    
    const user_id = event.requestContext.authorizer.principalId;
    const wishlist = JSON.parse(event.body);

    if(!wishlist) throw { 
      statusCode: 400, 
      message: 'wishlist required' 
    };

    if(!wishlist.quantity) throw { 
      statusCode: 400, 
      message: 'quantity required' 
    };

    if(!wishlist.part_number) throw { 
      statusCode: 400, 
      message: 'part_number required' 
    };

    const user = await getUser({ id: user_id });
    if(!user) throw { 
      statusCode: 400, 
      message: 'invalid user' 
    };
    
    // if(Array.isArray(wishlist)) {
    //   await createWishlists(wishlist, user_id);
    // } else {
    wishlist.user_id = user_id;
    wishlist.id = await createWishlist(wishlist);
    //}

    return response(201, { message: 'success', wishlist_id: wishlist.id });
  } catch(err) {
    console.log(err);
    let { statusCode, message } = err;   
    return response(statusCode || 500, { message } || { message: 'server error' });
  }
}

module.exports = { handler }