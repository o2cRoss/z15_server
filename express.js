const express = require("express");
const app = express();

// 以下 配置允许跨域请求； **********一定要放在上面**********
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization, Accept,X-Requested-With')
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  res.header('X-Powered-By', ' 3.2.1')
  if (req.method == "OPTIONS") res.send(200);/*让options请求快速返回*/
  else next();
})

//中间件
//静态资源
app.use(express.static('public'));

//引入公共路由route模块
const mod = require("./public-router.js");
//加载模块
app.use("/mod", mod);


//配置ejs模板
app.set('views', './views');
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

//启动监听服务器
app.listen(3000, () => {
  console.log('Express server is running on 3000');
});