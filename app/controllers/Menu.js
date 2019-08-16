/**
 * 菜单相关
 * @type {[type]}
 */
const router = require('koa-router')();
const Base = require('../common/base');
const MenuSchema = require('../models/Menu');
const moment = require('moment');
const Joi = require('@hapi/joi');

class Menu extends Base {

  list = async (ctx) => {
    const menu = await MenuSchema.find({}, { _id: 0, createdAt: 0, updatedAt: 0 });
    const result = {};

    if (!menu) {
      result['code'] = -1;
      result['msg'] = 'failed';
    } else {
      result['code'] = 0;
      result['msg'] = 'success';
      result['data'] = menu;
    }
    ctx.body = result;
  }

  /**
   * 添加菜单
   */
  create = async (ctx) => {
    const params = ctx.request.method === 'GET' ? ctx.query : ctx.request.body;
    // 公共参数校验
    const rules = Joi.object().keys({
      // id: Joi.number().integer().required(),
      pid: Joi.number().integer().min(0).default(0),
      path: Joi.string().required(),
      guid: Joi.string().regex(/^[a-zA-Z_]+$/).required(),
      status: Joi.string().valid('0', '1').default('0'),
      disabled: Joi.string().valid('0', '1').default('0'),
      icon: Joi.string(),
    });
    
    try {
      const result = await this.validate(rules, params);
      const menu = await MenuSchema.findOne({ guid: result.guid });

      if (menu) {
        ctx.body = {
          code: 102,
          msg: 'guid已存在',
        };
        return;
      }

      const user = ctx.userInfo;
      // 存入数据库
      await MenuSchema.create({
        id: await this.getId('menuId'),
        pid: result.pid || 0,
        path: result.path,
        labe: result.label,
        guid: result.guid,
        icon: result.icon,
        create_user: user.user_id,
        create_name: user.user_name,
      });

      ctx.body = {
        code: 0,
        msg: 'success',
      };
    } catch (e) {
      console.log(e);
      ctx.body = {
        code: -1,
        msg: '参数校验未通过',
      };
    }
  }

  /**
   * 修改
   */
  update = async (ctx, next) => {
    const params = ctx.request.method === 'GET' ? ctx.query : ctx.request.body;

    // 公共参数校验
    const rules = Joi.object().keys({
      id: Joi.number().integer().required(),
      pid: Joi.number().integer().min(0).default(0),
      path: Joi.string().required(),
      status: Joi.string().valid('0', '1').default('0'),
      disabled: Joi.string().valid('0', '1').default('0'),
      icon: Joi.string(),
      position: Joi.string().default('0'),
    });

    try {
      const values = await this.validate(rules, params);
      let result = { code: -1, msg: 'failed' };

      if (!await MenuSchema.find({ id: values.id })) {
        result['msg'] = '未找到菜单';
      } else {
        await MenuSchema.findOneAndUpdate({ id: values.id }, {
          $set: values,
        });
        result['code'] = 0;
        result['msg'] = 'success';
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
}

const routes = new Menu();
router.all('/create', routes.create);
router.all('/update', routes.update);
router.all('/list', routes.list);

module.exports = router;
