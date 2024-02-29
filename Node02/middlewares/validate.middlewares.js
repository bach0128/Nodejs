// Request
// Validate ---> Rule -->
// Error
// Flash
const { object } = require("yup");
module.exports = (req, res, next) => {
  // định nghĩa hàm validate để sử dụng bên controller
  req.validate = async (data, rules = {}) => {
    const schema = object(rules);
    try {
      const body = await schema.validate(data, {
        abortEarly: false,
      });
      return body;
    } catch (e) {
      const errors = Object.fromEntries(
        e.inner.map((item) => [item.path, item.message])
      );
      req.flash("errors", errors);
      req.flash("old", data);
    }
  };
  //   lưu lỗi nếu validate false vào req để thuận tiện hiển thị ở view
  const errors = req.flash("errors");
  req.errors = errors.length ? errors[0] : {};

  const old = req.flash("errors");
  req.errors = old.length ? errors[0] : {};
  next();
};
