const express = require('express');
const axios = require('axios');
const qs = require('qs');
const router = express.Router();

const appKey = {
  appKey:'ff6a1565faf14ba58247273e63a88226',
  appSecret:'540693b486581293cf1762fa333a61c4'
};

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

//截取客户IP地址
var get_client_ip = function (req) {
  var ipStr = req.headers['x-forwarded-for'] ||
      req.ip ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress || '';
  var ipReg = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/;
  if (ipStr.split(',').length > 0) {
      ipStr = ipStr.split(',')[0]
  }
  var ip = ipReg.exec(ipStr);
  return ip[0];
};

var accessToken = null;
var expireTime = null;

//获取ysy的视频token和token生命周期
const getVedioToken = async function(){
  await axios
    .post('https://open.ys7.com/api/lapp/token/get',qs.stringify(appKey), {headers:{ 'Content-Type':'application/x-www-form-urlencoded'}})
    .then((res) => {
      //console.log(res.data.data);
      accessToken = res.data.data.accessToken;
      expireTime = res.data.data.expireTime;
      })
    .catch((err) => {
      console.log(err);
    });
}

//给客户端提供直播视频token接口
router.post('/getvediotoken', (req, res) => {
  //console.log(req.fields);//提交的表格内容在fields字段
  let clientIP = get_client_ip(req);
  let unix_stamp = new Date().getTime();
  
  if(accessToken == null || (unix_stamp > expireTime)){
    getVedioToken().then(()=>{
      console.log(`根据TOKEN生命周期,返回给客户端${clientIP}新的萤石云token`);
      mypool.responseJSON(res,{videoToken:accessToken});
    });
  }else{
    console.log(`返回给客户端${clientIP}live的萤石云token`);
    mypool.responseJSON(res,{videoToken:accessToken});
  }
});
console.log("   03、视频密钥接口准备完成.");

//查询历史数据接口
router.post('/history', (req, res) => {
  //console.log(req.fields);//提交的表格内容在fields字段

  mypool.pool.getConnection((err, connection) => {
    connection.query(mypool.querySQL.GetHistoryData(req.fields.stations,req.fields.strings,req.fields.starttime,req.fields.endtime), (err, result) => {
      if(err){
        console.log("cuowu1");
        console.log(mypool.querySQL.GetHistoryData(req.fields.stations,req.fields.strings,req.fields.starttime,req.fields.endtime));
      }else{
        mypool.responseJSON(res, result);
        //console.log(result);
      }
      connection.release();
    });
  });
});
console.log("   04、历史数据接口准备完成.");

console.log("002、数据处理模块加载完毕...");
module.exports = router;