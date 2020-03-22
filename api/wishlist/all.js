const response = require('../../helpers/utils/response');
const { runQuery } = require('../../helpers/db/query');
const { groupBy } = require('../../helpers/utils/parse-utils');

const handler = async (event, context) => {
  
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const user_id = event.requestContext.authorizer.principalId;
    let { q, offset, limit, order } = event.queryStringParameters;

    if(!offset) throw {
      statusCode: 400,
      message: 'offset param required' 
    }

    if(!limit) throw {
      statusCode: 400,
      message: 'limit param required' 
    }

    let usersQuery = `
      SELECT user_id FROM ( 
        SELECT DISTINCT ON(user_id) * 
        FROM wishlists
        WHERE user_id != '${user_id}'
        ORDER BY user_id, created_at DESC 
      ) t
      ORDER BY created_at DESC
    `;

    // if(q) {
    //   usersQuery += ` AND LOWER(users.first_name) LIKE '%' || LOWER('${q}') || '%'`
    // }
    usersQuery += `
      offset ${offset}
      limit ${limit}
    `;

    let users = await runQuery(usersQuery);
    let includeUsers = '';
    if(users.length > 0) {
      includeUsers += `wishlists.user_id = '${users[0].user_id}'`;
      for(let i = 1; i < users.length; i++) {
        includeUsers += ` OR wishlists.user_id = '${users[i].user_id}'`
      }
    }

    let  countQuery = `
      select count(DISTINCT wishlists.user_id) as total_rows 
      from wishlists 
      where user_id != '${user_id}'
    `;
    // if(q) {
    //   countQuery += ` AND LOWER(users.first_name) LIKE '%' || LOWER('${q}') || '%'`
    // }

    let count = await runQuery(countQuery);
    let { total_rows } = count[0] && count[0].total_rows ? count[0] : { total_rows: 0 };

    let query = `
      SELECT wishlists.id, wishlists.part_number, wishlists.brand_name,       wishlists.notes, wishlists.quantity, 
      wishlists.created_at as created_at,users.id as user_id, users.first_name, users.company_name, users.company_address, users.business_nature, users.user_profile_image
      FROM wishlists
      inner join users on users.id = wishlists.user_id
      WHERE
        ${includeUsers}
      ORDER BY created_at DESC
    `;

    let products = [];
    if(users.length > 0){
      products = await runQuery(query);
      products = groupBy(products, ['user_id'])
    }
     
    return response(200, { products , total_rows });
  }
  catch (err) {
    console.log(err);
    let { statusCode, message } = err;   
    return response(statusCode || 500, { message } || { message: 'server error' });
  }}

module.exports = { handler }