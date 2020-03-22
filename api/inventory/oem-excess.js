const response = require('../../helpers/utils/response');
const { runQuery } = require('../../helpers/db/query');
const { groupBy } = require('../../helpers/utils/parse-utils');
const { getUser } = require('../../helpers/user/get');

const handler = async (event, context) => {
  
  try {

    const user_id = event.requestContext.authorizer.principalId;

    const user = await getUser({ id: user_id });
    if(!user) throw { 
      statusCode: 400, 
      message: 'invalid user' 
    };

    let { offset, limit, order } = event.queryStringParameters;

    if(!limit) {
      limit = 10;
    }
    if(!offset) {
      offset = 0;
    }

    let usersQuery = `
      SELECT user_id FROM ( 
        SELECT DISTINCT ON(user_id) * 
        FROM inventories
        WHERE oem_excess = true
        ORDER BY user_id, updated_at DESC 
      ) t
      ORDER BY updated_at DESC
    `;

    usersQuery += `
      offset ${offset}
      limit ${limit}
    `;

    let users = await runQuery(usersQuery);
    let includeUsers = '';
    if(users.length > 0) {
      includeUsers += `AND ( i.user_id = '${users[0].user_id}'`;
      for(let i = 1; i < users.length; i++) {
        includeUsers += ` OR i.user_id = '${users[i].user_id}'`
      }
      includeUsers += `)`;
    }

    let  countQuery = `
      select count(DISTINCT inventories.user_id) as total_rows 
      from inventories 
      where oem_excess = true
    `;

    let count = await runQuery(countQuery);
    let { total_rows } = count[0] && count[0].total_rows ? count[0] : { total_rows: 0 };

    let query = `
      SELECT i.id, i.part_number, i.description, i.date_code, i.brand_name, i.quantity_available, 
      i.updated_at as updated_at, users.id as user_id, users.company_name, users.company_address, 
      users.city, users.state,
      users.country, users.email_address, users.phone as phone_number, users.business_nature, users.user_profile_image
      FROM inventories i
      inner join users on users.id = i.user_id
      WHERE (i.oem_excess = true) 
        ${includeUsers}
      ORDER BY updated_at DESC
    `;

    let products = await runQuery(query);
    data = groupBy(products, ['user_id'])
    return response(200, { data , total_rows });

  }
  catch (err) {
    console.log(err);
    let { statusCode, message } = err;   
    return response(statusCode || 500, { message } || { message: 'server error' });
  }}

module.exports = { handler }