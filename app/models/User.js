/**
 * 账号相关
 */
const mongoose = require('mongoose');
const { Schema } = mongoose;
const tools = require('../utils/tools');

const UserSchema = new Schema({
  account: String, // 账号
   // 密码
  password: {
    type: String,
    default: tools.encryption('abc123'), // 默认密码abc123
  },
  email: String,
  mobile: String,
  user_name: String,
  user_id: Number, // 用户id
  role: Number, // 账号角色 1-超管 2-管理员 3-普通账号
  id: Number,
  head_icon: {
    type: String,
    default: '/images/avatar.png',
  },
  // 账号状态
  status: {
    type: String,
    default: '0', // 0启用 1冻结
  },
  ctime: {  type: String,  default: '0000-00-00 00:00:00' },
  cuid: { type: Number, default: 0 },
  cuser: { type: String, default: '' },
  mtime: {  type: String,  default: '0000-00-00 00:00:00' },
  muid: { type: Number, default: 0 },
  muser: { type: String, default: '' },
});

module.exports = mongoose.model('User', UserSchema);

