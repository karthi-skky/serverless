const response = require('../../helpers/utils/response');
const { runQuery } = require('../../helpers/db/query');

const handler = async (event, context) => {
  
  context.callbackWaitsForEmptyEventLoop = false;

  try {

    if(!event.queryStringParameters) throw {
      statusCode: 400,
      message: 'query param required' 
    }

    let { limit } = event.queryStringParameters;

    if(!limit) throw {
      statusCode: 400,
      message: 'limit query param required' 
    }

    let  countQuery = `
      select count(id) as total_rows
      from searches 
    `;

    let count = await runQuery(countQuery);
    let { total_rows } = count[0];

    let query = `
      select 
        searches.search_term as search_term,
        sum(counters.value) as hits
      from searches 
      left outer join counters on counters.search_id = searches.id
      group by searches.id
      order by hits DESC
      limit ${limit}
    `;
    let inventories = await runQuery(query);

    const result = {
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