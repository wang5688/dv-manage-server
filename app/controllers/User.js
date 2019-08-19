/**
 * 用户相关
 */
const router = require('koa-router')();
const moment = require('moment');
const Base = require('../common/base');
const UserModel = require('../models/User');
const tools = require('../utils/tools');
const Joi = require('@hapi/joi');

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
    const params = ctx.request.method === 'GET' ? ctx.query : ctx.request.body;

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
      } else if (params.password !== user.password) {
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

  /**
   * 修改密码
   * @param {String} account
   * @param {String} password
   * @memberof UserController
   */
  async resetPass(ctx) {
    const params = ctx.request.method === 'GET' ? ctx.query : ctx.request.body;
    const { account, password } = params;
    const result = {};

    if (!account) {
      result['code'] = -1;
      result['msg'] = '请输入账号';
    } else if (!password) {
      result['code'] = -1;
      result['msg'] = '请输入密码';
    }
    const user = await UserModel.findOne({ account });
    if (!user) {
      result['code'] = 101;
      result['msg'] = '账号不存在';
    }

    await UserModel.findOneAndUpdate({ account }, { $set: { password } });
    result['code'] = 0;
    result['msg'] = '修改成功';
    ctx.body = result;
  }

  /**
   * 修改账号信息
   * @param {*} ctx
   */
  async modify(ctx) {
    const params = ctx.request.method === 'GET' ? ctx.query : ctx.request.body;
    // 允许修改的字段
    const ACCEPT = [
      'email',
      'mobile',
      'user_name',
      'description',
      'country',
      'city',
      'head_icon',
    ];
    if (!params.uid) {
      ctx.body = {
        code: 101,
        msg: '用户uid丢失',
      };
      return;
    }

    Object.keys(params).forEach(async (key) => {
      if (ACCEPT.indexOf(key) > -1 && params[key]) {
        await UserModel.findOneAndUpdate({ user_id: params.uid }, {
          $set: {
            [key]: params[key],
            muid: ctx.session.uid,
            muser: ctx.userInfo.user_name,
            mtime: moment(),
          },
        });
      }
    });
    ctx.body = {
      code: 0,
      msg: 'success',
    };
  }

  /**
   * 冻结、解冻账号
   * @param {Number} uid
   * @param {Number} status
   */
  frozen = async (ctx) => {
    const params = ctx.request.method === 'GET' ? ctx.query : ctx.request.body;

    // 参数校验
    const valid = Joi.object().keys({
      uid: Joi.number().required(),
      status: Joi.string().valid('0', '1').required(),
    });
    
    try {
      const result = {};
      const values = await this.validate(valid, params);
      // 判断当前账号是否为超管账号
      if (ctx.userInfo.role != 1) {
        result['code'] = 101;
        result['msg'] = '该账号没有相关操作权限';
      } else if (!await UserModel.findOne({ user_id: values.uid })) {
        result['code'] = 102;
        result['msg'] = '账号不存在';
      } else {
        await UserModel.findOneAndUpdate({ user_id: values.uid }, {
          $set: {
            status: values.status,
            mtime: moment().format('YYYY-MM-DD HH:mm:ss'),
            muid: ctx.session.uid,
            muser: ctx.userInfo.user_name,
          },
        });
        result['code'] = 0;
        result['msg'] = '成功';
      }
      ctx.body = result;
    } catch (e) {
      console.log(e);
      ctx.body = {
        code: -1,
        msg: '参数校验未通过',
      };
    }
  }

  /**
   * 获取用户信息
   * @return {Object}
   */
  async getUserInfo(ctx) {
    const session = ctx.session;
    const user = await UserModel.findOne({ user_id: session.uid }, {
      password: 0,
      __v: 0,
      _id: 0,
    });

    ctx.body = {
      code: 0,
      msg: '成功',
      data: user,
    };
  }

  /**
   * 用户列表
   * @param {String} limit 每次查询条数
   * @param {String} page 页数
   * @param {String} username 用户名
   * @param {String} user_id 用户id
   * @param {String} email 用户邮箱
   * @param {String} mobile 用户手机号
   */
  userList = async (ctx) => {
    const params = ctx.request.method === 'GET' ? ctx.query : ctx.request.body;
    const { limit = 10, page = 1, user_name = '', user_id = '', email = '', mobile = '' } = params;
    // 查询条件
    const offset = limit * (page - 1);
    const conditions = {};
    if (user_id) {
      conditions['user_id'] = user_id;
    }
    if (user_name) {
      conditions['$or'] = [{ user_name: { $regex: user_name } }];
    }
    if (email) {
      conditions['$or'] = [{ email: { $regex: email } }];
    }
    if (mobile) {
      conditions['$or'] = [{ mobile: { $regex: mobile } }];
    }
    
    // 返回的数据不包括的字段
    const exclude = {
      password: 0, // 0不包括该字段 1仅包括该字段
      _id: 0,
    };

    // 数据总长度
    const total = await UserModel.countDocuments(conditions);
    const list = await UserModel.find(conditions, exclude).sort({ id: -1 }).limit(+limit).skip(+offset);
    ctx.body = {
      code: 0,
      msg: 'success',
      data: {
        total,
        list,
      },
    };
  }

  /**
   * 用户权限管理
   */
  permission = async (ctx) => {

  }
}

const routes = new UserController();
router.all('/getUserInfo', routes.getUserInfo);
router.all('/user_list', routes.userList);

router.all('/create', routes.create);
router.all('/login', routes.login);
router.all('/modify', routes.modify);
router.all('/resetpass', routes.resetPass);

router.all('/frozen', routes.frozen);

module.exports = router;
