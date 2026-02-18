import mongoose from "mongoose";
import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";

/* =====================================================
   MARK LESSON COMPLETE
===================================================== */
export const markLessonComplete = async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(courseId) ||
      !mongoose.Types.ObjectId.isValid(lessonId)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const enrollment = await Enrollment.findOne({
      student: req.user.id,
      course: courseId,
    });

    if (!enrollment) {
      return res.status(403).json({ message: "Not enrolled in this course" });
    }

    const alreadyCompleted = enrollment.completedLessons.some(
      (id) => id.toString() === lessonId
    );

    if (!alreadyCompleted) {
      enrollment.completedLessons.push(lessonId);
      await enrollment.save();
    }

    return res.status(200).json({
      message: "Lesson marked as completed",
    });
  } catch (error) {
    console.error("Mark lesson error:", error);
    return res.status(500).json({ message: "Failed to update progress" });
  }
};


/* =====================================================
   GET COURSE PROGRESS
===================================================== */
export const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const enrollment = await Enrollment.findOne({
      student: req.user.id,
      course: courseId,
    });

    // Sum lessons from modules + top-level lessons
    const moduleLessonsCount = course.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0;
    const topLevelLessonsCount = course.lessons?.length || 0;
    const totalLessons = moduleLessonsCount + topLevelLessonsCount;

    if (!enrollment) {
      return res.status(200).json({
        totalLessons,
        completed: 0,
        percentage: 0,
      });
    }

    const completed = enrollment.completedLessons?.length || 0;

    const percentage =
      totalLessons === 0
        ? 0
        : Math.min(100, Math.round((completed / totalLessons) * 100));

    // Auto complete course
    if (percentage === 100 && !enrollment.completed) {
      enrollment.completed = true;
      enrollment.completedAt = new Date();
      await enrollment.save();
    }

    return res.status(200).json({
      totalLessons,
      completed,
      percentage,
    });
  } catch (error) {
    console.error("Progress error:", error);
    return res.status(500).json({ message: "Failed to fetch progress" });
  }
};


/* =====================================================
   AUTO RESUME LAST LESSON
===================================================== */
export const getResumeLesson = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    const enrollment = await Enrollment.findOne({
      student: req.user.id,
      course: courseId,
    });

    if (!enrollment) {
      return res.status(403).json({ message: "Not enrolled in this course" });
    }

    const course = await Course.findById(courseId);

    if (!course || !course.lessons || course.lessons.length === 0) {
      return res.status(200).json({
        completed: false,
        lessonId: null,
      });
    }

    const completedLessonIds = enrollment.completedLessons.map((id) =>
      id.toString()
    );

    // Flatten all lessons from modules and top-level
    const allLessons = [];
    if (course.modules) {
      course.modules.forEach(m => {
        if (m.lessons) allLessons.push(...m.lessons);
      });
    }
    if (course.lessons) allLessons.push(...course.lessons);

    const nextLesson = allLessons.find(
      (lesson) =>
        !completedLessonIds.includes(lesson._id.toString())
    );

    if (!nextLesson) {
      return res.status(200).json({
        completed: true,
        lessonId: null,
      });
    }

    return res.status(200).json({
      completed: false,
      lessonId: nextLesson._id,
    });
  } catch (error) {
    console.error("Resume error:", error);
    return res.status(500).json({ message: "Resume failed" });
  }
};
