const { User } = require("../../../models/index");
const { Op } = require("sequelize");
const { object, string } = require("yup");
const bcrypt = require("bcrypt");

module.exports = {
  index: async (req, res) => {
    const response = {};
    try {
      const { order = "asc", sort = "id", status, q, page, limit } = req.query;
      const filter = {};
      if (status === "true" || status === "false") {
        filter.status = status === "true";
      }
      if (q) {
        filter[Op.or] = {
          fullname: {
            [Op.iLike]: `%${q}%`,
          },
          email: {
            [Op.iLike]: `%${q}%`,
          },
        };
      }
      const options = {
        attributes: {
          exclude: ["password", "provider_id"],
        },
        order: [[sort, order]],
        where: filter,
      };
      if (Number.isInteger(+limit) && Number.isInteger(+page)) {
        const offset = (page - 1) * limit;
        options.limit = limit;
        options.offset = offset;
      }
      const { count, rows: users } = await User.findAndCountAll(options);
      Object.assign(response, {
        status: 200,
        message: "Success",
        data: users,
        count,
      });
    } catch (e) {
      Object.assign(response, {
        status: 500,
        message: "Server error",
      });
    }
    res.status(response.status).json(response);
  },
  find: async (req, res) => {
    const { id } = req.params;
    const response = {};
    try {
      const user = await User.findByPk(id);
      if (!user) {
        const error = new Error("User not found");
        error.status = 404;
        throw error;
      }
      Object.assign(response, {
        status: 200,
        message: "Success",
        data: user,
      });
    } catch (e) {
      Object.assign(response, {
        status: e.status || 500,
        message: e.status ? e.message : "Server error",
      });
    }
    res.status(response.status).json(response);
  },
  store: async (req, res) => {
    const response = {};
    try {
      const schema = object({
        fullname: string().required("Tên bắt buộc phải nhập"),
        email: string()
          .required("Email bắt buộc phải nhập")
          .email("Email không đúng định dạng")
          .test("check-unique", "Email da ton tai", async (value) => {
            const user = await User.findOne({ where: { email: value } });
            return !user;
          }),
        password: string().required("Password bắt buộc phải nhập"),
        status: string().test(
          "check-status",
          "Trạng thái không hợp lệ",
          (value) => {
            return value === "true" || value === "false";
          }
        ),
      });
      const body = await schema.validate(req.body, { abortEarly: true });
      const user = await User.create({
        fullname: body.fullname,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        status: body.status,
        provider_id: body.provider_id,
      });
      delete user.dataValues.password;
      Object.assign(response, {
        status: 201,
        message: "Success",
        data: body,
      });
    } catch (e) {
      console.log(e);
      const errors = Object.fromEntries(
        e.inner.map(({ path, message }) => [path, message])
      );
      Object.assign(response, {
        status: 400,
        message: "Bad request",
        errors,
      });
    }
    res.status(response.status).json(response);
  },
};
