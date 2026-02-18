import express from "express";
import {
  createCourse,
  getPublishedCourses,
  submitCourse,
  getCourseById
} from "../controllers/courseController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import { ownsCourse } from "../middleware/ownershipMiddleware.js";

const router = express.Router();

router.get("/", getPublishedCourses);
router.get("/:id",getCourseById);

router.post("/", protect, authorize("instructor"), createCourse);
router.put("/:id/submit", protect, authorize("instructor"), ownsCourse, submitCourse);

export default router;
