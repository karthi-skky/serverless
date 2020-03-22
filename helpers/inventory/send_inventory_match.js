const sendMail = require('../mail/send');
const { groupBy } = require('../utils/parse-utils');
const { inventoryMatchTemplate } = require('../mail/inventory-match-template');
const { wishlistMatchTemplate } = require('../mail/wishlist-match-template');
const { SENDER_EMAIL } = require('../../config/config.json');

const buyerTemplate = (inventories) => {
  let template = '';
  let buyer_name = inventories[0].buyer_name;
  inventories.forEach(inventory => 
    template += `<tr>
    <td>${inventory.seller_company_name}</td>
    <td>${inventory.seller_country}</td>
    <td>${inventory.seller_email}</td>
    <td>${inventory.part_number}
    <td>${inventory.brand_name}</td>
    <td>${inventory.date_code}</td>
    <td>${inventory.quantity_available}</td></tr>
  `);
  console.log("inventory match ", template)
  return inventoryMatchTemplate(buyer_name, template);
}

const sellerTemplate = (inventories) => {
  let template = '';
  let seller_name = inventories[0].seller_name;
  inventories.forEach(inventory => 
    template += `<tr>
    <td>${inventory.buyer_company_name}</td>
    <td>${inventory.buyer_email}</td>
    <td>${inventory.w_part_number}
    <td>${inventory.w_brand_name}</td>
    <td>${inventory.w_quantity}</td>
    <td>${inventory.notes}</td></tr>
  `);
  console.log("template", template);
  return wishlistMatchTemplate(seller_name, template);
}

const sendInventoryMatch = async list => {

  let list_by_buyer = groupBy(list, 'buyer_id');
  const buyers = Object.keys(list_by_buyer);
  for(let i = 0; i < buyers.length; i++) {
    try {
      let buyer_id = buyers[i];
      let email_address = list_by_buyer[buyer_id][0].buyer_email;
      const result = await sendMail(SENDER_EMAIL, email_address, 'Your "Want to Buy" item is available', `Your "Want to Buy" item is available ${list_by_buyer[buyer_id]}`, buyerTemplate(list_by_buyer[buyer_id]));
      console.log(result);
    } catch(err) {
      console.log(err);
    }
  }

  let list_by_seller = groupBy(list, 'seller_id');
  const sellers = Object.keys(list_by_seller);
  for(let i = 0; i < sellers.length; i++) {
    try {
      let seller_id = sellers[i];
      let email_address = list_by_seller[seller_id][0].seller_email;
      const result = await sendMail(SENDER_EMAIL, email_address, 'Someone wants to buy your Inventory item', `Someone wants to buy your Inventory item ${list_by_seller[seller_id]}`, sellerTemplate(list_by_seller[seller_id]));
      console.log(result);
    } catch(err) {
      console.log(err);
    }
  }
  return Object.keys(list);
};

module.exports = { sendInventoryMatch };