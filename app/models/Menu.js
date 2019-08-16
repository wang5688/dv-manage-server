/**
 * 菜单schema
 */
const mongoose = require('mongoose');
const { Schema } = mongoose;

const MenuSchema = new Schema({
  id: Number,
  // 父级菜单id
  pid: {
    type: Number,
    default: 0
  },
  // 路径
  path: String,
  // 路由参数
  params: {
    type: String,
    default: '',
  },
  // 中文名
  label: String,
  // 唯一标识
  guid: String,
  // 是否禁用 0开启 1禁用
  disabled: {
    type: String,
    default: '0'
  },
  // 显示、隐藏
  status: {
    type: String,
    default: '0',
  },
  icon: {
    type: String,
    default: '',
  },
  // 排序用
  position: {
    type: String,
    default: 0,
  },
  create_user: {
    type: Number,
    default: 0,
  },
  create_name: {
    type: String,
    default: '',
  },
  create_time: {
    type: Date,
    default: Date.now,
  },
  update_user: {
    type: Number,
    default: 0,
  },
  update_name: {
    type: String,
    default: '',
  },
  update_time: {
    type: Date,
    default: Date.now,
  },
}, {
  versionKey: false,
  timestamps: { createAt: 'create_time', updateAt: 'update_time' }
});

module.exports = mongoose.model('Menu', MenuSchema);
