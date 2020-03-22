const Razorpay = require('razorpay');
const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = require('../../config/config.json');

const getInstance = () => {
    return new Razorpay({
        key_id: RAZORPAY_KEY_ID,
        key_secret: RAZORPAY_KEY_SECRET
    });
}

const fetchPayment = (paymentId) => {
    let instance = getInstance();
    return instance.payments.fetch(paymentId);
}

module.exports = { fetchPayment };