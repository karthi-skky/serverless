const response = require('../../helpers/utils/response');
const { getUser } = require('../../helpers/user/get');
const { deleteUser } = require('../../helpers/user/delete');


const handler = async (event, context) => {
  
  context.callbackWaitsForEmptyEventLoop = false;

  try {

    const { id } = event.pathParameters;
    let user = await getUser({ id });

    if(!user) throw { 
      statusCode: 404, 
      message: 'user not found' 
    };

    await deleteUser({id});

    return response(200, {message: 'success'});
  }
  catch (err) {
    console.log(err);
    let { statusCode, message } = err;   
    return response(statusCode || 500, { message } || { message: 'server error' });
  }}

module.exports = { handler }