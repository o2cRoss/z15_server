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

//检查用户是否存在
router.post('/checkuser', (req, res) => {
  console.log(req.fields.user);
  mypool.pool.getConnection((err, connection) => {
    connection.query(mypool.querySQL.queryUser(req.fields.user), (err, result) => {
      if(err){
        console.log("cuowu");
        console.log(mypool.querySQL.queryUser(req.fields.user));
      }else{
        mypool.responseJSON(res, result);
      }
      connection.release();
    });
  });
});
console.log("用户数据查询接口 --- ok");

//注册用户
router.post('/register', (req, res) => {
  console.log(req.fields.user);
  mypool.pool.getConnection((err, connection) => {
    connection.query(mypool.querySQL.registerUser(req.fields.user, req.fields.password, req.fields.power), (err, result) => {
      if(err){
        console.log("cuowu1");
        console.log(mypool.querySQL.registerUser(req.fields.user, req.fields.password, req.fields.power));
      }else{
        mypool.responseJSON(res, result);
      }
      connection.release();
    });
  });
});

//用户登陆接口
router.post('/login', (req, res) => {
  console.log(req.fields.user);//提交的表格内容在fields字段
  mypool.pool.getConnection((err, connection) => {
    connection.query(mypool.querySQL.loginUser(req.fields.user, req.fields.password), (err, result) => {
      if(err){
        console.log("cuowu");
        console.log(mypool.querySQL.loginUser(req.fields.user, req.fields.password));
      }else{
        mypool.responseJSON(res, result);
        console.log(result);
        console.log(mypool.querySQL.loginUser(req.fields.user, req.fields.password));
      }
      connection.release();
    });
  });
});

//查询所有用户
router.post('/allusers', (req, res) => {
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

//根据id删除用户
router.post('/deluser', (req, res) => {
  console.log(req.fields.user);//提交的表格内容在fields字段
  mypool.pool.getConnection((err, connection) => {
    connection.query(mypool.querySQL.delUser(req.fields.id), (err, result) => {
      if(err){
        console.log("cuowu");
        console.log(mypool.querySQL.delUser(req.fields.id));
      }else{
        mypool.responseJSON(res, result);
        console.log(result);
        console.log(mypool.querySQL.delUser(req.fields.id));
      }
      connection.release();
    });
  });
});
//测试数据库用 公司服务器z06获取当前设备
router.get('/test', (req, res) => {
  mypool.pool.getConnection((err, connection) => {
    console.log(req.query);
    connection.query(mypool.querySQL.queryUserID(req.query.id), (err, result) => {
      mypool.responseJSON(res, result);
      connection.release();
    });
  });
});

//用户登陆接口
router.post('/', (req, res) => {
  console.log(req.fields.user);//提交的表格内容在fields字段
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