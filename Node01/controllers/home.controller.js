import { getError } from "../utils/validate.js";
import { object, string } from "yup";

const homeController = {
  // Nhận dữ liệu từ request
  // Validate
  // Thao tác với model
  // Xử lý logic nhiệp vụ
  // Trả về responsive
  index: (req, res) => {
    const title = `<i></i>Hoc BE de hon FE`;
    const status = false;
    const users = ["user-1", "user-2", "user-3"];
    req.session.message = "Hello anh em";
    req.session.count = 1;
    res.render("home/index", { title, status, users });
  },
  showProducts: (req, res) => {
    res.render("home/products", {
      layout: "/layouts/authLayout",
    });
  },
  login: (req, res) => {
    const errors = req.flash("errors");
    const msg = req.flash("msg");
    res.render("auth/login", {
      msg,
      errors,
      getError,
    });
  },
  handleLogin: async (req, res) => {
    console.log(req.body);
    // let { email, password } = req.body;
    // const obj = {};

    // if (!email.trim()) {
    //   // req.flash("errors", "Email????");
    //   obj.email = "email?";
    // } else if (!password.trim()) {
    //   // req.flash("errors", "Pass????");
    //   obj.password = "password?";
    // } else {
    //   req.flash("msg", "Login thanh cong");
    // }
    // req.flash("errors", obj);
    // return res.redirect("login");
    // // res.send("Submit");

    /* 
    các bước làm việc với validate
    1. Xác định rule
    2. Xác đinh message
    3. Kiểm tra (validate)
    */
    // const errors = {};

    // YUP
    const schema = object({
      password: string().required("Nhap pass di em oi"),
      // age: number().required().positive().integer(),
      email: string()
        .email("Email khong dung dinh dang")
        .required("Nhap email di em oi"),
    });

    try {
      const data = await schema.validate(req.body, {
        abortEarly: false,
      });
      console.log(data);
    } catch (e) {
      const errors = Object.fromEntries(
        e.inner.map(({ path, message }) => [path, message])
      );
      console.log(errors);
      req.flash("errors", errors);
    }

    return res.redirect("login");
  },
};

export default homeController;

/* 
controller: tuong ung vs module
Action: ham the hien 1 chuc nang trong 1 module
+ add
+ edit
+ delete
+ lists
*/
