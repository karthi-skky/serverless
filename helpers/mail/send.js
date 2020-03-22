const nodemailer = require('nodemailer');
const util = require('util');
const { MAIL } = require('../../config/config.json')

const send = async (from, to, subject, text, html) => {

  let transporter = nodemailer.createTransport(MAIL);
  transporter.sendMail = util.promisify(transporter.sendMail);

  let mailOptions = {
    from, 
    to, 
    subject,
    text, 
    html 
  };
  console.log("sendMail", from, to, html);
  return await transporter.sendMail(mailOptions);
}

module.exports = send;