const response = require('../../helpers/utils/response');
const { getUser } = require('../../helpers/user/get');
const { countInventory } = require('../../helpers/inventory/get');
const { countWishlist } = require('../../helpers/wishlist/get');

const handler = async (event, context) => {
  
  context.callbackWaitsForEmptyEventLoop = false;
  const fieldsToSend = [
      "first_name",
      "last_name",
      "job_title",
      "company_name",
      "company_address",
      "city",
      "state",
      "country",
      "zip_code",
      "fax",
      "phone",
      "email_address",
      "oem",
      "website",
      "business_nature",
      "created_at"
  ];

  try {
    const { id } = event.pathParameters;
    if(!id) throw { 
      statusCode: 400, 
      message: 'invalid param' 
    }
    const user = await getUser({ id });

    let supplier = {};
    fieldsToSend.forEach(field => {
        supplier[field] = user[field]
    });
    supplier.inventory_count = await countInventory({ user_id: id });
    supplier.wishlist_count = await countWishlist({ user_id: id });
    return response(200, supplier);
  }
  catch (err) {
    console.log(err);
    let { statusCode, message } = err;   
    return response(statusCode || 500, { message } || { message: 'server error' });
  }}

module.exports = { handler }