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
    let include = '';
    if(Authorization) {
      const slice = Authorization.slice(0, 7);
      if(Authorization && slice == 'Bearer ') {
        Authorization = Authorization.replace("Bearer ","");
      }
      try {
        const decoded = await verifyAsync(Authorization, JWT_SECRET);
        const user = await getLogin({ user_id: decoded.sub });
        if(!user || !user.token || Authorization != user.token) {
          Authorization = null;
        } else {
          include = [{ model: User }]
        }
      } catch(err) {
        Authorization = null;
      }

    }

    if(!q) throw {
      statusCode: 400,
      message: 'query param required' 
    }

    if(!offset) throw {
      statusCode: 400,
      message: 'offset param required' 
    }

    if(!limit) throw {
      statusCode: 400,
      message: 'limit param required' 
    }

    let query = `
      INSERT INTO searches(search_term) VALUES('${q}')
      ON CONFLICT(search_term) DO UPDATE SET search_term=EXCLUDED.search_term
      RETURNING id;
    `;
    let result = await executeQuery(query);

    query = `
      INSERT INTO counters(search_id, value) VALUES('${result['id']}', 1);
    `;
    await executeQuery(query);

    let  countQuery = `
      select count(inventories.id) as total_rows
      from inventories
      WHERE LOWER(part_number) LIKE '%' || LOWER('${q}') || '%'
    `;

    let count = await runQuery(countQuery);
    let { total_rows } = count[0] && count[0].total_rows ? count[0] : { total_rows: 0 };

    if(Authorization) {
      query = `
        select inventories.*, users.company_name, users.business_nature, users.country,
        users.city, users.state, users.company_address,
        users.email_address, 
        users.phone as phone_number
        from inventories 
        left outer join users on users.id = inventories.user_id
        WHERE LOWER(part_number) LIKE '%' || LOWER('${q}') || '%'
        offset ${offset}
        limit ${limit}
      `;
    } else {
      query = `
        select 
          id,
          part_number,
          description,
          date_code,
          brand_name,
          quantity_available,
          oem_excess,
          hot_offer,
          created_at,
          updated_at
        from inventories 
        WHERE LOWER(part_number) LIKE '%' || LOWER('${q}') || '%'
        offset ${offset}
        limit ${limit}
      `;
    }

    let inventories = await runQuery(query);
    result = {
      data: inventories,
      total_rows
    }
  
    return response(200, result);
  }
  catch (err) {
    console.log(err);
    let { statusCode, message } = err;   
    return response(statusCode || 500, { message } || { message: 'server error' });
  }}

module.exports = { handler }