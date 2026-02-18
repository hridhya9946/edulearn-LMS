import express from "express";
import {
   getMyCourses,
   getCourseById,
   createCourse,
   updateCourse,
   deleteCourse,
   publishCourse,
   createAssignment,
   updateAssignment,
   deleteAssignment,
   getSubmissions,
   gradeSubmission,
   getCourseAssignments,
   createQuiz,
   updateQuiz,
   deleteQuiz,
   getQuizAttempts,
   getQuizById,
   getCourseQuizzes,
   getDashboardStats,
   getCourseAnalytics
} from "../controllers/instructorController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import {
   ownsCourse,
   ownsAssignment,
   ownsQuiz,
   ownsSubmission
} from "../middleware/ownershipMiddleware.js";

const router = express.Router();

// All routes require authentication and instructor role
router.use(protect);
router.use(authorize("instructor"));

/* ===============================
   COURSE ROUTES
================================= */
router.get("/courses", getMyCourses);
router.get("/courses/:id", ownsCourse, getCourseById);
router.post("/courses", createCourse);
router.put("/courses/:id", ownsCourse, updateCourse);
router.delete("/courses/:id", ownsCourse, deleteCourse);
router.put("/courses/:id/publish", ownsCourse, publishCourse);

/* ===============================
   ASSIGNMENT ROUTES
================================= */
router.get("/courses/:courseId/assignments", ownsCourse, getCourseAssignments);
router.post("/courses/:courseId/assignments", ownsCourse, createAssignment);
router.put("/assignments/:id", ownsAssignment, updateAssignment);
router.delete("/assignments/:id", ownsAssignment, deleteAssignment);
router.get("/assignments/:id/submissions", ownsAssignment, getSubmissions);
router.put("/submissions/:id/grade", ownsSubmission, gradeSubmission);

/* ===============================
   QUIZ ROUTES
================================= */
router.get("/courses/:courseId/quizzes", ownsCourse, getCourseQuizzes);
router.post("/courses/:courseId/quizzes", ownsCourse, createQuiz);
router.get("/quizzes/:id", ownsQuiz, getQuizById);
router.put("/quizzes/:id", ownsQuiz, updateQuiz);
router.delete("/quizzes/:id", ownsQuiz, deleteQuiz);
router.get("/quizzes/:id/attempts", ownsQuiz, getQuizAttempts);

/* ===============================
   ANALYTICS ROUTES
================================= */
router.get("/dashboard", getDashboardStats);
router.get("/courses/:courseId/analytics", ownsCourse, getCourseAnalytics);

export default router;
