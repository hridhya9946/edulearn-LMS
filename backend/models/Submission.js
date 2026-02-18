import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
    {
        assignment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Assignment",
            required: true
        },
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        submittedAt: {
            type: Date,
            default: Date.now
        },
        content: {
            type: String,
            required: true
        },
        attachments: [
            {
                name: String,
                url: String
            }
        ],
        grade: {
            type: Number,
            min: 0
        },
        feedback: {
            type: String
        },
        gradedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        gradedAt: {
            type: Date
        },
        status: {
            type: String,
            enum: ["submitted", "graded"],
            default: "submitted"
        }
    },
    { timestamps: true }
);

// Ensure one submission per student per assignment
submissionSchema.index({ assignment: 1, student: 1 }, { unique: true });

export default mongoose.model("Submission", submissionSchema);
