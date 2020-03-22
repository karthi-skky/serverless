const { Search } = require('../db/models/search');

const createSearch = async search => await Search.create(search);
const createCounter = async counter => await Search.create(search);


module.exports = { createSearch };