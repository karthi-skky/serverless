const response = require('../../helpers/utils/response');
const { Sequelize } = require('../../helpers/db/postgres');
const Op = Sequelize.Op;
const { User } = require('../../helpers/db/models/user')
const { DELETE_WARNING_SCHEDULE_DAYS } = require('../../config/config.json');
const { getInventories } = require('../../helpers/inventory/get');
const { sendDeleteWarnings } = require('../../helpers/inventory/send_delete_warnings');

const handler = async (event, context) => {
  try {
    let list = await getInventories({
      created_at: { [Op.lt]: new Date(new Date() - DELETE_WARNING_SCHEDULE_DAYS * 24 * 60 * 60 * 1000) }
    }, null, [{model: User, required: true}]);
    const emails = await sendDeleteWarnings(list);
    console.log(emails);
    return response(200, { emails });
  }
  catch (err) {
    console.log(err);
    let { statusCode, message } = err;   
    return response(statusCode || 500, { message } || { message: 'server error' });
  }
}

module.exports = { handler }