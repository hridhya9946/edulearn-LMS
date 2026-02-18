import Course from "../models/Course.js";
import Assignment from "../models/Assignment.js";
import Submission from "../models/Submission.js";
import Quiz from "../models/Quiz.js";
import QuizAttempt from "../models/QuizAttempt.js";
import Enrollment from "../models/Enrollment.js";

/* ===============================
   COURSE MANAGEMENT
================================= */

// Get instructor's courses
export const getMyCourses = async (req, res) => {
    try {
        const courses = await Course.find({ instructor: req.user.id })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            courses
        });
    } catch (error) {
        console.error("Get my courses error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get single course for instructor
export const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.json({
            success: true,
            course
        });
    } catch (error) {
        console.error("Get instructor course error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Create new course
export const createCourse = async (req, res) => {
    try {
        // Clean up data to avoid validation errors from empty subdocuments
        const courseData = { ...req.body };
        if (courseData.modules) {
            courseData.modules = courseData.modules.filter(m => m.title && m.title.trim() !== "");
            courseData.modules.forEach(m => {
                if (m.lessons) {
                    m.lessons = m.lessons.filter(l => l.title && l.title.trim() !== "");
                }
            });
        }

        const course = await Course.create({
            ...courseData,
            instructor: req.user._id, // Use _id explicitly
            status: req.body.status || "draft"
        });

        res.status(201).json({
            success: true,
            course
        });
    } catch (error) {
        console.error("INSTRUCTOR_CONTROLLER: createCourse FATAL ERROR:", error);

        if (error.name === 'ValidationError') {
            console.error("Mongoose Validation Details:", JSON.stringify(error.errors, null, 2));
            return res.status(400).json({
                success: false,
                message: "Validation Error: " + Object.values(error.errors).map(e => e.message).join(", "),
                errors: error.errors
            });
        }

        res.status(500).json({
            success: false,
            message: "Internal Server Error: " + error.message,
            stack: error.stack
        });
    }
};

// Update course
export const updateCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Allow editing published courses, but they will revert to pending/draft status
        /*
        if (course.status === "published") {
            return res.status(403).json({
                message: "Cannot edit published course. Contact admin to unpublish first."
            });
        }
        */

        const updatedCourse = await Course.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            course: updatedCourse
        });
    } catch (error) {
        console.error("Update course error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Delete course (only drafts)
export const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        if (course.status !== "draft") {
            return res.status(403).json({
                message: "Can only delete draft courses"
            });
        }

        await Course.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "Course deleted successfully"
        });
    } catch (error) {
        console.error("Delete course error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Submit course for approval
export const publishCourse = async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate(
            req.params.id,
            { status: "pending", rejectionReason: "" },
            { new: true }
        );

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.json({
            success: true,
            message: "Course submitted for approval",
            course
        });
    } catch (error) {
        console.error("Publish course error:", error);
        res.status(500).json({ message: error.message });
    }
};

/* ===============================
   ASSIGNMENT MANAGEMENT
================================= */

