const { string, object } = require("yup");
const { ShortUrl } = require("../models/index");

module.exports = {
  index: async (req, res) => {
    const urls = await ShortUrl.findAll({
      order: [["id", "desc"]],
    });
    res.render("urls", { urls: urls });
  },
  addUrl: async (req, res) => {
    let r = (Math.random() + 1).toString(36).substring(4);
    const schema = object({
      url: string().required("Tên bắt buộc phải nhập"),
      password: string().required("Password bắt buộc phải nhập"),
    });
    const body = await schema.validate(req.body, { abortEarly: true });
    if (body) {
      if (body.protect === "on") {
        res.render("urls/protect", { body });
      } else {
        let url = "https://short.f8team.dev/" + r;
        if (
          body.custom_url &&
          body.custom_url !== "https://short.f8team.dev/"
        ) {
          await ShortUrl.create({
            customer_url: body.custom_url,
            password: body.password,
            url: body.url,
          });
        } else {
          await ShortUrl.create({
            customer_url: url,
            password: body.password,
            url: body.url,
          });
        }
        res.redirect("/urls");
      }
    }
  },

  edit: async (req, res, next) => {
    const { id } = req.params;
    try {
      const url = await ShortUrl.findOne({
        where: { id },
      });
      if (!url) {
        throw new Error("Không tìm thấy url");
      }

      res.render("urls/edit", { url });
    } catch (e) {
      return next(e);
    }
  },
  handleEdit: async (req, res) => {
    const { id } = req.params;
    const body = req.body;
    const status = await ShortUrl.update(
      {
        customer_url: body.customer_url,
        url: body.url,
        password: body.password,
      },
      {
        where: { id },
      }
    );
    return res.redirect("/urls/edit/" + id);
  },
  delete: async (req, res) => {
    const { id } = req.params;
    const status = await ShortUrl.destroy({
      where: {
        id: id,
      },
      force: true, // xóa vĩnh viễn
    });
    res.redirect("/urls");
  },
};
