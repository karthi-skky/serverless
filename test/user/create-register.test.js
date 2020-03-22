const register = require('../../api/user/create-register').handler;
const { getSubscription } = require('../../helpers/subscription/get');
const { generateUUID } = require('../../helpers/utils/uuid');
const { User } = require('../../helpers/db/models/user');
const { Login } = require('../../helpers/db/models/login');
const { db } = require('../../helpers/db/postgres');

const testEmail = `test@${generateUUID()}.com`;

let testCredentials = {
  email_address: testEmail,
  password: 'topsecret',
  company_name: 'xyz',
  company_address: 'address',
  country: 'india',
  phone: '223434'
}

beforeAll(async () => {
  await Login.destroy({
    where: {
      login_id: testEmail
    }
  });
  await User.destroy({
    where: {
      email_address: testEmail
    }
  });
});

afterAll(async () => {
  await Login.destroy({
    where: {
      login_id: testEmail
    }
  });
  await User.destroy({
    where: {
      email_address: testEmail
    }
  });

  await db.close();
});

test('create-register APi - success', async () => {
  const subscription = await getSubscription({name: 'monthly'});
  testCredentials.subscription_id = subscription['dataValues']['id'];
  const event = {
    body: JSON.stringify(testCredentials)
  }
  const result = await register(event);
  const statusCode = result['statusCode'];
  const body = JSON.parse(result['body']);

  expect(statusCode).toBe(201);
  expect(body['message']).toBe('success');

});      

test('create-register API - email required', async () => {

  delete testCredentials.email_address;
  const event = {
    body: JSON.stringify(testCredentials)
  }
  const result = await register(event);
  const statusCode = result['statusCode'];
  const body = JSON.parse(result['body']);

  expect(statusCode).toBe(400);
  expect(body['message']).toBe('email_address required');

}); 