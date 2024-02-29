const { ServerResponse } = require("http");
const { successResponse, errorResponse } = require("../utils/response");
const { createAccessToken, createRefreshToken } = require("../utils/jwt");
const passport = require("passport");
var express = require("express");
var router = express.Router();
const userController = require("../controller/api/v1/user.controller.js");
const authController = require("../controller/api/v1/auth.controller.js");
const authMiddleware = require("../middlewares/api/auth.middleware.js");

router.get("/v1/users", authMiddleware, userController.index);
router.get("/v1/users/:id", userController.find);
router.post("/v1/users", authMiddleware, userController.store);
router.post("/v1/auth/login", authController.login);
router.get("/v1/auth/profile", authMiddleware, authController.profile);
router.post("/v1/auth/logout", authMiddleware, authController.logout);
router.post("/v1/auth/refresh", authController.refresh);

// đăng nhập bằng google
// gửi link redirect login google về cho client
router.get("/login/google", (req, res) => {
  try {
    const emptyResponse = new ServerResponse(req);
    passport.authenticate(
      "google",
      { scope: ["profile", "email"] },
      (err, user, info) => {
        console.log(err, user, info);
      }
    )(req, emptyResponse);

    const url = emptyResponse.getHeader("location");
    return res.status(200).json({
      status: 200,
      message: "Get link redirect",
      result: {
        urlRedirect: url,
      },
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: 500,
      message: "Error",
    });
  }
});

// kiểm tra xem user login bằng google đã tồn tại hay chưa(tạo accessToken và refreshToken) gửi về client
router.get(
  "/auth/login/google",
  passport.authenticate("google", {
    session: false,
  }),
  (req, res) => {
    try {
      const data = req.user;
      let accessToken, refreshToken;
      if (data) {
        accessToken = createAccessToken({ id: data.dataValues.id });
        refreshToken = createRefreshToken();
      }

      return successResponse(res, 200, "Success", {
        accessToken: accessToken,
        refreshToken: refreshToken,
        user: data.dataValues,
      });
    } catch (e) {
      console.log(e);
    }
  }
);

// đăng nhập bằng github
// gửi link redirect login github về cho client
router.get("/login/github", (req, res) => {
  try {
    const emptyResponse = new ServerResponse(req);
    passport.authenticate(
      "github",
      { scope: ["user:email"] },
      (err, user, info) => {
        console.log(err, user, info);
      }
    )(req, emptyResponse);

    const url = emptyResponse.getHeader("location");
    return res.status(200).json({
      status: 200,
      message: "Get link redirect",
      result: {
        urlRedirect: url,
      },
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: 500,
      message: "Error",
    });
  }
});

// kiểm tra xem user login bằng google đã tồn tại hay chưa(tạo accessToken và refreshToken) gửi về client
router.get(
  "/auth/login/github",
  passport.authenticate("github", {
    session: false,
  }),
  (req, res) => {
    try {
      const data = req.user;
      console.log(data);
      let accessToken, refreshToken;
      if (data) {
        accessToken = createAccessToken({ id: data.id });
        refreshToken = createRefreshToken();
      }

      return successResponse(res, 200, "Success", {
        accessToken: accessToken,
        refreshToken: refreshToken,
        user: data,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        status: 500,
        message: "Error",
      });
    }
  }
);

module.exports = router;
