import express from "express";
import {
   getAllUsers,
   getUserById,
   createUser,
   updateUser,
   deleteUser,
   changeUserRole,
   getPendingCourses,
   approveCourse,
   rejectCourse,
   getDashboardStats,
   getRevenueReport,
   getUserGrowth,
   getCourseStats,
   getSettings,
   updateSettings
} from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

// All routes require authentication and admin role
router.use(protect);
router.use(authorize("admin"));

/* ===============================
   USER MANAGEMENT ROUTES
================================= */
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);
router.put("/users/:id/role", changeUserRole);

/* ===============================
   COURSE APPROVAL ROUTES
================================= */
router.get("/courses/pending", getPendingCourses);
router.put("/courses/:id/approve", approveCourse);
router.put("/courses/:id/reject", rejectCourse);

/* ===============================
   ANALYTICS ROUTES
================================= */
router.get("/dashboard", getDashboardStats);
router.get("/reports/revenue", getRevenueReport);
router.get("/reports/user-growth", getUserGrowth);
router.get("/reports/courses", getCourseStats);

/* ===============================
   SYSTEM SETTINGS ROUTES
================================= */
router.get("/settings", getSettings);
router.put("/settings", updateSettings);

export default router;
