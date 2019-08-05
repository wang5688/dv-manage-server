const requireAll = require('require-all');
const path = require('path');
const router = require('koa-router')();

// 引入controllers中的文件，挂载路由
const controllers = requireAll({ dirname: path.resolve(__dirname, '../controllers') });

Object.keys(controllers).forEach(name => {
  const route = controllers[name];

  if (route && route !== undefined) {
    router.use(`/${name.toLowerCase()}`, route.routes(), route.allowedMethods());
  }
});

module.exports = router;