const GitHubStrategy = require("passport-github").Strategy;
const { User, Provider } = require("../models/index");

module.exports = new GitHubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_SECRET,
    callbackURL: "http://localhost:3000/auth",
    scope: ["profile"],
  },
  async function (request, accessToken, refreshToken, profile, done) {
    const { user } = profile;
    // const { displayName, profileUrl } = user;
    const [provider] = await Provider.findOrCreate({
      where: { name: "github" },
      defaults: { name: "github" },
      passReqToCallback: true,
    });

    if (!provider) {
      return done(null, false, {
        message: "Provider doesn't exist!",
      });
    }
    // const [userAuth] = await User.findOrCreate({
    //   where: { profileUrl },
    //   defaults: {
    //     fullname: displayName,
    //     email: profileUrl,
    //     status: true,
    //     provide_id: provider.id,
    //   },
    // });

    // if (!user) {
    //   return done(null, false, {
    //     message: "Có lỗi xảy ra vui lòng thử lại sau",
    //   });
    // }

    done(null, user);
  }
);
