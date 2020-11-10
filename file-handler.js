const express = require('express');
const axios = require('axios');
const qs = require('qs');
const router = express.Router();
const multer = require("multer");
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

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

//解析使用 才有fields字段...................
const bodyParser = require('body-parser');
const formidableMiddleware = require('express-formidable');

router.use(bodyParser.json());
// 创建 application/x-www-form-urlencoded 编码解析
router.use(bodyParser.urlencoded({ extended: false }));
router.use(formidableMiddleware());

//加载mysql连接池模块
let mypool = require('./mysql-pool');
//................
console.log("003、上传下载模块开始加载...");

router.get('/', (req, res) => {
  res.send("<h2>hello</h2>");
});

router.post('/upload', upload.single('file'), (req, res, next) => {

});
console.log("   01、日志上传接口准备完成.");

// router.get('/download', (req, res) => {
//   res.download('./public/tmp.js');
// });
//下载功能接口
router.post('/download', (req, res) => {
  let filename = req.fields.filename;
  let filepath = path.join(__dirname,'../z15_server/public/'+filename);
  console.log(filepath);
  let stats = fs.statSync(filepath);
  let b64name = Buffer.from(filename).toString('base64');
  if(stats.isFile()){
    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': 'attachment; filename=' + b64name,
      "Content-Length": stats.size
    });
    fs.createReadStream(filepath).pipe(res);
  }else{
    res.end(404);
  }
});
console.log("   02、excel文件下载接口准备完成.");

//删除功能接口
router.post('/delfile', (req, res) => {
  let filename = req.fields.filename;
  let filepath = path.join(__dirname,'../z15_server/public/'+filename);
  fs.unlink(filepath,(err)=>{
    if(err){
      console.log(err);
      mypool.responseJSON(res,{del:false});
      throw err;
    }
    mypool.responseJSON(res,{del:true});
  });
});
console.log("   03、excel文件删除接口准备完成.");

//字节转KB,MB,GB
function change(limit){
     let size = "";
      if(limit < 0.1 * 1024){                            //小于0.1KB，则转化成B
           size = limit.toFixed(2) + "B"
       }else if(limit < 0.1 * 1024 * 1024){            //小于0.1MB，则转化成KB
           size = (limit/1024).toFixed(2) + "KB"
       }else if(limit < 0.1 * 1024 * 1024 * 1024){        //小于0.1GB，则转化成MB
           size = (limit/(1024 * 1024)).toFixed(2) + "MB"
       }else{                                            //其他转化成GB
          size = (limit/(1024 * 1024 * 1024)).toFixed(2) + "GB"
      }
  
      let sizeStr = size + "";                        //转成字符串
      let index = sizeStr.indexOf(".");                    //获取小数点处的索引
      let dou = sizeStr.substr(index + 1 ,2)            //获取小数点后两位的值
      if(dou == "00"){                                //判断后两位是否为00，如果是则删除00                
          return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2)
      }
      return size;
  }

//获取可下载文件列表接口
const dir = path.join(__dirname,'../z15_server/public');
router.post('/getfilelist', (req, res) => {
 let files = fs.readdirSync(dir);
 let result = [];
 let statInfo = null;
 for(file of files){
   statInfo = fs.statSync(dir+'/'+file);
  
   result.push({'name':file,'lastname':file.substring(file.lastIndexOf('.')+1),'birthtime':statInfo.birthtime,'size':change(statInfo.size)});
 }
 mypool.responseJSON(res, result);
});
console.log("   04、可下载文件列表接口准备完成.");


//生成excel的代码部分
function FormatDateTime(UnixTime) {
  var a = UnixTime.replace("/Date(", "").replace(")/", "");
  var date = new Date(parseInt(a));
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  var d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  var h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  var minute = date.getMinutes();
  var second = date.getSeconds();
  minute = minute < 10 ? ('0' + minute) : minute;
  second = second < 10 ? ('0' + second) : second;
  return y + '' + m + '' + d + '' + h + '' + minute + '' + second;
};
const add = async (data, filePath, hasHeader) => {
  return new Promise(resolve => {
    const jsonWorkSheet = xlsx.utils.json_to_sheet(data, {skipHeader: hasHeader});
    const stream = xlsx.stream.to_csv(jsonWorkSheet);
    const writeS = fs.createWriteStream(filePath, {flags: 'a'});
    stream.pipe(writeS);
    stream.on('end', function() {
      resolve();
    });
  });
} 
async function hello(result,filepath) {
  let chunk = [];
  let num = 10000;
  let flag = false;
  while(result.length > 0) {
    chunk = result.splice(0,num);
    await add(chunk,filepath, flag);
    flag = true;
  }
}
//生成excel历史数据
router.post('/history2', (req, res) => {
  //console.log(req.fields);//提交的表格内容在fields字段

  mypool.pool.getConnection((err, connection) => {
    connection.query(mypool.querySQL.GetHistoryData1(req.fields.station,req.fields.starttime,req.fields.endtime), (err, result) => {
      if(err){
        console.log("cuowu1");
        console.log(mypool.querySQL.GetHistoryData1(req.fields.station,req.fields.starttime,req.fields.endtime));
      }else{
        //mypool.responseJSON(res, result);
        //console.log(result);
        let filepath = dir+'/'+req.fields.stationname+'_'+FormatDateTime(req.fields.starttime)+'_'+FormatDateTime(req.fields.endtime)+'.csv';
        hello(result,filepath).then(()=>{
          mypool.responseJSON(res, {done:true});
        }).catch((err)=>{
          console.log(err);
        })
      }
      connection.release();
    });
  });
});
console.log("   05、历史数据生成execel接口准备完成.");

console.log("003、上传下载模块加载完毕...");
module.exports = router;
