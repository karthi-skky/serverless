const response = require('../../helpers/utils/response');
const { getUser } = require('../../helpers/user/get');

const handler = async (event, context) => {
  
  context.callbackWaitsForEmptyEventLoop = false;

  try {

    const id = event.requestContext.authorizer.principalId;
    const user = await getUser({ id });

    if(!user) throw { 
      statusCode: 404, 
      message: 'user not found' 
    };

    return response(200, user);
  }
  catch (err) {
    console.log(err);
    let { statusCode, message } = err;   
    return response(statusCode || 500, { message } || { message: 'server error' });
  }
}

module.exports = { handler }