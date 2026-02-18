import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["multiple-choice", "true-false"],
        required: true
    },
    options: [
        {
            type: String
        }
    ],
    correctAnswer: {
        type: mongoose.Schema.Types.Mixed, // Can be String or Number
        required: true
    },
    points: {
        type: Number,
        required: true,
        default: 1
    }
});

const quizSchema = new mongoose.Schema(
    {
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        questions: [questionSchema],
        passingScore: {
            type: Number,
            required: true,
            default: 70
        },
        timeLimit: {
            type: Number, // in minutes
            default: 30
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    { timestamps: true }
);

// Index for faster queries
quizSchema.index({ course: 1, createdBy: 1 });

export default mongoose.model("Quiz", quizSchema);
