const { Inventory } = require('../db/models/inventory');

const getInventory = async where => {
  return await Inventory.findOne({
    where
  });
};

const getInventories = async (where, order, include, limit, offset) => {
  return await Inventory.findAll({where, order, include, limit, offset});
};

const getHotOffers = async (where, order, include, limit, offset) => {
  return await Inventory.findAll({where, order, include, limit, offset});
};

const getOemExcess = async (where, order, include, limit, offset) => {
  return await Inventory.findAll({where, order, include, limit, offset});
};

const countInventory = async where => {
  return await Inventory.count({ where });
}


module.exports = { 
  getInventory,
  getInventories,
  getHotOffers,
  getOemExcess,
  countInventory
};