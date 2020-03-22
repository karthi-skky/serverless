const { updateUser } = require('../user/update');
const { getUser } = require('../user/get');

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

const handler = async (event, context) => {
  const { notificationType, bounce }  = JSON.parse(event.Records[0].body);
  if(notificationType == 'Bounce' && bounce.bounceType == 'Permanent') {
    await asyncForEach(bounce.bouncedRecipients, async ({ emailAddress }) => {
      let user = await getUser({ email_address: emailAddress });
      user['dataValues'].status = 'inactive';
      await updateUser(user['dataValues']);
    });
  }
}

module.exports = { handler }