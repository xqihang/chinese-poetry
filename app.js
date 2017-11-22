const Koa = require('koa');
const app = new Koa();
const fs = require('fs');
const render = require('koa-ejs');
const server = require('koa-static');
const path = require('path');

function randomArr(arr){
  return arr[parseInt(Math.random() * arr.length)];
}

app.use(server(__dirname + '/public/'));

render(app, {
  root: path.join(__dirname, 'views'),
  layout: 'template',
  viewExt: 'html',
  cache: false,
  debug: true
});

// x-response-time
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

// logger
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}`);
});

app.use(function (ctx, next) {
  ctx.state = ctx.state || {};
  ctx.state.now = new Date();
  ctx.state.ip = ctx.ip;
  ctx.state.version = '2.0.0';
  return next();
});

// response

app.use(async ctx => {

  var dataSource = ['chuci','cifu','gushi','shijing','songci','tangshi','yuefu'];

  var data = fs.readFileSync('public/data/' + randomArr(dataSource) +'.json','utf8');
  
  var randomData = randomArr( JSON.parse(data) );
  await ctx.render('content', {
    data: randomData
  });
});

app.listen(3000);