// Create assignment
export const createAssignment = async (req, res) => {
    try {
        const { courseId } = req.params;

        const assignment = await Assignment.create({
            ...req.body,
            course: courseId,
            createdBy: req.user.id
        });

        res.status(201).json({
            success: true,
            assignment
        });
    } catch (error) {
        console.error("Create assignment error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Update assignment
export const updateAssignment = async (req, res) => {
    try {
        const assignment = await Assignment.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }

        res.json({
            success: true,
            assignment
        });
    } catch (error) {
        console.error("Update assignment error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Delete assignment
export const deleteAssignment = async (req, res) => {
    try {
        const assignment = await Assignment.findByIdAndDelete(req.params.id);

        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }

        res.json({
            success: true,
            message: "Assignment deleted successfully"
        });
    } catch (error) {
        console.error("Delete assignment error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Get submissions for an assignment
export const getSubmissions = async (req, res) => {
    try {
        const submissions = await Submission.find({
            assignment: req.params.id
        })
            .populate("student", "name email")
            .sort({ submittedAt: -1 });

        res.json({
            success: true,
            submissions
        });
    } catch (error) {
        console.error("Get submissions error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Grade submission
export const gradeSubmission = async (req, res) => {
    try {
        const { grade, feedback } = req.body;

        const submission = await Submission.findByIdAndUpdate(
            req.params.id,
            {
                grade,
                feedback,
                gradedBy: req.user.id,
                gradedAt: new Date(),
                status: "graded"
            },
            { new: true }
        ).populate("student", "name email");

        if (!submission) {
            return res.status(404).json({ message: "Submission not found" });
        }

        res.json({
            success: true,
            submission
        });
    } catch (error) {
        console.error("Grade submission error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Get assignments for a course
export const getCourseAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.find({
            course: req.params.courseId
        }).sort({ createdAt: -1 });

        res.json({
            success: true,
            assignments
        });
    } catch (error) {
        console.error("Get course assignments error:", error);
        res.status(500).json({ message: error.message });
    }
};

/* ===============================
   QUIZ MANAGEMENT
================================= */

// Create quiz
export const createQuiz = async (req, res) => {
    try {
        const { courseId } = req.params;

        const quiz = await Quiz.create({
            ...req.body,
            course: courseId,
            createdBy: req.user.id
        });

        res.status(201).json({
            success: true,
            quiz
        });
    } catch (error) {
        console.error("Create quiz error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Update quiz
export const updateQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        res.json({
            success: true,
            quiz
        });
    } catch (error) {
        console.error("Update quiz error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Delete quiz
export const deleteQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findByIdAndDelete(req.params.id);

        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        res.json({
            success: true,
            message: "Quiz deleted successfully"
        });
    } catch (error) {
        console.error("Delete quiz error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Get quiz attempts
export const getQuizAttempts = async (req, res) => {
    try {
        const attempts = await QuizAttempt.find({
            quiz: req.params.id
        })
            .populate("student", "name email")
            .sort({ completedAt: -1 });

        res.json({
            success: true,
            attempts
        });
    } catch (error) {
        console.error("Get quiz attempts error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Get quizzes for a course
export const getCourseQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find({
            course: req.params.courseId
        }).sort({ createdAt: -1 });

        res.json({
            success: true,
            quizzes
        });
    } catch (error) {
        console.error("Get course quizzes error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Get single quiz
export const getQuizById = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);

        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        res.json({
            success: true,
            quiz
        });
    } catch (error) {
        console.error("Get quiz by id error:", error);
        res.status(500).json({ message: error.message });
    }
};

/* ===============================
   ANALYTICS
================================= */

// Get instructor dashboard stats
export const getDashboardStats = async (req, res) => {
    try {
        const instructorId = req.user.id;

        // Get all instructor's courses
        const courses = await Course.find({ instructor: instructorId });
        const courseIds = courses.map(c => c._id);

        // Total students (unique enrollments)
        const enrollments = await Enrollment.find({
            course: { $in: courseIds }
        }).populate("student", "name");

        const totalStudents = new Set(enrollments.map(e => e.student._id.toString())).size;

        // Total revenue (if courses have prices)
        const totalRevenue = courses.reduce((sum, course) => {
            return sum + (course.price * course.enrollmentCount);
        }, 0);

        // Average completion rate
        const completedEnrollments = enrollments.filter(e => e.completed).length;
        const avgCompletionRate = enrollments.length > 0
            ? Math.round((completedEnrollments / enrollments.length) * 100)
            : 0;

        // Recent enrollments
        const recentEnrollments = await Enrollment.find({
            course: { $in: courseIds }
        })
            .populate("student", "name email")
            .populate("course", "title")
            .sort({ createdAt: -1 })
            .limit(10);

        res.json({
            success: true,
            stats: {
                totalCourses: courses.length,
                activeCourses: courses.filter(c => c.status === "published").length,
                totalStudents,
                totalRevenue,
                avgCompletionRate,
                recentEnrollments
            }
        });
    } catch (error) {
        console.error("Get dashboard stats error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Get course analytics
export const getCourseAnalytics = async (req, res) => {
    try {
        const { courseId } = req.params;

        // Get course
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Get enrollments
        const enrollments = await Enrollment.find({ course: courseId })
            .populate("student", "name email");

        // Calculate completion rate
        const completedCount = enrollments.filter(e => e.completed).length;
        const completionRate = enrollments.length > 0
            ? Math.round((completedCount / enrollments.length) * 100)
            : 0;

        // Get quiz attempts for this course
        const quizzes = await Quiz.find({ course: courseId });
        const quizIds = quizzes.map(q => q._id);
        const quizAttempts = await QuizAttempt.find({
            quiz: { $in: quizIds }
        });

        // Calculate average quiz score
        const avgQuizScore = quizAttempts.length > 0
            ? Math.round(
                quizAttempts.reduce((sum, attempt) => sum + attempt.percentage, 0) /
                quizAttempts.length
            )
            : 0;

        // Student progress details
        const studentProgress = enrollments.map(enrollment => {
            const totalLessons = course.lessons?.length || 0;
            const completedLessons = enrollment.completedLessons?.length || 0;
            const progress = totalLessons > 0
                ? Math.round((completedLessons / totalLessons) * 100)
                : 0;

            return {
                studentId: enrollment.student._id,
                studentName: enrollment.student.name,
                studentEmail: enrollment.student.email,
                progress,
                completed: enrollment.completed,
                enrolledAt: enrollment.createdAt,
                lastActive: enrollment.updatedAt
            };
        });

        res.json({
            success: true,
            analytics: {
                enrollmentCount: enrollments.length,
                completionRate,
                avgQuizScore,
                revenue: course.price * course.enrollmentCount,
                studentProgress
            }
        });
    } catch (error) {
        console.error("Get course analytics error:", error);
        res.status(500).json({ message: error.message });
    }
};
