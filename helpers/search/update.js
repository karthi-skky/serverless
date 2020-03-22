const { Search } = require('../db/models/search');

const updateSearch = async search => await Search.update(search, {where: { id: search.id }});

module.exports = { 
  updateSearch
};