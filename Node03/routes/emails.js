var express = require("express");
var router = express.Router();

const emailController = require("../controller/email.controller");

/* GET emails listing. */
router.get("/", emailController.index);

router.get("/send", emailController.send);
router.post("/send", emailController.handleSend);

router.get("/detail/:id", emailController.detail);

router.post("/delete/:id", emailController.delete);

module.exports = router;
