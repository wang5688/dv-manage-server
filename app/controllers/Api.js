const router = require('koa-router')();
const { COUNTRY, CITY } = require('../constants/country');

class Api {

  country = async (ctx) => {
    ctx.body = {
      code: 0,
      msg: 'success',
      data: COUNTRY,
    };
  }

  city = async (ctx) => {
    ctx.body = {
      code: 0,
      msg: 'success',
      data: CITY,
    };
  };
}

const routes = new Api();
router.all('/country_list', routes.country);
router.all('/city_list', routes.city);

module.exports = router;

