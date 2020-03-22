const { Payment } = require('../db/models/payment');

const updatePayment = async (payment, trans) => {
  if(trans){
    return await Payment.update(payment, {
      where: { 
        id: payment['id'] 
      },
      transaction: trans
    });
  } else {
    return await Payment.update(payment, {
      where: { 
        id: payment['id'] 
      }
    });
  }
};

module.exports = { 
  updatePayment
};