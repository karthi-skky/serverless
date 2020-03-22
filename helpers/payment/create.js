const { Payment } = require('../db/models/payment');

const createPayment = async payment => {
  return await Payment.create(payment);
};

module.exports = { 
  createPayment
};