const response = require('../../helpers/utils/response');
const { getHotOffers, countInventory } = require('../../helpers/inventory/get');
const util = require('util');
const jwt = require('jsonwebtoken'); 
const verifyAsync = util.promisify(jwt.verify);
const { JWT_SECRET } = require('../../config/config.json');
const { getLogin } = require('../../helpers/user/get');
const { User } = require('../../helpers/db/models/user');

const handler = async (event, context) => {
  
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    let { Authorization } = event.headers;
    
    if(event.queryStringParameters) {
      var { offset, limit, order } = event.queryStringParameters;
    }

    if(!order) {
      order =  [['created_at', 'DESC']];
    }
    if(!limit) {
      limit = 10;
    }
    if(!offset) {
      offset = 0;
    }
    let include = '';

    if(Authorization) {
      const slice = Authorization.slice(0, 7);
      if(Authorization && slice == 'Bearer ') {
        Authorization = Authorization.replace("Bearer ","");
      }
      try {
        const decoded = await verifyAsync(Authorization, JWT_SECRET);
        const user = await getLogin({ user_id: decoded.sub });
        if(!user || !user.token || Authorization != user.token) {
          Authorization = null;
        } else {
          include = [{ model: User }]
        }
      } catch(err) {
        Authorization = null;
      }

    }
    
    let inventories = await getHotOffers({hot_offer: true}, order, include, limit, offset);
    let hot_offers_total_rows = await countInventory({ hot_offer: true });

    if(Authorization) {
      inventories.map(inventory => {
        inventory = inventory['dataValues'];
        inventory.company_name = inventory.user ? inventory.user.company_name : null;
        inventory.business_nature = inventory.user ? inventory.user.business_nature : null;
        inventory.country = inventory.user ? inventory.user.country : null;
        inventory.email_address = inventory.user ? inventory.user.email_address : null;
        inventory.phone_number = inventory.user ? inventory.user.phone : null; 
        inventory.company_address = inventory.user ?inventory.user.company_address : null
        inventory.city = inventory.user? inventory.user.city : null
        inventory.state = inventory.state? inventory.user.state : null
        delete inventory.user;
        return inventory
      });
    } else {
      inventories.map(inventory => {
        inventory = inventory['dataValues'];
        delete inventory.user_id;
        return inventory;
      });
    }

    let result = {
      data: inventories,
      total_rows: hot_offers_total_rows
    }

    return response(200, result);
  }
  catch (err) {
    console.log(err);
    let { statusCode, message } = err;   
    return response(statusCode || 500, { message } || { message: 'server error' });
  }}

module.exports = { handler }