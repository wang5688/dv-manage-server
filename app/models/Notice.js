/**
 * 通知
 */
const mongoose = require('mongoose');
const { Schema } = mongoose;

// 通知消息 评论/回复消息 系统消息 待办消息
const Notice = new Schema({
  id: {
    type: Number,
    default: 0,
  },
  type: {
    type: String,
    required: true,
    default: '1', // 1系统消息 2评论通知 3待办通知
  },
  title: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    default: '',
  },
  is_read: {
    type: Number,
    default: 0, // 0未读 1已读
  },
  system: {
    icon: {
      type: String,
      default: '',
    },
  },
  // 扩展字段
  meta: {
    type: String,
    default: ''
  },
  pdate: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model('Notice', Notice);
