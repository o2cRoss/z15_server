const express = require("express");
const router = express.Router();
//相当于后台的路由，所有的后台处理都需要从这里经过

const user = require("./user-handler.js");
router.use("/user", user);
const data = require("./data-handler.js");
router.use("/data", data);
const file = require("./file-handler.js");
router.use("/file", file);

module.exports = router;