const { User } = require("../models/index");

module.exports = {
  login: async (req, res) => {
    if (req.user) {
      return res.redirect("/");
    }
    const error = req.flash("error");
    res.render("auth/login", { error, layout: "auth/layout" });
  },
  reset: (req, res) => {
    res.render("auth/reset");
  },
  handleCheckMail: async (req, res) => {
    const user = await User.findOne({
      where: { email: req.body.email },
    });
    if (!user) {
      req.flash("error", "Email không tồn tại");
      return res.redirect("/reset");
    } else {
      var rand = function () {
        return Math.random().toString(36).substr(2); // remove `0.`
      };

      var token = function () {
        return rand() + rand(); // to make it longer
      };

      const resetToken = token();
      res.json({ resetToken });
      // tạo link reset password
      const linkResetPassword = {
        link: "https://localhost:3000/changePassword",
      };
    }
  },
  changePassword: async (req, res) => {
    res.render("auth/changePassword");
  },
};
