import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";

export const generateCertificate = async (req, res) => {
  try {
    const { courseId } = req.params;

    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: courseId,
    }).populate("course");

    if (!enrollment || !enrollment.completed) {
      return res.status(400).json({
        message: "Course not completed yet",
      });
    }

    const certificate = {
      studentName: req.user.name,
      courseTitle: enrollment.course.title,
      completedAt: enrollment.completedAt,
    };

    res.json(certificate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate certificate" });
  }
};
