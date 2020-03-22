const response = require('../../helpers/utils/response');
const { createUser, createLogin } = require('../../helpers/user/create');

const handler = async (event, context) => {
  try {
    let user = JSON.parse(event.body);
    
    if(!user) throw { 
      statusCode: 400, 
      message: 'bad input' 
    };

    if(!user['email_address']) throw { 
      statusCode: 400, 
      message: 'email_address required' 
    };

    if(!user['password']) throw { 
      statusCode: 400, 
      message: 'password required' 
    };

    if(!user['subscription_id']) throw { 
      statusCode: 400, 
      message: 'subscription_id required' 
    };

    if(!user['company_name']) throw { 
      statusCode: 400, 
      message: 'company_name required' 
    };

    if(!user['company_address']) throw { 
      statusCode: 400, 
      message: 'company_address required' 
    };

    if(!user['country']) throw { 
      statusCode: 400, 
      message: 'country required' 
    };

    if(!user['phone']) throw { 
      statusCode: 400, 
      message: 'phone required' 
    };
    
    user.status = 'new';

    const newUser = await createUser(user);
    user.user_id = newUser.id;
    await createLogin(user);
    
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