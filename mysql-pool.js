//引入mysql组件
const mysql = require('mysql');
//加载mysql配置
const dbConfig = require('./db/DBConfig');
//加载查询命令
const querySQL = require('./db/querysql');
//根据配置创建一个mysql连接池
let pool = mysql.createPool(dbConfig.mysql);
//JSON数据 应答
let responseJSON = (res, ret) => {
  if (typeof ret == 'undefined') {
    res.json({ code: "-200", msg: "操作失败" });
  } else {
    res.json(ret);
  }
};

exports.pool = pool;
exports.responseJSON = responseJSON;
exports.querySQL = querySQL;