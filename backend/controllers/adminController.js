import Course from "../models/Course.js";
import User from "../models/User.js";
import Enrollment from "../models/Enrollment.js";
import Submission from "../models/Submission.js";
import QuizAttempt from "../models/QuizAttempt.js";
import SystemSettings from "../models/SystemSettings.js";

/* ===============================
   USER MANAGEMENT
================================= */

// Get all users with pagination
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;

    const query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }

    const users = await User.find(query)
      .select("-password")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await User.countDocuments(query);

    res.json({
      success: true,
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get user's enrollments
    const enrollments = await Enrollment.find({ student: user._id })
      .populate("course", "title")
      .sort({ createdAt: -1 });

    // Get user's courses if instructor
    let courses = [];
    if (user.role === "instructor") {
      courses = await Course.find({ instructor: user._id })
        .select("title status enrollmentCount");
    }

    res.json({
      success: true,
      user,
      enrollments,
      courses
    });
  } catch (error) {
    console.error("Get user by ID error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create user
export const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || "student"
    });

    res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Cascading deletes for enrollments, submissions, and quiz attempts
    await Enrollment.deleteMany({ student: req.params.id });
    await Submission.deleteMany({ student: req.params.id });
    await QuizAttempt.deleteMany({ student: req.params.id });

    res.json({
      success: true,
      message: "User deleted successfully"
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Change user role
export const changeUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!["admin", "instructor", "student"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error("Change user role error:", error);
    res.status(500).json({ message: error.message });
  }
};

/* ===============================
   COURSE APPROVAL
================================= */

// Get pending courses
export const getPendingCourses = async (req, res) => {
  try {
    const courses = await Course.find({ status: "pending" })
      .populate("instructor", "name email")
      .sort({ updatedAt: -1 });

    res.json({
      success: true,
      courses
    });
  } catch (error) {
    console.error("Get pending courses error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Approve course
export const approveCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { status: "published", rejectionReason: "" },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json({
      success: true,
      message: "Course approved and published",
      course
    });
  } catch (error) {
    console.error("Approve course error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Reject course
export const rejectCourse = async (req, res) => {
  try {
    const { reason } = req.body;

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { status: "rejected", rejectionReason: reason || "Does not meet quality standards" },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json({
      success: true,
      message: "Course rejected",
      course
    });
  } catch (error) {
    console.error("Reject course error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   PLATFORM ANALYTICS
================================= */

// Get admin dashboard stats
export const getDashboardStats = async (req, res) => {
  try {
    // Total users by role
    const totalUsers = await User.countDocuments();
    const adminCount = await User.countDocuments({ role: "admin" });
    const instructorCount = await User.countDocuments({ role: "instructor" });
    const studentCount = await User.countDocuments({ role: "student" });

    // Total courses by status
    const totalCourses = await Course.countDocuments();
    const publishedCourses = await Course.countDocuments({ status: "published" });
    const pendingCourses = await Course.countDocuments({ status: "pending" });
    const draftCourses = await Course.countDocuments({ status: "draft" });

    // Total enrollments
    const totalEnrollments = await Enrollment.countDocuments();
    const completedEnrollments = await Enrollment.countDocuments({ completed: true });

    // Calculate total revenue
    const courses = await Course.find({ status: "published" });
    const totalRevenue = courses.reduce((sum, course) => {
      const price = course.price || 0;
      const enrollmentCount = course.enrollmentCount || 0;
      return sum + (price * enrollmentCount);
    }, 0);

    // Recent activity
    const recentUsers = await User.find()
      .select("name email role createdAt")
      .sort({ createdAt: -1 })
      .limit(5);

    const recentEnrollments = await Enrollment.find()
      .populate("student", "name")
      .populate("course", "title")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        users: {
          total: totalUsers,
          admins: adminCount,
          instructors: instructorCount,
          students: studentCount
        },
        courses: {
          total: totalCourses,
          published: publishedCourses,
          pending: pendingCourses,
          draft: draftCourses
        },
        enrollments: {
          total: totalEnrollments,
          completed: completedEnrollments,
          completionRate: totalEnrollments > 0
            ? Math.round((completedEnrollments / totalEnrollments) * 100)
            : 0
        },
        revenue: {
          total: totalRevenue
        },
        recentActivity: {
          users: recentUsers,
          enrollments: recentEnrollments
        }
      }
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get revenue report
export const getRevenueReport = async (req, res) => {
  try {
    const courses = await Course.find({ status: "published" })
      .populate("instructor", "name email")
      .select("title price enrollmentCount instructor");

    const revenueByCourse = courses.map(course => {
      const price = course.price || 0;
      const enrollments = course.enrollmentCount || 0;
      return {
        courseId: course._id,
        courseTitle: course.title,
        instructor: course.instructor?.name || "Deleted User",
        price: price,
        enrollments: enrollments,
        revenue: price * enrollments
      };
    });

    const totalRevenue = revenueByCourse.reduce((sum, item) => sum + item.revenue, 0);

    res.json({
      success: true,
      report: {
        totalRevenue,
        courseCount: courses.length,
        revenueByCourse
      }
    });
  } catch (error) {
    console.error("Get revenue report error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user growth report
export const getUserGrowth = async (req, res) => {
  try {
    // Get users created in last 12 months
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const users = await User.find({
      createdAt: { $gte: twelveMonthsAgo }
    }).select("createdAt role");

    // Group by month
    const monthlyData = {};
    users.forEach(user => {
      const month = user.createdAt.toISOString().slice(0, 7); // YYYY-MM
      if (!monthlyData[month]) {
        monthlyData[month] = { total: 0, students: 0, instructors: 0, admins: 0 };
      }
      monthlyData[month].total++;
      monthlyData[month][user.role + "s"]++;
    });

    res.json({
      success: true,
      growth: monthlyData
    });
  } catch (error) {
    console.error("Get user growth error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get course statistics
export const getCourseStats = async (req, res) => {
  try {
    const courses = await Course.find({ status: "published" })
      .populate("instructor", "name")
      .select("title enrollmentCount rating category");

    // Most popular courses
    const mostPopular = [...courses]
      .sort((a, b) => b.enrollmentCount - a.enrollmentCount)
      .slice(0, 10);

    // Highest rated courses
    const highestRated = [...courses]
      .filter(c => c.rating > 0)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 10)
      .map(c => ({
        ...c.toObject(),
        instructor: c.instructor ? c.instructor : { name: "Deleted User" }
      }));

    // Courses by category
    const byCategory = {};
    courses.forEach(course => {
      if (!byCategory[course.category]) {
        byCategory[course.category] = 0;
      }
      byCategory[course.category]++;
    });

    res.json({
      success: true,
      stats: {
        mostPopular,
        highestRated,
        byCategory
      }
    });
  } catch (error) {
    console.error("Get course stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   SYSTEM SETTINGS
================================= */

// Get system settings
export const getSettings = async (req, res) => {
  try {
    let settings = await SystemSettings.findOne();

    // Create default settings if none exist
    if (!settings) {
      settings = await SystemSettings.create({});
    }

    res.json({
      success: true,
      settings
    });
  } catch (error) {
    console.error("Get settings error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update system settings
export const updateSettings = async (req, res) => {
  try {
    let settings = await SystemSettings.findOne();

    if (!settings) {
      settings = await SystemSettings.create(req.body);
    } else {
      settings = await SystemSettings.findByIdAndUpdate(
        settings._id,
        req.body,
        { new: true, runValidators: true }
      );
    }

    res.json({
      success: true,
      settings
    });
  } catch (error) {
    console.error("Update settings error:", error);
    res.status(500).json({ message: error.message });
  }
};
