//定义SQL查询命令

// //查询整个表数据
// let livedataSQL = {
//   query: 'SELECT * FROM livedata'
// };

// //根据ID查询
// const queryUserID = id => {
//   return 'SELECT * FROM livedata WHERE id=' + id
// };

const queryUser = user => {
  return 'SELECT id FROM users WHERE username=' + user
}

exports.queryUser = queryUser;
// exports.livedataSQL = livedataSQL;
// exports.queryUserID = queryUserID;