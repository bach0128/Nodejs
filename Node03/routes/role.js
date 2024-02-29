var express = require("express");
var router = express.Router();

const roleController = require("../controller/role.controller");
const permission = require("../middlewares/permission.middleware");

router.get("/", permission("user.read"), roleController.index);

router.get("/add", permission("user.create"), roleController.create);
router.post("/add", permission("user.create"), roleController.handleCreate);

router.get("/edit/:id", permission("user.edit"), roleController.edit);
router.post("/edit/:id", permission("user.edit"), roleController.handleEdit);

router.post("/delete/:id", permission("user.delete"), roleController.delete);

router.get(
  "/permission/:id",
  permission("role.edit"),
  roleController.permission
);
router.post(
  "/permission/:id",
  permission("user.edit"),
  roleController.handleSetRoleForUser
);

// router.get("/", roleController.index);

// router.get("/add", roleController.create);
// router.post("/add", roleController.handleCreate);

// router.get("/edit/:id", roleController.edit);
// router.post("/edit/:id", roleController.handleEdit);

// router.post("/delete/:id", roleController.delete);

module.exports = router;
