const response = require('../../helpers/utils/response');
const { getUser } = require('../../helpers/user/get');
const { updateUser } = require('../../helpers/user/update');


const handler = async (event, context) => {
  
  context.callbackWaitsForEmptyEventLoop = false;

  try {

    const id = event.requestContext.authorizer.principalId;
    const user = await getUser({ id });

    if(!user) throw { 
      statusCode: 404, 
      message: 'user not found' 
    };

    let updatedProfile = JSON.parse(event.body);
    updatedProfile.subscription_end_date = user.subscription_end_date;
    updatedProfile.email_address = user.email_address;
    updatedProfile.subscription_id = user.subscription_id;

    await updateUser(updatedProfile);

    return response(200, {message: 'success'});
  }
  catch (err) {
    console.log(err);
    let { statusCode, message } = err;   
    return response(statusCode || 500, { message } || { message: 'server error' });
  }}

module.exports = { handler }