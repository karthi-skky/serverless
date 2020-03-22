const { DateTime } = require('luxon');
const response = require('../../helpers/utils/response');
const { runQuery } = require('../../helpers/db/query');

const { sendInventoryMatch } = require('../../helpers/inventory/send_inventory_match');

const handler = async (event, context) => {
  try {
    let query = `SELECT i.user_id AS seller_id, u.company_name AS seller_company_name, u.country AS seller_country, CONCAT(u.first_name,' ',u.last_name) AS seller_name, u.email_address AS seller_email,
    i.part_number, i.description, i.date_code, i.brand_name, i.quantity_available, i.created_at, w.user_id AS buyer_id, us.company_name AS buyer_company_name,
    CONCAT(us.first_name,' ',us.last_name) AS buyer_name, us.email_address AS buyer_email, w.part_number AS w_part_number, w.quantity AS w_quantity,
    w.brand_name AS w_brand_name, w.notes
    FROM inventories AS i
    INNER JOIN wishlists AS w ON i.part_number = w.part_number
    INNER JOIN users AS u ON u.id = i.user_id
    INNER JOIN users AS us ON us.id = w.user_id
    WHERE (i.created_at < '${DateTime.local()}' AND i.created_at > '${DateTime.local().plus({ days: -1 })}');`;

    let list = await runQuery(query);
    console.log("list match ", list)
    const emails = await sendInventoryMatch(list);
    return response(200, { emails });
  }
  catch (err) {
    console.log(err);
    let { statusCode, message } = err;   
    return response(statusCode || 500, { message } || { message: 'server error' });
  }
}

module.exports = { handler }