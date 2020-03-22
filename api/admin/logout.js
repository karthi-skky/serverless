const response = require('../../helpers/utils/response');
const { updateToken } = require('../../helpers/admin/update');
const { getAdmin } = require('../../helpers/admin/get');

const handler = async (event, context) => {
  
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const id = event.requestContext.authorizer.principalId;
    let admin = await getAdmin({ login_id: id });
    admin.token = null;
    await updateToken(admin);
    return response(200, { message: 'success' });
  }
  catch (err) {
    console.log(err);
    let { statusCode, message } = err;   
    
    return response(statusCode || 401, { message } || { message: 'login failed' });
  }}

module.exports = { handler }