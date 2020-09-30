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

//获取所有用户
const AllUsers = (start, end) => {
  return 'SELECT id,username,power,reg_time,lastlogin_time FROM users LIMIT ' + start + ', ' + end
}

//删除用户
const delUser = (id) => {
  return 'DELETE FROM users WHERE id=' + id
}
exports.queryUser = queryUser;
exports.livedataSQL = livedataSQL;
exports.queryUserID = queryUserID;
exports.registerUser = registerUser;
exports.loginUser = loginUser;
exports.AllUsers = AllUsers;
exports.delUser = delUser;