const express = require('express');
const router = express.Router();

//解析使用 才有fields字段
const bodyParser = require('body-parser');
const formidableMiddleware = require('express-formidable');

router.use(bodyParser.json());
// 创建 application/x-www-form-urlencoded 编码解析
router.use(bodyParser.urlencoded({ extended: false }));
router.use(formidableMiddleware());

//mysql
const mysql = require('mysql');
//加载mysql配置
const dbConfig = require('./db/DBConfig');
//加载查询命令条
const querySQL = require('./db/querysql');
//根据配置创建一个mysql连接池
let pool = mysql.createPool(dbConfig.mysql);
//响应JSON数据
let responseJSON = function (res, ret) {
  if (typeof ret == 'undefined') {
    res.json({ code: "-200", msg: "操作失败" });
  } else {
    res.json(ret);
  }
};

//测试数据库用
router.get('/test', (req, res) => {
  pool.getConnection((err, connection) => {
    console.log(req.query);
    connection.query('SELECT * FROM livedata', (err, result) => {
      responseJSON(res, result);
      connection.release();
    });
  });
});
console.log("用户数据查询接口 --- ok");

//用户表单提交
router.post('/', (req, res) => {
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


console.log("用户模块加载完毕");
module.exports = router;