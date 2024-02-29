const { errorResponse } = require("../../utils/response");
const { User, Blacklist } = require("../../models/index");
const { decodeToken } = require("../../utils/jwt");

module.exports = async (req, res, next) => {
  const accessToken = req.get("Authorization")?.split(" ").slice(1).join();
  try {
    if (accessToken) {
      const blacklist = await Blacklist.findOne({
        where: { token: accessToken },
      });
      if (blacklist) {
        throw new Error("Token blacklisted");
      }
    }
    const { id, exp } = decodeToken(accessToken);
    const user = await User.findByPk(id, {
      attributes: {
        exclude: "password",
      },
    });
    if (!user || !user.status) {
      throw new Error("User blocked");
    }
    console.log(user);
    // check if the user is authenticated then next to auth/profile
    req.user = {
      ...user,
      accessToken,
      exp,
    };
    return next();
  } catch (e) {
    return errorResponse(res, 401, e.message);
  }
};
