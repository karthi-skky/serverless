const subscriptions = require('../../api/subscription/list').handler;
const { db } = require('../../helpers/db/postgres');

afterAll(async () => {
  await db.close()
});

test('get subscriptions', async () => {
  const result = await subscriptions({}, {});
  expect(result['statusCode']).toBe(200);
  const body = JSON.parse(result['body']);
  expect(body).toBeDefined();
  expect(body).toBeInstanceOf(Array);
});    