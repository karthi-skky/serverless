const response = require('../../helpers/utils/response');
const { getQuotes } = require('../../helpers/quote/get');

const handler = async (event, context) => {
  
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const user_id = event.requestContext.authorizer.principalId;
    const quotes = await getQuotes({ user_id });
    return response(200, quotes);
  }
  catch (err) {
    console.log(err);
    let { statusCode, message } = err;   
    return response(statusCode || 500, { message } || { message: 'server error' });
  }}

module.exports = { handler }