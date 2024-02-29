import express from "express";
import userController from "../controllers/user.controller.js";
const router = express.Router();

router.get("/", userController.listCourse);

router.get("/active", userController.activeCourses);

router.get("/pending", userController.pendingCourses);

export default router;
