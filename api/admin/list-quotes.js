const response = require('../../helpers/utils/response');
const { getQuotes } = require('../../helpers/quote/get');

const handler = async (event, context) => {
  
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const quotes = await getQuotes();
    return response(200, quotes);
  }
  catch (err) {
    console.log(err);
    let { statusCode, message } = err;   
    return response(statusCode || 500, { message } || { message: 'server error' });
  }}

module.exports = { handler }