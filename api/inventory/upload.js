const response = require('../../helpers/utils/response'); 
const xlsx = require('node-xlsx').default;
const { createInventories } = require('../../helpers/inventory/create'); 
const { parseBody } = require('../../helpers/utils/parse-multipart');
const { getUser } = require('../../helpers/user/get');
const { getInventories } = require('../../helpers/inventory/get');
const { getSubscription } = require('../../helpers/subscription/get');
const parseCsv = require('csv-parse')
const util = require('util');
const parseCsvPromise = util.promisify(parseCsv);

const stringToBoolean =  (str) => {
  switch(str.toString().toLowerCase().trim()){
    case "true": case "yes": case "1": return true;
    case "false": case "no": case "0": case null: return false;
    default: return Boolean(str);
  }
}

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const id = event.requestContext.authorizer.principalId;
  try {

    const body = Buffer.from(event.body, 'base64').toString('binary');
    const result = parseBody(body, event);
    let filename = result['xls']['filename']; 
    let extension = filename.split('.');
    extension = extension[extension.length-1];

    if(extension != 'xlsx' &&  extension != 'xls' && extension != 'csv') throw {
      statusCode: 400,
      message: 'only csv, xls and xlsx files are allowed'
    }

    let rows;

    if(extension == 'xlsx' || extension == 'xls') {
      const workSheetsFromBuffer = xlsx.parse(result['xls']['content']);
      rows = workSheetsFromBuffer[0].data;
    }

    if(extension == 'csv') {
      //parse csv
      rows = await parseCsvPromise(result['xls']['content'].toString(), {comment: '#'});
    }

    rows.shift();
    const inventories = [];

    const user = await getUser({ id });

    if(!user) throw { 
      statusCode: 404, 
      message: 'user not found' 
    };

    const oem_user = user['dataValues']['oem'];

    rows.forEach(row => {
      if(row[0] && row[1] && row[2]) {
        const data = {
          part_number: row[0].toString().trim(),
          quantity_available: row[1],
          brand_name: row[2].toString().trim(),
          date_code: row[3] ? row[3] : null,
          description: row[4] ? row[4].toString().trim() : null,
          hot_offer: row[5] ? stringToBoolean(row[5]): false,
          oem_excess: oem_user && row[6] ?stringToBoolean(row[6]): false,
          user_id: id
        }
        inventories.push(data);
      }
    });

    const subscription = await getSubscription({ id: user['dataValues']['subscription_id'] });

    let existingInventories = await getInventories({ user_id: id });    

    let limit = 0;
    if(isNaN(subscription['dataValues']['inventory_limit'])) {
      limit = 10000000000;
    } else {
      limit = Number(subscription['dataValues']['inventory_limit'])
    }

    if(limit < existingInventories.length + inventories.length) throw {
      statusCode: 429,
      message: 'limit exceeded'
    }

    await createInventories(inventories, id);

    return response(200, { message: 'success' });
  }
  catch (err) {
    console.log(err);
    let { statusCode, message } = err;   
    return response(statusCode || 500, { message } || { message: 'server error' });
  }}

module.exports = { handler }