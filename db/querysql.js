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
const registerUser = (user,password,power,stations) => {
  return 'INSERT INTO users (username, password, power, stations, reg_time, lastlogin_time) VALUES (\''+user+'\', \''+password+'\','+ power +',\''+ stations +'\',NOW(),NOW())'
}

//获取所有用户
const AllUsers = (start, end) => {
  return 'SELECT id,username,power,reg_time,lastlogin_time FROM users LIMIT ' + start + ', ' + end
}

//删除用户
const delUser = (id) => {
  return 'DELETE FROM users WHERE id=' + id
}

//-------------------下面是数据方面的查询代码

//查询站点
const AllStations = (stations) =>{
  return 'SELECT * FROM nowdata WHERE station IN('+stations+')'
}

//获取设备中文名称
const GetDeviceCN = () =>{
  return 'SELECT * FROM devicelist'
}

exports.queryUser = queryUser;
exports.livedataSQL = livedataSQL;
exports.queryUserID = queryUserID;
exports.registerUser = registerUser;
exports.loginUser = loginUser;
exports.AllUsers = AllUsers;
exports.delUser = delUser;

exports.AllStations = AllStations;
exports.GetDeviceCN = GetDeviceCN;