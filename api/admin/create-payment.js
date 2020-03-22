const response = require('../../helpers/utils/response');
const { createPayment } = require('../../helpers/payment/create');
const { getUser } = require('../../helpers/user/get');
const { updateUserAndPayment } = require('../../helpers/user/update');
const { generateUUID } = require('../../helpers/utils/uuid');

const handler = async (event, context) => {
  try {
    let payment = JSON.parse(event.body);
    
    if(!payment) throw { 
      statusCode: 400, 
      message: 'bad input' 
    };

    let user = await getUser({ id: payment['user_id'] });

    if(!user) throw { 
      statusCode: 400, 
      message: 'invalid user' 
    };

    user = user['dataValues'];

    if(!payment['subscription_id']) throw { 
      statusCode: 400, 
      message: 'payment subscription required' 
    };

    if(!payment['amount']) throw { 
      statusCode: 400, 
      message: 'amount required' 
    };

    if(!payment['user_id']) throw { 
      statusCode: 400, 
      message: 'user_id required' 
    };

    if(!payment['currency']) { 
        payment['currency'] = 'USD';
    }
    payment.amount = payment['amount'] * 100;
    payment.id = generateUUID();
    payment.status = 'new';
    await createPayment(payment);

    if(user.status != 'new') {
      //change plan scenario
      await updateUserAndPayment(user, payment);
    }
    
    return response(201, { message: 'Payment successfully submitted. Payment ID: '+ payment.id });

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