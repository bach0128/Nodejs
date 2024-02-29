"use strict";
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: "tranxuanbach98@gmail.com",
    pass: "fabk rvhd snrb lldz",
  },
});

module.exports = async (to, subject, message) => {
  const info = await transporter.sendMail({
    from: "tranxuanbach98@gmail.com>", // sender address
    to, // list of receivers
    subject, // Subject line
    html: message, // html body
  });
  return info;
};
