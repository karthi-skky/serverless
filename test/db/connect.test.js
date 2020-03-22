const { db } = require('../../helpers/db/postgres');

test('open db connection', async done => {
  await db.authenticate();
  done();
});    

test('close db connection', async done => {
  await db.close();
  done();
});    
