const express = require('express');
const router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './upload')
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, file.originalname + '-' + Date.now())
  }
});
const upload = multer({ storage: storage });

router.get('/', (req, res) => {
  res.send("<h2>hello</h2>");
});

router.post('/upload', upload.single('file'), (req, res, next) => {

});
console.log("用户上传接口 --- ok");

router.get('/download', (req, res) => {
  res.download('./public/tmp.js');
});
console.log("用户下载接口 --- ok");

module.exports = router;
