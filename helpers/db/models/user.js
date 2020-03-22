const { db, Sequelize } = require('../postgres');
const { UUIDV4, STRING, TEXT, BOOLEAN, TIME, DATE } = Sequelize;

const User = db.define('user', {
  id: {type: UUIDV4, primaryKey: true },
  status: STRING,
  subscription_id: UUIDV4,
  email_address: STRING,
  first_name: STRING,
  last_name: STRING,
  job_title: STRING,
  company_name: STRING,
  company_address: STRING,
  city: STRING,
  state: STRING, 
  zip_code: STRING,
  country: STRING,
  phone: STRING,
  fax: STRING,
  website: STRING,
  business_nature: TEXT,
  subscription_end_date: DATE,
  oem: BOOLEAN,
  user_profile_image: STRING,
  created_at: TIME,
  updated_at: TIME
}, {
  underscored: true,
});

module.exports = { User };