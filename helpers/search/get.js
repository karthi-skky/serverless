const { Search } = require('../db/models/search');

const getSearch = async where => {
  return await Search.findOne({
    where
  });
};

module.exports = { getSearch };