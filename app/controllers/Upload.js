const router = require('koa-router')();

class Upload {

  upload = async (ctx, next) => {
    console.log(ctx.body)
    ctx.body = 123;
  }
}

const routes = new Upload();
router.post('/', routes.upload);

module.exports = router;