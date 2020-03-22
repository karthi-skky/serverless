const { Subscription } = require('../db/models/subscription');

const getSubscription = async where => {
  return await Subscription.findOne({
    where
  });
};

const getSubscriptions = async where => {
  return await Subscription.findAll();
};

module.exports = {
  getSubscription,
  getSubscriptions
};
