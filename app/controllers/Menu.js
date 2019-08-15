/**
 * 菜单相关
 * @type {[type]}
 */
const router = require('koa-router')();
const Base = require('../common/base');
const MenuSchema = require('../models/Menu');
const moment = require('moment');

const formatData = (data) => {
  if (!data) return {};

  const {
    id, pid, path, guid, disabled, status, icon, params,
    create_name, create_time, create_user,
    update_name, update_time, update_user,
  } = data;

  return {
    id,
    pid,
    path,
    guid,
    params,
    disabled,
    status,
    icon,
    status,
    disabled,
    create_name,
    create_user,
    create_time: moment(create_time).format('YYYY-MM-DD HH:mm:ss'),
    update_name,
    update_user,
    update_time: moment(create_time).format('YYYY-MM-DD HH:mm:ss'),
  };
};

class Menu extends Base {

  list = async (ctx) => {
    const menu = await MenuSchema.find();
    const result = {};

    if (!menu) {
      result['code'] = -1;
      result['msg'] = 'failed';
    } else {
      result['code'] = 0;
      result['msg'] = 'success';
      result['data'] = menu.map((t) => formatData(t));
    }
    ctx.body = result;
  }

  create = async (ctx) => {
    const params = ctx.request.method === 'GET' ? ctx.query : ctx.request.body;

    // 判断唯一标识
    if (!params.guid) {
      ctx.body = {
        code: 101,
        msg: '缺少唯一标识',
      };
      return;
    } else {
      const menu = await MenuSchema.findOne({ guid: params.guid });
      if (menu) {
        ctx.body = {
          code: 102,
          msg: '菜单已存在，请重新提交',
        };
        return;
      }
    }

    const user = ctx.userInfo;
    await MenuSchema.create({
      id: await this.getId('menuId'),
      pid: params.pid || 0,
      path: params.path,
      labe: params.label,
      guid: params.guid,
      icon: params.icon,
      create_user: user.user_id,
      create_name: user.user_name,
    });

    ctx.body = {
      code: 0,
      msg: 'success',
    };
  }
}

const routes = new Menu();
router.all('/add', routes.create);
router.all('/list', routes.list);

module.exports = router;
