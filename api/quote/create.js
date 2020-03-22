const response = require('../../helpers/utils/response');
const { createQuote, createQuotes } = require('../../helpers/quote/create');
const { sendQuoteRequestMail } = require('../../helpers/quote/sendmail');
const { getUser } = require('../../helpers/user/get');

const handler = async (event, context) => {
  try {    
    const user_id = event.requestContext.authorizer.principalId;
    const quote = JSON.parse(event.body);

    if(!quote) throw { 
      statusCode: 400, 
      message: 'quote required' 
    };

    const user = await getUser({ id: user_id });
    if(!user) throw { 
      statusCode: 400, 
      message: 'invalid user' 
    };
    
    if(Array.isArray(quote)) {
      quote.forEach((q) => {
        if(!q.inventory_id) throw { 
          statusCode: 400, 
          message: 'inventory_id required' 
        };
  
        if(!q.quantity) throw { 
          statusCode: 400, 
          message: 'quantity required' 
        };
      });
      await createQuotes(quote, user_id);
      for(const q of quote) {
        quote.user_id = user_id;
        await sendQuoteRequestMail(q, user);
      };
    } else {
      if(!quote.inventory_id) throw { 
        statusCode: 400, 
        message: 'inventory_id required' 
      };

      if(!quote.quantity) throw { 
        statusCode: 400, 
        message: 'quantity required' 
      };
      quote.user_id = user_id;
      await createQuote(quote);
      await sendQuoteRequestMail(quote, user);
    }
    
    return response(201, { message: 'success' });
  } catch(err) {
    console.log(err);
    let { statusCode, message } = err;   
    return response(statusCode || 500, { message } || { message: 'server error' });
  }
}

module.exports = { handler }