const { Wishlist } = require('../db/models/wishlist');
const { generateUUID } = require('../../helpers/utils/uuid');

const createWishlist = async wishlist => {
  wishlist.id = generateUUID();
  await Wishlist.create(wishlist);
  return wishlist.id;
};

const createWishlists = async (wishlists, user_id) => {
  wishlists.forEach(wishlist => {
    wishlist.id = generateUUID();
    wishlist.user_id = user_id;
  });
  return await Wishlist.bulkCreate(wishlists);
};

module.exports = { 
  createWishlist,
  createWishlists
};