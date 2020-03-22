const { generateUUID, isUUID } = require('../helpers/utils/uuid');

test('valid guid', () => {
  expect(isUUID('2c3913c4-bde1-4b3c-ab80-7cfdd1a86d2e')).toBe(true);
});

test('invalid guid', () => {
  expect(isUUID('sss-sss-sssss-sssss')).toBe(false);
});

test('generate guid', () => {
  const guid = generateUUID();
  expect(isUUID(guid)).toBe(true);
})