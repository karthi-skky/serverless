const { Wishlist } = require('../db/models/wishlist');

const getWishlist = async where => {
  return await Wishlist.findOne({
    where
  });
};

const getWishlists = async (where, order, include, limit, offset) => {
  return await Wishlist.findAll({where, order, include, limit, offset});
};

const countWishlist = async where => {
  return await Wishlist.count({ where });
}

module.exports = { 
  getWishlist,
  getWishlists,
  countWishlist
};