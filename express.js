const express = require("express");
const path = require('path');
const bodyParser = require('body-parser');
const formidableMiddleware = require('express-formidable');
const multer = require("multer");
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

app.use(bodyParser.json());
// 创建 application/x-www-form-urlencoded 编码解析
app.use(bodyParser.urlencoded({ extended: false }));
app.use(formidableMiddleware());



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './upload')
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, file.originalname + '-' + Date.now())
  }
});
const upload = multer({ storage: storage });
//中间件
//静态资源 文件处理
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send("<h2>hello</h2>");
});

app.post('/upload', upload.single('file'), (req, res, next) => {

});

app.post('/test', (req, res) => {
  console.log(req.fields.user);// contains non-file fields
  let right_info = new Object();
  if (req.fields.user == 'zjhl' && req.fields.password == 'zjhl') {

    right_info.user = 'wuguotao';
    right_info.token = '257';
    right_info.Date = '2020.09.15';
    right_info.right = true;

  } else {
    right_info.right = false;
    right_info.token = '0';
    right_info.Date = '2020.09.15';
  }
  res.send(right_info);
});

app.get('/download', (req, res) => {
  res.download('./public/tmp.js');
});

//配置ejs模板
app.set('views', './views');
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

app.listen(3000, () => {
  console.log('Express server is running on 3000');
});