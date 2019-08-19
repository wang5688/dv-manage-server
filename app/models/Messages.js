const mongoose = require('mongoose');
const { Schema } = mongoose;

const Messages = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  // 通知消息
  notices: [{
    type: Schema.Types.ObjectId,
    ref: 'Notice',
  }],
});

module.exports = mongoose.model('Messages', Messages);