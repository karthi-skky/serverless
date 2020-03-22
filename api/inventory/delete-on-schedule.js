const response = require('../../helpers/utils/response');
const { deleteInventory } = require('../../helpers/inventory/delete');
const { DELETE_SCHEDULE_DAYS } = require('../../config/config.json');
const { Sequelize } = require('../../helpers/db/postgres');
const Op = Sequelize.Op;

const handler = async (event, context) => {
  
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    await deleteInventory({
      created_at: { [Op.lt]: new Date(new Date() - DELETE_SCHEDULE_DAYS * 24 * 60 * 60 * 1000) }
    });
    return response(200, {message: 'success'});
  }
  catch (err) {
    console.log(err);
    let { statusCode, message } = err;   
    return response(statusCode || 500, { message } || { message: 'server error' });
  }}

module.exports = { handler }