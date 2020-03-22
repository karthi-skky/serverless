const response = require('../../helpers/utils/response');
const { createInventories, createInventory } = require('../../helpers/inventory/create');
const { getInventories } = require('../../helpers/inventory/get');
const { getSubscription } = require('../../helpers/subscription/get');
const { getUser } = require('../../helpers/user/get');

const handler = async (event, context) => {
  try {    
    const user_id = event.requestContext.authorizer.principalId;
    const inventory = JSON.parse(event.body);


    if(!inventory) throw { 
      statusCode: 400, 
      message: 'inventory required' 
    };

    const user = await getUser({ id: user_id });
    if(!user) throw { 
      statusCode: 400, 
      message: 'invalid supplier' 
    };

    if(!user['dataValues']['oem']) {
      inventory.oem_excess = false;
    }

    const subscription = await getSubscription({ id: user['dataValues']['subscription_id'] });

    let inventories = await getInventories({ user_id });    

    let limit = 0;
    if(isNaN(subscription['dataValues']['inventory_limit'])) {
      limit = 10000000000;
    } else {
      limit = Number(subscription['dataValues']['inventory_limit'])
    }

    if(Array.isArray(inventory)) {
      if(limit < inventories.length + inventory.length) throw {
        statusCode: 429,
        message: 'limit exceeded'
      }
      await createInventories(inventory, user_id);
    } else {
      if(limit < inventories.length + 1) throw {
        statusCode: 429,
        message: 'limit exceeded'
      }
      inventory.user_id = user_id;
      await createInventory(inventory)
    }

    return response(201, { message: 'success' });
  } catch(err) {
    console.log(err);
    let { statusCode, message } = err;   
    return response(statusCode || 500, { message } || { message: 'server error' });
  }
}

module.exports = { handler }