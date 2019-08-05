const Koa = require('koa');
const app = new Koa();
const static = require('koa-static');
const bodyParser = require('koa-bodyparser');
const jsonp = require('koa-jsonp');
const logger = require('koa-logger');
const session = require('koa-session');
const path = require('path');

// 设置静态文件目录
app.use(static(path.join(__dirname, 'public/static')));
// 配置jsonp
app.use(jsonp());
app.use(bodyParser());
app.use(logger());
// 跨域配置
app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*');
	ctx.set('Access-Control-Allow-Methods', '*');
	ctx.set('Access-Control-Allow-Headers', '*');
	ctx.set('Access-Control-Allow-Credentials', true);
	await next();
});

// session
app.keys = ['!@#$%^123456'];
const SESSION_CONFIG = {
  key: 'SESSION', // cookie key
  maxAge: 86400000 * 7, // cookie过期时间 默认1天
  overwrite: true, // 是否可以overwrite
  httpOnly: true, // 只有服务器端可以访问
  signed: true, // 签名默认true
	rolling: false, // 在每次请求时强行设置cookie，这将重置cookie过期时间
	renew: false, // 当会话过期时重新设置
};
app.use(session(SESSION_CONFIG, app));

const router = require('./app/router/index.js');
app.use(router.routes(), router.allowedMethods());


app.listen(3002, () => {
  console.info('server is starting at http://localhost:3002');
});