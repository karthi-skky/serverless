const response = require('../../helpers/utils/response');
const { Sequelize } = require('../../helpers/db/postgres');
const Op = Sequelize.Op;
const { User } = require('../../helpers/db/models/user');
const { getInventories } = require('../../helpers/inventory/get');
const { sendOEMExcess } = require('../../helpers/inventory/send_oem_excess_notification');

const handler = async (event, context) => {
  try {
    let list = await getInventories({ 
        oem_excess: true, 
        created_at: {
            [Op.lt]: new Date(),
            [Op.gt]: new Date(new Date() - 24 * 60 * 60 * 1000)
        }}, null, [{model: User, required: true}]);
    console.log("list ", list.length);
    if(list.length) {
      const emails = await sendOEMExcess(list);
      return response(200, { emails });
    } else {
      return response(204, {});
    }
  }
  catch (err) {
    console.log(err);
    let { statusCode, message } = err;   
    return response(statusCode || 500, { message } || { message: 'server error' });
  }
}

module.exports = { handler }