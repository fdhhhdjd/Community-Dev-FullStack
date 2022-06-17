const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

module.exports = {
  /**
   * from String template to URI
   * @author Nguyen Tien Tai
   *
   * @param {string} template
   * @param {object} data
   *
   * @returns {string}
   */
  //*Password Encryption
  async passwordEncryption(password, number) {
    return await bcrypt.hash(password, number);
  },
  comparePassword: (password_text, password_hash) => {
    return bcrypt.compare(password_text, password_hash);
  },
  //*Create AccessToken
  createAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: process.env.EXPIRES_ACCESS_TOKEN,
    });
  },
  //*Url navigate Login
  getURIFromTemplate(template, data) {
    const { userID, accessToken } = data;
    return eval("`" + template.replace(/`/g, "\\`") + "`");
  },
};
