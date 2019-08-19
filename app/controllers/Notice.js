const router = require('koa-router')();
const Base = require('../common/base');

class Notice extends Base {
  constructor(props) {
    super(props);
  }


}

const routes = new Notice();

module.exports = router;