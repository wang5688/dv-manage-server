const router = require('koa-router')();
const ArticalModel = require('../models/Article');
const MsgModel = require('../models/Messages');
const notice = require('../common/notice');
const Joi = require('@hapi/joi');
const schema = Joi.object().keys({
  username: Joi.string().min(3).max(6).required(),
  name: Joi.string(),
}).without('username', 'name');

class Test {

  check = async (ctx, next) => {
    return new Promise((resolve) => {
      console.log(222)
    });
  }


  main = async(ctx, next) => {
    const params = ctx.query;

    const user = ctx.userInfo;

    const article = new ArticalModel({ title: 'test===========', content: 'content', user });
    article.save();
    // await ArticalModel.create({
    //   title: 'test-title',
    //   content: 'content',
    // });
    // ctx.body = {
    //   code: 0,
    // };
  }

  get = async (ctx) => {
    ctx.body = {
      // data: await Msg.find().populate({ path: 'user', select: 'user_id user_name -_id' }),
      data: await MsgModel.find().populate([{ path: 'notices' }, { path: 'user', select: 'user_id -_id', match: { user_id: 2 } }],),
    };
  }

  notice = async (ctx) => {
    notice.sendNotice(3, { title: '测试消息', summary: '222222222222' });
  }
}

const test = new Test();
router.get('/', test.main);
router.get('/get', test.get);
router.get('/notice', test.notice);

module.exports = router;
