const Koa = require('koa');
const app = new Koa();
const static = require('koa-static');
const koaBody = require('koa-body');
const jsonp = require('koa-jsonp');
const logger = require('koa-logger');
const session = require('koa-session');
const mongoose = require('mongoose');
const path = require('path');

// 设置静态文件目录
app.use(static(path.join(__dirname, './app/public')));
// 配置jsonp
app.use(jsonp());
app.use(koaBody({
  multipart: true, // 支持文件上传
  encoding: 'gzip',
  formidable: {
    uploadDir: path.join(__dirname, './app/upload'), // 设置文件上传目录
    keepExtensions: true, // 保持文件后缀名
    maxFieldsSize: 2 * 1024 * 1024, // 文件上传大小
    onFileBegin: (name, file) => {
      // 文件上传前的设置
    }
  }
}));
app.use(logger());
// 允许跨域
app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', 'http://localhost:8000');
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


// 连接数据库
mongoose.connect('mongodb://127.0.0.1:27017/dva_manage', { useNewUrlParser: true });
const db = mongoose.connection;

db.on('open', () => {
  // console.log('====数据库连接成功====');
});

app.listen(3002, () => {
  console.info('server is starting at http://localhost:3002');
});