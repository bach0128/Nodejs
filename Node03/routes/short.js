var express = require("express");
var router = express.Router();

const shortController = require("../controller/short.controller");

router.get("/", shortController.index);
router.post("/", shortController.addUrl);

router.get("/edit/:id", shortController.edit);
router.post("/edit/:id", shortController.handleEdit);

router.post("/delete/:id", shortController.delete);

module.exports = router;
