const { Inventory } = require('../db/models/inventory');
const { generateUUID } = require('../../helpers/utils/uuid');

const createInventory = async inventory => {
  inventory.id = generateUUID();
  return await Inventory.create(inventory);
};

const createInventories = async (inventories, user_id) => {
  inventories.forEach(inventory => {
    inventory.id = generateUUID();
    inventory.user_id = user_id;
  });
  return await Inventory.bulkCreate(inventories);
};

module.exports = { 
  createInventory,
  createInventories
};