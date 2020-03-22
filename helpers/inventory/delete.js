const { Inventory } = require('../db/models/inventory');

const deleteInventory = async where => {
  return await Inventory.destroy({ where })
};

module.exports = { 
  deleteInventory
};