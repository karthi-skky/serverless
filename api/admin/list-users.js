const response = require('../../helpers/utils/response');
const { getUsers } = require('../../helpers/user/get');

const handler = async (event, context) => {
  
  context.callbackWaitsForEmptyEventLoop = false;

  try {

    let where ='';
    let order = [['created_at', 'DESC']];
    const users = await getUsers(where, order);
    return response(200, users);
  }
  catch (err) {
    console.log(err);
    let { statusCode, message } = err;   
    return response(statusCode || 500, { message } || { message: 'server error' });
  }
}

module.exports = { handler }