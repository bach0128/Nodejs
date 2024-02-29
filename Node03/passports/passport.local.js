const LocalStrategy = require("passport-local").Strategy;
const { User } = require("../models/index");
const bscrypt = require("bcrypt");
// localStrategy chi nhan name, password
module.exports = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  async (email, password, done) => {
    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return done(null, false, {
        message: "Tai khoan khong ton tai",
      });
    }
    if (!bscrypt.compareSync(password, user?.password)) {
      return done(null, false, {
        message: "Mat khau khong chinh xac",
      });
    }

    return done(null, user);
  }
);
