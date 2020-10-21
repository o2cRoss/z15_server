const express = require('express');
const router = express.Router();

//解析使用 才有fields字段
const bodyParser = require('body-parser');
const formidableMiddleware = require('express-formidable');

router.use(bodyParser.json());
// 创建 application/x-www-form-urlencoded 编码解析
router.use(bodyParser.urlencoded({ extended: false }));
router.use(formidableMiddleware());

//加载mysql连接池模块
let mypool = require('./mysql-pool');
console.log("002、数据处理模块开始加载...");

//查询所有用户
router.post('/nowdata', (req, res) => {
  console.log(req.fields.user);//提交的表格内容在fields字段
  mypool.pool.getConnection((err, connection) => {
    connection.query(mypool.querySQL.AllUsers(req.fields.start, req.fields.end), (err, result) => {
      if(err){
        console.log("cuowu");
        console.log(mypool.querySQL.AllUsers(req.fields.start, req.fields.end));
      }else{
        mypool.responseJSON(res, result);
        console.log(result);
        console.log(mypool.querySQL.AllUsers(req.fields.start, req.fields.end));
      }
      connection.release();
    });
  });
});
console.log("   04、用户列表接口准备完成.");

console.log("002、数据处理模块加载完毕...");
module.exports = router;