var express = require("express");
var router = express.Router();

const authController = require("../controller/auth.controller");
const passport = require("passport");

/* GET auth listing. */
router.get("/login", authController.login);

router.get("/reset", authController.reset);
router.post("/reset", authController.handleCheckMail);

router.get("/changePassword", authController.changePassword);

router.post(
  "/login",
  //   middleware
  passport.authenticate("local", {
    failureRedirect: "/auth/login",
    failureFlash: true,
    badRequestMessage: "Vui lòng nhập email và password",
    successRedirect: "/",
  })
);

router.get("/logout", (req, res) => {
  req.logout((err) => {});
  return res.redirect("/auth/login");
});

router.get("/google/redirect", passport.authenticate("google"));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/login",
    failureFlash: true,
    // successRedirect: "/",
    successReturnToOrRedirect: "/",
  })
);

module.exports = router;
