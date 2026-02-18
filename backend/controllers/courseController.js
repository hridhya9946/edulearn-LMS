import Course from "../models/Course.js";

export const createCourse = async (req, res) => {
  try {
    const course = await Course.create({
      ...req.body,
      instructor: req.user.id,
      status: "published"
    });

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPublishedCourses = async (req, res) => {
  try {
    const courses = await Course.find({ status: "published" })
      .populate("instructor", "name");

    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const submitCourse = async (req, res) => {
  try {
    await Course.findByIdAndUpdate(req.params.id, {
      status: "pending"
    });

    res.json({ message: "Submitted for approval" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("instructor", "name");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
