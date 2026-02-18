import express from "express";
import {
  markLessonComplete,
  getCourseProgress,
} from "../controllers/progressController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import { getResumeLesson } from "../controllers/progressController.js";

const router = express.Router();

router.put(
  "/:courseId/lesson/:lessonId",
  protect,
  authorize("student", "instructor"),
  markLessonComplete
);

router.post(
  "/:courseId/complete/:lessonId",
  protect,
  authorize("student", "instructor"),
  markLessonComplete
);
router.get(
  "/resume/:courseId",
  protect,
  authorize("student", "instructor"),
  getResumeLesson
);

router.get(
  "/:courseId",
  protect,
  authorize("student", "instructor"),
  getCourseProgress
);

export default router;
