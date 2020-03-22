const response = require('../../helpers/utils/response');
const util = require('util');
const jwt = require('jsonwebtoken'); 
const verifyAsync = util.promisify(jwt.verify);
const { JWT_SECRET } = require('../../config/config.json');
const { getLogin } = require('../../helpers/user/get');
const { createPayment } = require('../../helpers/payment/create');
const { getUser } = require('../../helpers/user/get');
const { updateUserAndPayment } = require('../../helpers/user/update');
const { fetchPayment } = require('../../helpers/payment/razorpay');

const handler = async (event, context) => {
  try {
    
    let user_id = '';
    let user;
    let { Authorization } = event.headers;

    if(Authorization) {
      const slice = Authorization.slice(0, 7);
      if(Authorization && slice == 'Bearer ') {
        Authorization = Authorization.replace("Bearer ","");
      }
      try {
        const decoded = await verifyAsync(Authorization, JWT_SECRET);
        const login = await getLogin({ user_id: decoded.sub });
        if(!user || !user.token || Authorization != user.token) {
          Authorization = null;
        } else {
          user_id = login.id;
        }
      } catch(err) {
        Authorization = null;
      }
    } 
      
    const payment = JSON.parse(event.body);

    if(!payment) throw { 
      statusCode: 400, 
      message: 'payment required' 
    };

    if(!payment.id) throw { 
      statusCode: 400, 
      message: 'payment id required' 
    };

    if(!payment.subscription_id) throw { 
      statusCode: 400, 
      message: 'subscription id required' 
    };

    if(!user_id) {
      user = await getUser({ email_address: payment.email });
      if (user) {
        user_id = user.id;
      } else {
        throw {
          statusCode: 400,
          message: 'email address required'
        }
      }
    }

    if(!user){
      user = await getUser({ id: user_id });
    }

    if(!user) throw { 
      statusCode: 400, 
      message: 'invalid user' 
    };
    payment.user_id = user_id;
    user = user['dataValues'];

    try {
      const razorPayment = await fetchPayment(payment.id);

      //console.log(razorPayment);

      if(razorPayment) {
        payment.amount = razorPayment.amount;
        payment.currency = razorPayment.currency;
      }
      
      payment.status = 'new';
      await createPayment(payment);
     
      if(user.status != 'deactivated'){
        //activate user and payment for all new / active users
        await updateUserAndPayment(user, payment);
      }
      
      return response(201, { message: 'success' });
      
    }
    catch(err) {
      throw err;
    }
    
  } catch(err) {
    console.log(err);
    let { statusCode, message } = err;   
    return response(statusCode || 500, { message } || { message: 'server error' });
  }
}

module.exports = { handler }