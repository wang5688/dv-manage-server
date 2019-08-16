const router = require('koa-router')();
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
    const result = schema.validate(ctx.query);
    console.log(result.error)
    
    if (!result.error) {
      ctx.body = {
        code: 1
      };
    } else {
      ctx.body = '123';
    }
    
  }
}

const test = new Test();
router.get('/', test.main);

module.exports = router;
