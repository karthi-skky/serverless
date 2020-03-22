const { Subscription } = require('../db/models/subscription');

const updateSubscription = async subscription => {
  return await Subscription.update(subscription, {where: { id: subscription.id }});
};

module.exports = { 
  updateSubscription
};