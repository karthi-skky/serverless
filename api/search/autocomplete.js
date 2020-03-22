const response = require('../../helpers/utils/response');
const { executeQuery, runQuery } = require('../../helpers/db/query');
const util = require('util');
const jwt = require('jsonwebtoken'); 
const verifyAsync = util.promisify(jwt.verify);
const { JWT_SECRET } = require('../../config/config.json');
const { getLogin } = require('../../helpers/user/get');
const { User } = require('../../helpers/db/models/user');

const handler = async (event, context) => {
  
  context.callbackWaitsForEmptyEventLoop = false;

  try {

    if(!event.queryStringParameters) throw {
      statusCode: 400,
      message: 'query param required' 
    }

    let { q, offset, limit, order } = event.queryStringParameters;
    let { Authorization } = event.headers;

    if(!offset) offset = 0;
    if(!limit) limit = 10;
    if(!order) order = 'order by part_number'

    if(Authorization) {
      const slice = Authorization.slice(0, 7);
      if(Authorization && slice == 'Bearer ') {
        Authorization = Authorization.replace("Bearer ","");
      }
      const decoded = await verifyAsync(Authorization, JWT_SECRET);
      const user = await getLogin({ user_id: decoded.sub });
      if(!user) throw 'unauthorized';
      include = [{ model: User }]
    }

    if(!q) throw {
      statusCode: 400,
      message: 'query param required' 
    }

    let query = `
      select part_number
      from inventories 
      WHERE LOWER(part_number) LIKE '%' || LOWER('${q}') || '%'
      ${order}
      offset ${offset}
      limit ${limit}
    `;
  
    const inventories = await runQuery(query);
    return response(200, inventories);
  }
  catch (err) {
    console.log(err);
    let { statusCode, message } = err;   
    return response(statusCode || 500, { message } || { message: 'server error' });
  }}

module.exports = { handler }