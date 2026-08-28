import express from "express";

import {
  buyCourses,
  verifyPayment,
  courseDetails,
  createCourse,
  deleteCourse,
  getCourses,
  updateCourse,
} from "../controllers/course.controller.js";

import userMiddleware from "../middlewares/user.mid.js";
import adminMiddleware from "../middlewares/admin.mid.js";

const router = express.Router();

// ==========================================
// ADMIN ROUTES
// ==========================================

router.post(
  "/create",
  adminMiddleware,
  createCourse
);

router.put(
  "/update/:courseId",
  adminMiddleware,
  updateCourse
);

router.delete(
  "/delete/:courseId",
  adminMiddleware,
  deleteCourse
);

// ==========================================
// PUBLIC ROUTES
// ==========================================

router.get(
  "/courses",
  getCourses
);

router.get(
  "/:courseId",
  courseDetails
);

// ==========================================
// PAYMENT ROUTES
// ==========================================

router.post(
  "/buy/:courseId",
  userMiddleware,
  buyCourses
);

router.post(
  "/verify-payment",
  userMiddleware,
  verifyPayment
);

export default router;