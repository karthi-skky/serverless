const { Payment } = require('../db/models/payment');

const getPayment = async where => {
  return await Payment.findOne({
    where
  });
};

const getPayments = async (where, order, include) => {
  return await Payment.findAll({where, order, include});
};

module.exports = { 
  getPayment,
  getPayments 
};