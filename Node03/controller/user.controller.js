const { User, Phone, Post, Course } = require("../models/index");
const { string, object } = require("yup");
const { Op, where } = require("sequelize");
const bcrypt = require("bcrypt");
const { name } = require("ejs");
const userTransformers = require("../core/transformer");
module.exports = {
  index: async (req, res, next) => {
    let filters = {};
    let users;

    const { status, keyword } = req.query;
    if (status === "active" || status === "inactive") {
      filters.status = status === "active";
    }
    if (keyword) {
      filters = {
        [Op.or]: {
          fullname: {
            [Op.iLike]: `%${keyword}%`,
          },
          email: {
            [Op.iLike]: `%${keyword}%`,
          },
        },
      };
    }

    users = await User.findAll({
      order: [
        ["id", "desc"],
        ["fullname", "asc"],
      ],
      where: filters,
      // include: {
      //   model: Phone,
      //   as: "phone",
      // },
    });

    // for (let user of users) {
    //   const phoneInstance = await user.getPhone();
    //   user.phone = phoneInstance?.phone;
    // }
    res.render("users/index", { users });
  },
  add: async (req, res) => {
    const courses = await Course.findAll({
      order: [["name", "asc"]],
    });
    res.render("users/add", { courses });
  },
  handleAdd: async (req, res) => {
    // const body = await req.validate(req.body, {
    //   name: string().required("Tên bắt buộc phải nhâp"),
    //   email: string()
    //     .required("Email bắt buộc phải nhập")
    //     .email("Email không đúng định dạng")
    //     .test("check-email", "Email đã được sử dụng", async (value) => {
    //       const result = await userModel.checkEmail(value);
    //       return !result.length;
    //     }),
    //   status: string().test(
    //     "check-status",
    //     "Trang thai khong hop le",
    //     (value) => {
    //       value = +value;
    //       if (!isNaN(value) && (value === 0 || value === 1)) {
    //         return true;
    //       } else {
    //         return false;
    //       }
    //     }
    //   ),
    // });
    const body = req.body;
    let password;
    password = await bcrypt.hash(body.password, 10);
    const user = await User.create({
      fullname: body.name,
      email: body.email,
      password: password,
      status: body.status === "1" ? true : false,
    });

    // if (user) {
    //   const courses = Array.isArray(body.courses)
    //     ? body.courses
    //     : [body.courses];
    //   //  tạo array chưas các instance của từng khóa được chọn
    //   if (courses.length) {
    //     const coursesInstance = await Promise.all(
    //       courses.map((courseId) => Course.findByPk(courseId))
    //     );
    //     await user.addCourses(coursesInstance);
    //   }
    // }
    return res.redirect("/users");
  },

  login: (req, res) => {
    res.render("users/login", { req });
  },
  handleLogin: async (req, res) => {
    const body = await req.body;
    const userEmail = body.email;
    //... fetch user from a db etc.
    const checkUser = await User.findOne({
      attributes: ["name", "email", "password"],
      where: {
        email: userEmail,
      },
    });
    if (checkUser) {
      bcrypt.compare(body.password, checkUser.password, function (err, result) {
        if (err) {
          console.log("err", err);
          // req.flash("err", "Có lỗi xảy ra");
          res.redirect("/users/login");
        } else {
          if (result) {
            // req.flash("success", "Đăng nhập thành công");
            res.redirect("/");
          }
        }
      });
    } else {
      res.redirect("/users/login");
    }

    if (!body) {
      return res.redirect("/users/login");
    }
  },

  edit: async (req, res, next) => {
    const { id } = req.params;
    try {
      const user = await User.findOne({
        where: { id },
        include: {
          model: Course,
          as: "courses",
        },
      });
      if (!user) {
        throw new Error("Không tìm thấy user");
      }
      // const courses = await Course.findAll({
      //   order: [["name", "asc"]],
      // });
      res.render("users/edit", { user }); //, courses
    } catch (e) {
      return next(e);
    }
  },
  handleEdit: async (req, res) => {
    const { id } = req.params;
    const body = req.body;
    const status = await User.update(
      {
        name: body.name,
        email: body.email,
        status: body.status === "1" ? true : false,
      },
      {
        where: { id },
      }
    );
    return res.redirect("/users/edit/" + id);
  },
  delete: async (req, res) => {
    const { id } = req.params;
    const status = await User.destroy({
      where: {
        id: id,
      },
      force: true, // xóa vĩnh viễn
    });
    res.redirect("/users");
  },
};
