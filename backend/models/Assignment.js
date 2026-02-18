import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
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
            type: String,
            required: true
        },
        dueDate: {
            type: Date,
            required: true
        },
        maxScore: {
            type: Number,
            required: true,
            default: 100
        },
        attachments: [
            {
                name: String,
                url: String
            }
        ],
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    { timestamps: true }
);

// Index for faster queries
assignmentSchema.index({ course: 1, createdBy: 1 });

export default mongoose.model("Assignment", assignmentSchema);
