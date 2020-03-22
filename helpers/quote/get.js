const { Quote } = require('../db/models/quote');

const getQuote = async where => {
  return await Quote.findOne({
    where
  });
};

const getQuotes = async (where, order, include, limit, offset) => {
  return await Quote.findAll({where, order, include, limit, offset});
};

module.exports = { 
  getQuote,
  getQuotes
};