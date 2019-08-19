/**
 * 发送系统消息
 */
const MsgModel = require('../models/Messages');
const NoticeModel = require('../models/Notice');
const UserModel = require('../models/User');
const Base = require('../common/base');

class Notice extends Base {

  /**
   * 发送通知
   */
  sendNotice = async (uid, { type = 0, title, summary, icon }) => {
    return new Promise(async (resolve, reject) => {
      if (!uid) return;
      const user = await UserModel.findOne({ user_id: uid });
      if (!user) {
        reject(new Error('用户不存在'));
        return;
      }
      
      // 存储消息
      const message = new MsgModel({
        user,
      });
      message.save().then(async (data) => {
        const notice = new NoticeModel({
          id: await this.getId('noticeId'),
          type,
          title,
          summary,
          system: {
            icon,
          },
          pdate: Date.now(),
        });
        // 存储notice
        await notice.save();
        message.notices.push(notice);
        message.save();
      });
      
      // notice.save().then((data) => {
      //   // 按用户id存入message内
      //   const messages = new MsgModel({
      //     user,
      //     messages: 
      //   });
      //   console.log(await NoticeModel.find())
      // });
    });
  }
}

module.exports = new Notice();