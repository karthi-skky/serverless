const response = require('../../helpers/utils/response');
const { createSubscription } = require('../../helpers/subscription/create');

const handler = async (event, context) => {
  try {
    let subscription = JSON.parse(event.body);
    
    if(!subscription) throw { 
      statusCode: 400, 
      message: 'bad input' 
    };

    if(!subscription['name']) throw { 
      statusCode: 400, 
      message: 'subscription plan name required' 
    };

    if(!subscription['validity_days']) throw { 
      statusCode: 400, 
      message: 'validity days required' 
    };

    if(!subscription['price_in_usd']) throw { 
      statusCode: 400, 
      message: 'price_in_usd required' 
    };

    if(!subscription['description']) throw { 
      statusCode: 400, 
      message: 'description required' 
    };
    
    await createSubscription(subscription);
    
    return response(201, { message: 'success' });

  } catch(err) {
    
    console.log(err);
    let { statusCode, message } = err;   

    if(err.name == 'SequelizeUniqueConstraintError') {
      statusCode = 409;
      message = err.errors[0].message || 'duplicate entry';
    }

    return response(statusCode || 500, { message } || { message: 'server error' });
  }
}

module.exports = { handler }