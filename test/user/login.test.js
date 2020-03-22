const login = require('../../api/user/login').handler;
const { createUser, createLogin } = require('../../helpers/user/create');
const { Login } = require('../../helpers/db/models/login');
const { User } = require('../../helpers/db/models/user');
const { generateUUID } = require('../../helpers/utils/uuid');
const { addDays } = require('../../helpers/utils/date');
const { db } = require('../../helpers/db/postgres');

const testEmail = `test@${generateUUID()}.com`;


let testValidUser = {
  email_address: testEmail,
  first_name: 'John',
  last_name: 'Smith',
  oem: true,
  status: 'active',
  subscription_end_date: addDays(30)
}

let testValidCredentials = {
  email_address: testEmail,
  password: 'topsecret',
  login_id: testEmail
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

  const user = await createUser(testValidUser);
  testValidCredentials.user_id = user['dataValues'].id;
  await createLogin(testValidCredentials);
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
 
  await db.close()
});

test('login ok ', async () => {
  const result = await login({body: JSON.stringify(testValidCredentials)}, {});
  expect(result['statusCode']).toBe(200);
  const body = JSON.parse(result['body']);
  expect(body).toBeDefined();
  expect(body).toHaveProperty('token');
});    

test('login failed invalid password', async () => {
  const result = await login({body: JSON.stringify({email_address: testEmail, password: 'invalid'})}, {});
  expect(result['statusCode']).toBe(401);
  const body = JSON.parse(result['body']);
  expect(body).toBeDefined();
  expect(body).toHaveProperty('message');
  expect(body['message']).toBe('login failed');
});  

test('login failed no password provided - login failed', async () => {
  const result = await login({body: JSON.stringify({email_address: testEmail})}, {});
  expect(result['statusCode']).toBe(401);
  const body = JSON.parse(result['body']);
  expect(body).toBeDefined();
  expect(body).toHaveProperty('message');
  expect(body['message']).toBe('login failed');
});  


test('login failed unknown email provided - invalid user  ', async () => {
  const result = await login({body: JSON.stringify({email_address: generateUUID()})}, {});
  expect(result['statusCode']).toBe(401);
  const body = JSON.parse(result['body']);
  expect(body).toBeDefined();
  expect(body).toHaveProperty('message');
  expect(body['message']).toBe('invalid user');
});  

test('login failed no email invalid user  ', async () => {
  const result = await login({body: JSON.stringify({})}, {});
  expect(result['statusCode']).toBe(401);
  const body = JSON.parse(result['body']);
  expect(body).toBeDefined();
  expect(body).toHaveProperty('message');
  expect(body['message']).toBe('invalid user');
}); 
