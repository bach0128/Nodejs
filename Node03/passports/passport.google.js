const GoogleStrategy = require("passport-google-oauth2").Strategy;
const { User, Provider } = require("../models/index");

module.exports = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    // callbackURL: "http://localhost:8080/auth/google/callback",
    callbackURL: "http://localhost:3000/auth",
    scope: ["profile", "email"],
    passReqToCallback: true,
  },
  async function (request, accessToken, refreshToken, profile, done) {
    const { displayName: fullname, email } = profile;
    const [provider] = await Provider.findOrCreate({
      where: { name: "google" },
      defaults: { name: "google" },
    });

    if (!provider) {
      return done(null, false, {
        message: "Provider doesn't exist!",
      });
    }

    const [user] = await User.findOrCreate({
      where: { email },
      defaults: {
        fullname,
        email,
        status: true,
        provide_id: provider.id,
      },
    });

    if (!user) {
      return done(null, false, {
        message: "Có lỗi xảy ra vui lòng thử lại sau",
      });
    }

    done(null, user);
  }
);
