/**
 * 用户相关
 */
const router = require('koa-router')();
const moment = require('moment');
const Base = require('../common/base');
const UserModel = require('../models/User');
const tools = require('../utils/tools');

async function checkLogin(ctx, next) {
  if (!ctx.session.uid) {
    ctx.body = {
      code: -1,
      msg: '用户未登录',
    };
    console.log(222)
  } else {
    await next();
  }
}

class UserController extends Base {
  constructor() {
    super();
    this.rules = {
      account: {
        reg: /^[0-9a-zA-Z_]{6,20}$/,
        required: true,
        message: '账号校验不通过'
      },
      password: {
        reg: /^[\w\d]{6,20}$/,
        required: true,
        message: '密码校验未通过'
      },
      email: {
        reg: /^[\w\d]+@[\w\d]+\.[\w\d]+$/,
        required: true,
        message: '邮箱地址校验未通过',
      },
      mobile: {
        reg: /^1[3578][0-9]{9}$/,
        required: false,
        message: '手机号校验未通过',
      },
    };
  }

  /**
   * 创建账号
   * @param {String} account 账号
   * @param {String} password 密码
   * @param {String} email 邮箱
   */
  create = async (ctx, next) => {
    const params = ctx.request.method === 'GET' ? ctx.query : ctx.body;

    const { account, password, email, mobile } = params;
    
    if (!/^[0-9a-zA-Z_]{6,20}$/.test(account)) {
      ctx.body = {
        code: -1,
        msg: '账号格式错误，账号支持6-20位',
      };
    } else if (!/^[\w\d]{6,20}$/.test(password)) {
      ctx.body = {
        code: -1,
        msg: '密码格式错误，密码支持6-20位',
      };
    } else {
      // 验证用户名是否存在
      if (await UserModel.findOne({ account })) {
        ctx.body = {
          code: 2,
          msg: '用户名已存在',
        };
      } else {
        const userId = await this.getId('userId');
        const newPass = tools.encryption(password);
        const now = moment().format('YYYY-MM-DD HH:mm:ss');

        // 写入数据库
        await UserModel.create({
          account,
          password: newPass,
          email,
          mobile,
          user_name: `用户-${userId}`,
          user_id: userId,
          id: userId,
          role: '2',
          ctime: now,
        });
        ctx.body = {
          code: 0,
          msg: '创建成功',
        };
      }
    }
  }

  /**
   * 用户登录
   * @param {String} account 
   * @param {String} password
   */
  login = async (ctx, next) => {
    const params = ctx.request.method === 'GET' ? ctx.query : ctx.body;
    
    if (!params.account) {
      ctx.body = {
        code: -1,
        msg: '请输入账号',
      };
    } else if (!params.password) {
      ctx.body = {
        code: -1,
        msg: '请输入密码',
      };
    } else {
      // 查询用户是否存在
      const user = await UserModel.findOne({ account: params.account });
      if (!user) {
        ctx.body = {
          code: 101,
          msg: '账号不存在',
        };
      } else if (user.status != '0') {
        ctx.body = {
          code: 102,
          msg: '账号被冻结，请联系管理员',
        };
      } else if (tools.encryption(params.password) !== user.password) {
        ctx.body = {
          code: 1,
          msg: '密码错误',
        };
      } else {
        // 登录成功，存储session
        ctx.session.uid = user.user_id;
        // 设置已登录cookie login: 1-已登录 0-未登录
        ctx.cookies.set('lg', 1, {
          domain: 'localhost',
          path: '/',
          maxAge: 86400000 * 7, // 有效时长
          expires: new Date(moment().add(7, 'd')), // 过期时间
          httpOnly: false,
          overwrite: false,
        });
        ctx.body = {
          code: 0,
          msg: '登录成功',
        };
      }
    }
  }

  async getUserInfo(ctx) {
    const session = ctx.session;

    if (!session || !session.uid) {
      ctx.body = {
        code: -1,
        msg: '用户未登录',
      };
    } else {
      const user = await UserModel.findOne({ user_id: session.uid });
      if (!user) {
        ctx.body = {
          code: 1,
          msg: '未获取到用户信息',
        };
      } else if (user.status != '0') {
        ctx.body = {
          code: 101,
          msg: '账号被冻结，请联系管理员',
        };
      } else {
        ctx.body = {
          code: 0,
          msg: '成功',
          data: user
        };
      }
    }
  }
}

const routes = new UserController();
router.all('/getUserInfo', routes.getUserInfo);
router.all('/create', routes.create);
router.all('/login', routes.login);

module.exports = router;