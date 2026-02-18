import express from "express";
import { enroll, checkEnrollment, getMyEnrollments } from "../controllers/enrollmentController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/:id", protect, authorize("student", "instructor"), enroll);
router.get("/check/:id", protect, authorize("student", "instructor"), checkEnrollment);
router.get("/my-courses", protect, getMyEnrollments);


export default router;
