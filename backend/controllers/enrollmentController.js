import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";

export const enroll = async (req, res) => {
   
  const course = await Course.findById(req.params.id);
  if (!course || course.status !== "published")
    return res.status(400).json({ message: "Course not available" });

 const alreadyEnrolled = await Enrollment.findOne({
      student: req.user.id,
      course: course._id,
    });

    if (alreadyEnrolled) {
      return res.status(400).json({
        message: "You are already enrolled in this course",});
    }

  await Enrollment.create({
    student: req.user.id,
    course: course._id,
  });

  res.json({ message: "Enrolled successfully" });
};

export const checkEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      student: req.user.id,
      course: req.params.id,
    });

    res.json({ enrolled: !!enrollment });
  } catch (error) {
    res.status(500).json({ message: "Failed to check enrollment" });
  }
};
export const getMyEnrollments = async (req, res) => {
  const enrollments = await Enrollment.find({
    student: req.user.id,
  }).populate("course");

  res.json(enrollments);
};
