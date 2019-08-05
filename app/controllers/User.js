/**
 * 用户相关
 */
const router = require('koa-router')();

class UserController {
  constructor() {

  }

  async info(ctx, next) {
    ctx.body = {
      code: 0
    };
  }
}

const routes = new UserController();
router.all('/info', routes.info);

module.exports = router;