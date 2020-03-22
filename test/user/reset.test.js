const reset = require('../../api/user/reset').handler;
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

let event = {
  requestContext: {
    authorizer: {
      principalId: testValidCredentials.user_id
    }
  }
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
  event.requestContext.authorizer.principalId = testValidCredentials.user_id;
  event.body = JSON.stringify({password: 'notsosecret'});
  await login({body: JSON.stringify(testValidCredentials)}, {});
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

test('reset password', async () => {
  
  let result = await reset(event, {});
  
  expect(result['statusCode']).toBe(200);
  let body = JSON.parse(result['body']);
  expect(body).toBeDefined();
  expect(body).toHaveProperty('message');
  expect(body['message']).toBe('success');

  result = await login({body: JSON.stringify(testValidCredentials)}, {});
  expect(result['statusCode']).toBe(401);
  body = JSON.parse(result['body']);
  expect(body).toBeDefined();
  expect(body).toHaveProperty('message');
  expect(body['message']).toBe('login failed');

  testValidCredentials.password = 'notsosecret';
  result = await login({body: JSON.stringify(testValidCredentials)}, {});
  expect(result['statusCode']).toBe(200);
  body = JSON.parse(result['body']);
  expect(body).toBeDefined();
  expect(body).toHaveProperty('token');

});    
