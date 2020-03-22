const sendMail = require('../mail/send');
const { getUsers } = require('../user/get');
const { oemExcessTemplate } = require('../mail/oem-excess-template');
const { SENDER_EMAIL } = require('../../config/config.json');

const oemTemplate = (name, inventories) => {
  let template = '';
  inventories.forEach(inventory => template += `
    <tr>
    <td>${inventory.part_number}</td>
    <td>${inventory.brand_name}</td>
    <td>${inventory.date_code}</td>
    <td>${inventory.quantity_available}</td>
    <td>${inventory.user.company_name}</td>
    <td>${inventory.user.email_address}</td>
    </tr>
  `);
  return oemExcessTemplate(name, template);
}

const sendOEMExcess = async list => {
  // list = list.map(inventory => {
  //   inventory.email_address = inventory.user.email_address;
  //   return inventory;
  // });
  // list = groupBy(list, 'email_address');

  let users = await getUsers({
    status: 'active'
  });
  //users = users['dataValues'];
  console.log('all users', users, users.length);
  //console.log('list', list);

  // const emails = Object.keys(list);
  for(let i = 0; i < users.length; i++) {
    try {
      let user = users[i];
      let name = user.first_name+' '+user.last_name;

      const result = await sendMail(SENDER_EMAIL, user.email_address, 'OEM excess available', `OEM Excess available ${list}`, oemTemplate(name, list));
      console.log(result);
    } catch(err) {
      console.log(err);
    }
  }
  

  return Object.keys(list);
};

module.exports = { sendOEMExcess };