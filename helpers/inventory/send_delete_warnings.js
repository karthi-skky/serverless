const sendMail = require('../mail/send');
const { getUser } = require('../user/get');
const { deleteWarningOnScheduleTemplate } = require('../mail/delete-warning-on-schedule-template');
const { SENDER_EMAIL } = require('../../config/config.json');

const deleteInventoriesTemplate = (name, inventories) => {
  let template = '';
  inventories.forEach(inventory => template += `<tr><td>${inventory.part_number}</td> <td> ${inventory.quantity_available}</td></tr>`);

  return deleteWarningOnScheduleTemplate(name, template);
}


const groupBy = (xs, key) => 
  xs.reduce((rv, x) => {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});

const sendDeleteWarnings = async list => {
  list = list.map(inventory => {
    inventory.email_address = inventory.user.email_address;
    delete inventory.user;
    return inventory;
  });
  list = groupBy(list, 'email_address');
  const emails = Object.keys(list);
  for(let i = 0; i < emails.length; i++) {
    try {
      const email_address = emails[i];
      const user = await getUser({email_address});
      const name  = user['dataValues']['first_name'];
      const result = await sendMail(SENDER_EMAIL, email_address, 'Inventory Deletion Warning', `Inventories to be deleted ${list[email_address]}`, deleteInventoriesTemplate(name, list[email_address]));
      console.log(result);
    } catch(err) {
      console.log(err);
    }
  }
  

  return Object.keys(list);
};

module.exports = { sendDeleteWarnings };