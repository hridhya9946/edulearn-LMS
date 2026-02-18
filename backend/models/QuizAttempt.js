import mongoose from "mongoose";

const quizAttemptSchema = new mongoose.Schema(
    {
        quiz: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Quiz",
            required: true
        },
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        answers: [
            {
                questionId: mongoose.Schema.Types.ObjectId,
                answer: mongoose.Schema.Types.Mixed
            }
        ],
        score: {
            type: Number,
            required: true
        },
        maxScore: {
            type: Number,
            required: true
        },
        percentage: {
            type: Number,
            required: true
        },
        passed: {
            type: Boolean,
            required: true
        },
        startedAt: {
            type: Date,
            required: true
        },
        completedAt: {
            type: Date,
            default: Date.now
        },
        timeSpent: {
            type: Number // in seconds
        }
    },
    { timestamps: true }
);

// Index for faster queries
quizAttemptSchema.index({ quiz: 1, student: 1 });

export default mongoose.model("QuizAttempt", quizAttemptSchema);
