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
  email: {
    type: String,
    default: '',
  },
  mobile: {
    type: String,
    default: '',
  },
  user_name: String,
  description: {
    type: String,
    default: '',
  },
  city: {
    type: String,
    default: '',
  },
  country: {
    type: String,
    default: '',
  },
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
  ctime: {  type: Date,  default: Date.now },
  cuid: { type: Number, default: 0 },
  cuser: { type: String, default: '' },
  mtime: {  type: Date,  default: '' },
  muid: { type: Number, default: 0 },
  muser: { type: String, default: '' },
  // notice: [{ type: Schema.types.ObjectId, ref: 'Notice' }], // 通知消息
  // coments: [{}], // 评论消息
}, {
  versionKey: false,
  timeStamps: { createAt: 'ctime', updateAt: 'mtime' }
});

module.exports = mongoose.model('User', UserSchema);
