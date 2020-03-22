const response = require('../../helpers/utils/response');
const { runQuery } = require('../../helpers/db/query');

const handler = async (event, context) => {
  
  context.callbackWaitsForEmptyEventLoop = false;

  try {

    let result = {};
    let  usersCountQuery = `
      select count(*) as total_rows 
      from users 
    `;
    let usersCount = await runQuery(usersCountQuery);
    result.usersCount = usersCount[0] && usersCount[0].total_rows ? usersCount[0].total_rows : 0;

    let inventoriesCountQuery = `
      select count(*) as total_rows
      from inventories
    `;
    let inventoriesCount = await runQuery(inventoriesCountQuery);
    result.inventoriesCount = inventoriesCount[0] && inventoriesCount[0].total_rows ? inventoriesCount[0].total_rows : 0;

    let quotesCountQuery = `
      select count(*) as total_rows
      from quotes
    `;
    let quotesCount = await runQuery(quotesCountQuery);
    result.quotesCount = quotesCount[0] && quotesCount[0].total_rows ? quotesCount[0].total_rows : 0;

    let wishlistsCountQuery = `
      select count(*) as total_rows
      from wishlists
    `;
    let wishlistsCount = await runQuery(wishlistsCountQuery);
    result.wishlistsCount = wishlistsCount[0] && wishlistsCount[0].total_rows ? wishlistsCount[0].total_rows : 0;

    let paymentsCountQuery = `
      select count(*) as total_rows
      from payments
    `;
    let paymentsCount = await runQuery(paymentsCountQuery);
    result.paymentsCount = paymentsCount[0] && paymentsCount[0].total_rows ? paymentsCount[0].total_rows : 0;

    return response(200, result);
  }
  catch (err) {
    console.log(err);
    let { statusCode, message } = err;   
    return response(statusCode || 500, { message } || { message: 'server error' });
  }}

module.exports = { handler }