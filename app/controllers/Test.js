const router = require('koa-router')();

class Test {

  check = async (ctx, next) => {
    return new Promise((resolve) => {
      console.log(222)
    });
  }


  main = async(ctx, next) => {
    await this.check(ctx, next);
    console.log(111)
    ctx.body = '123';
  }
}

const test = new Test();
router.get('/', test.main);

module.exports = router;
