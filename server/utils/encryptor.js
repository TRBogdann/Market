const encryptor = (function () {
  const bcrypt = require("bcrypt");
  const rounds = 10;

  async function encryptPassword(password) {
    const salt = await bcrypt.genSalt(rounds);
    const hassedPass = await bcrypt.hash(password, salt);
    return hassedPass;
  }

  async function check(password, hash) {
    const result = await bcrypt.compare(password, hash);
    return result;
  }

  return {
    hashPassword: encryptPassword,
    checkPassword: check,
  };
})();

module.exports = encryptor;
