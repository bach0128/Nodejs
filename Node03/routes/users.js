var express = require("express");
var router = express.Router();

const userController = require("../controller/user.controller");
const { User, Phone, Post, Course } = require("../models/index");

/* GET users listing. */
router.get("/", userController.index);

router.get("/add", userController.add);
router.post("/add", userController.handleAdd);

router.get("/login", userController.login);
router.post("/login", userController.handleLogin);

router.get("/edit/:id", userController.edit);
router.post("/edit/:id", userController.handleEdit);

router.post("/delete/:id", userController.delete);

// router.get("/test-assoc", async (req, res) => {
//   // lấy dữ liệu liên kết --> lấy instance
//   //  vd: Từ user --> lấy phone --> lấy được instance của user
//   // const user = await User.findOne({
//   //   where: { id: 1 },
//   //   include: {
//   //     model: Post,
//   //     as: "posts",
//   //   },
//   // });
//   // const phone = await user.getPhone(); // magic method

//   // const phone2 = await Phone.findByPk(2);
//   // const user2 = await phone.getUser();

//   // const posts = await user.getPosts();
//   // const posts = await Post.findAll({
//   //   include: User,
//   // });

//   const user = await User.findOne({
//     where: { id: 1 },
//     include: {
//       model: Course,
//       as: "courses",
//     },
//   });

//   res.json({ user });
// });

module.exports = router;
