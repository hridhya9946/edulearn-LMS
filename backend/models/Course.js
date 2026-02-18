import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ["video", "pdf", "text"],
    default: "video"
  },
  contentUrl: String,
  videoUrl: String, // Keep for backward compatibility
  duration: Number, // in minutes
  order: Number
});

const moduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  lessons: [lessonSchema],
  order: Number
});

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    status: {
      type: String,
      enum: ["draft", "pending", "published", "rejected"],
      default: "draft"
    },
    // New modular structure
    modules: [moduleSchema],
    // Keep old lessons for backward compatibility
    lessons: [lessonSchema],

    // Enhanced metadata
    thumbnail: {
      type: String,
      default: ""
    },
    category: {
      type: String,
      default: "General"
    },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner"
    },
    price: {
      type: Number,
      default: 0
    },
    enrollmentCount: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    isPublished: {
      type: Boolean,
      default: false
    },
    rejectionReason: String
  },
  { timestamps: true }
);

// Update isPublished when status changes
courseSchema.pre("save", function () {
  this.isPublished = this.status === "published";
});

// Index for faster queries
courseSchema.index({ instructor: 1, status: 1 });
courseSchema.index({ status: 1, isPublished: 1 });
courseSchema.index({ category: 1 });

export default mongoose.model("Course", courseSchema);

