import express from "express";
import coursesRoute from "./courses.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import authController from "../controllers/auth.controller.js";

const router = express.Router();

router.use("/courses", coursesRoute);

router.use(authMiddleware);

router.get("/", (req, res) => {
  const { status, keyword } = req.query;
  const userAgent = req.headers["user-agent"];
  res.set("abc", "xyz");
  res.cookie("email", "tranxuanbach98@gmail.com", {
    maxAge: 86400,
    path: "/",
    httpOnly: true,
  });
  const email = req.cookies.email;

  res.send(`<h1>danh sach user</h1>
  <h2>Status: ${status}</h2>
  <h2>Keyword: ${keyword}</h2>
  <h2>UserAgent: ${userAgent}</h2>
  <h2>Email: ${email}</h2>

  `);
});

router.get("/add", authController.addUser);

router.get("/active/:id", authController.activeUser);

export default router;
