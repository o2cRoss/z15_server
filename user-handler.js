const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const formidableMiddleware = require('express-formidable');

router.use(bodyParser.json());
// 创建 application/x-www-form-urlencoded 编码解析
router.use(bodyParser.urlencoded({ extended: false }));
router.use(formidableMiddleware());

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