/**
 * 检查是否登录
 */
const UserModel = require('../models/User');
const EXCLUDE = [
  '/user/login',
  '/user/logout',
  '/api/country_list',
  '/api/city_list',
];

const check = async (ctx, next) => {
  let url = ctx.request.url;

  const index = EXCLUDE.findIndex((t) => t === url);
  // 不需要检查的请求
  if (index > -1) {
    await next();
  } else {
    const session = ctx.session;
    const user = await UserModel.findOne({ user_id: session.uid });
    let result = { code: -1, msg: 'failed' };

    if (!session || !session.uid) {
      result['code'] = -1;
      result['msg'] = '用户未登录';
    } else if (!user) {
      result['code'] = -2;
      result['msg'] = '账号不存在';
    } else if (user.status !== '0') {
      result['code'] = -3;
      result['msg'] = '账号被冻结，请联系管理员';
    } else {
      ctx.userInfo = user;
      result = null;
    }
    if (result) {
      ctx.body = result;
    } else {
      await next();
    }
  }
};

module.exports = check;