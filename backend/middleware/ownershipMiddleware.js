import Course from "../models/Course.js";
import Assignment from "../models/Assignment.js";
import Quiz from "../models/Quiz.js";
import Submission from "../models/Submission.js";

export const ownsCourse = async (req, res, next) => {
  try {
    const courseId = req.params.id || req.params.courseId;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your course" });
    }

    next();
  } catch (error) {
    console.error("ownsCourse error:", error);
    next(error);
  }
};

export const ownsAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id).populate("course");
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    if (assignment.course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your assignment" });
    }
    next();
  } catch (error) {
    console.error("ownsAssignment error:", error);
    next(error);
  }
};

export const ownsQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate("course");
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    if (quiz.course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your quiz" });
    }
    next();
  } catch (error) {
    console.error("ownsQuiz error:", error);
    next(error);
  }
};

export const ownsSubmission = async (req, res, next) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate({
        path: "assignment",
        populate: { path: "course" }
      });

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    if (submission.assignment.course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your submission to grade" });
    }

    next();
  } catch (error) {
    console.error("ownsSubmission error:", error);
    next(error);
  }
};
