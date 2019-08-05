/**
 * 存储id
 */
const mongoose = require('mongoose');
const { Schema } = mongoose;

const IdSchema = new Schema({
  // 用户id
  userId: {
    type: Number,
    default: 1,
  },
});

const Id = mongoose.model('Ids', IdSchema);
// 设置初始值
Id.findOne((err, id) => {
  if (!id) {
    const newId = new Id({
      userId: 1,
    });

    newId.save();
  }
});

module.exports = Id;