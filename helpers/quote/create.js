const { Quote } = require('../db/models/quote');
const { generateUUID } = require('../../helpers/utils/uuid');

const createQuote = async quote => {
  quote.id = generateUUID();
  return await Quote.create(quote);
};

const createQuotes = async (quotes, user_id) => {
  quotes.forEach(quote => {
    quote.id = generateUUID();
    quote.user_id = user_id;
  });
  return await Quote.bulkCreate(quotes);
};

module.exports = { 
  createQuote,
  createQuotes
};