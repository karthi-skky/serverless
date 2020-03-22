const { Subscription } = require('../db/models/subscription');
const { generateUUID } = require('../../helpers/utils/uuid');

const createSubscription = async subscription => {
  subscription.id = generateUUID();
  return await Subscription.create(subscription);
};

module.exports = { 
  createSubscription
};