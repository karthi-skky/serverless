const { Wishlist } = require('../db/models/wishlist');

const deleteWishlist = async where => {
  return await Wishlist.destroy({ where })
};

module.exports = { 
  deleteWishlist
};