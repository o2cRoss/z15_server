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

//查询实时数据接口
router.post('/nowdata', (req, res) => {
  //console.log(req.fields);//提交的表格内容在fields字段

  mypool.pool.getConnection((err, connection) => {
    connection.query(mypool.querySQL.AllStations(req.fields.stations), (err, result) => {
      if(err){
        console.log("cuowu1");
        console.log(mypool.querySQL.AllStations(req.fields.stations));
      }else{
        mypool.responseJSON(res, result);
      }
      connection.release();
    });
  });
});
console.log("   01、实时数据接口准备完成.");

//获取设备中文名称接口
router.post('/getcn', (req, res) => {
  console.log(req.fields);//提交的表格内容在fields字段

  mypool.pool.getConnection((err, connection) => {
    connection.query(mypool.querySQL.GetDeviceCN(), (err, result) => {
      if(err){
        console.log("cuowu1");
        console.log(mypool.querySQL.AllStations());
      }else{
        mypool.responseJSON(res, result);
      }
      connection.release();
    });
  });
});
console.log("   02、设备中文接口准备完成.");

console.log("002、数据处理模块加载完毕...");
module.exports = router;