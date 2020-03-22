const crypto = require("crypto")
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

const generateUUID = (callback) => {
  if (typeof callback !== "function") {
    var rnd = crypto.randomBytes(16);
    rnd[6] = (rnd[6] & 0x0f) | 0x40;
    rnd[8] = (rnd[8] & 0x3f) | 0x80;
    rnd = rnd.toString("hex").match(/(.{8})(.{4})(.{4})(.{4})(.{12})/);
    rnd.shift();
    return rnd.join("-");
  }
  crypto.randomBytes(16, function(err, rnd) {
    if (err) return callback(err);
    try {
      rnd[6] = (rnd[6] & 0x0f) | 0x40;
      rnd[8] = (rnd[8] & 0x3f) | 0x80;
      rnd = rnd.toString("hex").match(/(.{8})(.{4})(.{4})(.{4})(.{12})/);
      rnd.shift();
      return callback(null, rnd.join("-"));
    } catch (err2) {
      return callback(err2);
    }
  });
}

const isUUID = uuid => uuidPattern.test(uuid);

module.exports = {
  generateUUID,
  isUUID
};