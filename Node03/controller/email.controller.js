const { Email } = require("../models/index");
const { Op, where } = require("sequelize");
const { name } = require("ejs");
const sendMail = require("../utils/mail");

const flash = require("flash");
module.exports = {
  index: async (req, res, next) => {
    let filters = {};
    let emails;

    const { status, keyword } = req.query;
    if (status === "active" || status === "inactive") {
      filters.status = status === "active";
    }
    if (keyword) {
      filters = {
        where: {
          email: {
            [Op.iLike]: `%${keyword}%`,
          },
        },
      };
    }
    emails = await Email.findAll({
      attribute: ["to", "subject", "content", "status", "created_at"],
      order: [["id", "desc"]],
      where: filters,
    });
    res.render("emails/index", { emails });
  },
  send: (req, res) => {
    res.render("emails/send");
  },
  handleSend: async (req, res) => {
    const body = req.body;

    const email = await Email.create({
      to: body.email,
      subject: body.subject,
      content: body.content,
      status: false,
    });

    if (email) {
      const info = await sendMail(body.email, body.subject, body.content);
      return info;
    }

    res.redirect("/emails");
  },
  detail: async (req, res) => {
    const { id } = req.params;
    try {
      const email = await Email.findOne({
        where: { id },
      });
      console.log(email);
      if (!email) {
        throw new Error("Không tìm thấy email");
      }
      res.render("emails/detail", { email });
    } catch (e) {
      return next(e);
    }
  },
  delete: async (req, res) => {
    const { id } = req.params;
    const status = await Email.destroy({
      where: {
        id: id,
      },
    });
    res.redirect("/emails");
  },
};
