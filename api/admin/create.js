const response = require('../../helpers/utils/response');
const { createAdmin } = require('../../helpers/admin/create');

const handler = async (event, context) => {
  try {
    let admin = JSON.parse(event.body);
    
    if(!admin) throw { 
      statusCode: 400, 
      message: 'bad input' 
    };

    if(!admin['email_address']) throw { 
      statusCode: 400, 
      message: 'email_address required' 
    };

    if(!admin['password']) throw { 
      statusCode: 400, 
      message: 'password required' 
    };
    
    await createAdmin(admin);
    
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