const crypto = require('crypto');

const tools = {};

/**
 * md5转换
 * @param {String} str
 * @return {String}
 */
tools.md5 = (str) => {
  return crypto.createHash('md5');
};

/**
 * 密码加密
 * @param {String} str
 * @return {String}
 */
tools.encryption = (str) => {
  function Md5(password) {
    var md5 = crypto.createHash('md5');
    return md5.update(password).digest('base64');
  }

  return Md5(Md5(str).substr(2, 7) + Md5(str));
};

module.exports = tools;