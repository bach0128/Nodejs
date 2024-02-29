const { User, Blacklist, UserToken } = require("../../../models/index");
const { successResponse, errorResponse } = require("../../../utils/response");
const {
  createAccessToken,
  createRefreshToken,
  decodeToken,
} = require("../../../utils/jwt");
const bcrypt = require("bcrypt");

module.exports = {
  login: async (req, res) => {
    const { email, password } = req.body;
    if (!email) {
      return errorResponse(res, 400, "Bad Request");
    }
    const user = await User.findOne({
      where: { email: email },
    });
    if (!user) {
      return errorResponse(res, 404, "User not found");
    }
    // const passwordHash = user.password;
    // if (!bcrypt.compareSync(password, passwordHash)) {
    //   return errorResponse(res, 400, "Invalid password");
    // }
    // tao token
    const accessToken = createAccessToken({ id: user.id });
    const refreshToken = createRefreshToken();
    await UserToken.create({
      user_id: user.id,
      refresh_token: refreshToken,
    });

    return successResponse(res, 200, "Success", {
      accessToken,
      refreshToken,
    });
  },
  profile: async (req, res) => {
    return successResponse(res, 200, "Success", req.user);
  },
  logout: async (req, res) => {
    const { accessToken, exp } = req.user;
    const [blacklist] = await Blacklist.findOrCreate({
      where: { token: accessToken },
      defaults: { token: accessToken, expired: exp },
    });
    if (blacklist) {
      return successResponse(res, 200, "Success");
    }
    return errorResponse(res, 500, "Server error");
  },
  refresh: async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return errorResponse(
        res,
        400,
        "Bad Request",
        "Vui lòng nhập refreshToken"
      );
    }

    try {
      decodeToken(refreshToken);
      const userToken = await UserToken.findOne({
        where: { refresh_token: refreshToken },
      });
      if (!userToken) {
        throw new Error("Token doesn't exist");
      }
      const { userId: user_id } = userToken;
      // create accessToken moi
      const accessToken = createAccessToken({ userId: userId });
      return successResponse(res, 200, "Success", {
        accessToken,
        refreshToken,
      });
    } catch (error) {
      return errorResponse(res, 401, "Unauthorize");
    }
  },
};
