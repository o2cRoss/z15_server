//定义SQL查询命令

//查询整个表数据
let livedataSQL = {
  query: 'SELECT * FROM livedata'
};

//根据ID查询
const queryUserID = id => {
  return 'SELECT * FROM livedata WHERE id=' + id
};

//查询用户
const queryUser = user => {
  return 'SELECT id FROM users WHERE username=\'' + user + '\''
};

//登录
const loginUser = (user, password) => {
  return 'SELECT * FROM users WHERE username=\'' + user + '\' and password=\'' + password +'\''
}

//注册用户
const registerUser = (user,password,power) => {
  return 'INSERT INTO users (username, password, power, reg_time, lastlogin_time) VALUES (\''+user+'\', \''+password+'\','+ power +',NOW(),NOW())'
}

exports.queryUser = queryUser;
exports.livedataSQL = livedataSQL;
exports.queryUserID = queryUserID;
exports.registerUser = registerUser;
exports.loginUser = loginUser;