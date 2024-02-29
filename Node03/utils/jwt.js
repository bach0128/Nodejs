var jwt = require("jsonwebtoken");
module.exports = {
  // Tao accessToken
  createAccessToken: (data = {}) => {
    const { JWT_SECRET, JWT_ACCESS_TOKEN_EXPIRE } = process.env;
    const token = jwt.sign(data, JWT_SECRET, {
      expiresIn: String(JWT_ACCESS_TOKEN_EXPIRE),
    });
    return token;
  },
  // Tao refreshToken
  createRefreshToken: () => {
    const { JWT_REFRESH_SECRET, JWT_REFRESH_TOKEN_EXPIRE } = process.env;
    const data = Math.random() + new Date().getTime();
    const token = jwt.sign({ data }, JWT_REFRESH_SECRET, {
      expiresIn: String(JWT_REFRESH_TOKEN_EXPIRE),
    });
    return token;
  },
  //   verify access token -> return payload
  decodeToken: (token) => {
    const { JWT_SECRET } = process.env;
    const decode = jwt.verify(token, JWT_SECRET);
    return decode;
  },
};
