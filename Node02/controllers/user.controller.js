const userModel = require("../models/user.model");
const { string } = require("yup");

module.exports = {
  index: async (req, res, next) => {
    let users;
    const { status, keyword } = req.query;
    try {
      users = await userModel.all(status, keyword);
    } catch (e) {
      return next(e);
    }
    const msg = req.flash("msg");
    res.render("users/index", { users, msg });
  },
  add: async (req, res) => {
    res.render("users/add", { req });
  },
  handleAdd: async (req, res) => {
    const body = await req.validate(req.body, {
      name: string().required("Tên bắt buộc phải nhâp"),
      email: string()
        .required("Email bắt buộc phải nhập")
        .email("Email không đúng định dạng")
        .test("check-email", "Email đã được sử dụng", async (value) => {
          const result = await userModel.checkEmail(value);
          return !result.length;
        }),
      status: string().test(
        "check-status",
        "Trang thai khong hop le",
        (value) => {
          value = +value;
          if (!isNaN(value) && (value === 0 || value === 1)) {
            return true;
          } else {
            return false;
          }
        }
      ),
    });

    if (body) {
      body.status = +body.status === 1;
      await userModel.add(body);
      req.flash("msg", "Thêm người dùng thành công");
      return res.redirect("/users");
    }
    return res.redirect("/users/add");
  },
  delete: async (req, res, next) => {
    let user;
    const { id } = req.params;
    try {
      user = await userModel.getUser(id);
    } catch (e) {
      return next(e);
    }
    res.render(`users/delete`, { user: user[0] });
  },

  handleDelete: async (req, res) => {
    const { id } = req.params;
    if (id) {
      await userModel.delete(id);
      req.flash("delete", "Xóa người dùng thành công");
      return res.redirect("/users");
    }
  },
  edit: async (req, res, next) => {
    let user;
    const { id } = req.params;
    console.log(id);
    try {
      user = await userModel.getUser(id);
      if (!user.length) {
        throw next(new Error("User khong ton tai"));
      }
      user[0].status = user[0].status ? 1 : 0;
      req.old = user[0];
      res.render("users/edit", { user: user[0] });
    } catch (e) {
      return next(e);
    }
  },
  handleEdit: async (req, res) => {
    const { id } = req.params;
    const body = await req.validate(req.body, {
      name: string().required("Tên bắt buộc phải nhâp"),
      email: string()
        .required("Email bắt buộc phải nhập")
        .email("Email không đúng định dạng")
        .test("check-email", "Email đã được sử dụng", async (value) => {
          const result = await userModel.checkEmail(value, id);
          return !result.length;
        }),
      status: string().test(
        "check-status",
        "Trang thai khong hop le",
        (value) => {
          value = +value;
          if (!isNaN(value) && (value === 0 || value === 1)) {
            return true;
          } else {
            return false;
          }
        }
      ),
    });

    if (body) {
      console.log(body);
      body.status = +body.status === 1;
      userModel.edit(req.body, id);
      req.flash("msg", "Sửa người dùng thành công");
      return res.redirect("/users/edit");
    }
    return res.redirect("/users/edit");
  },
};
