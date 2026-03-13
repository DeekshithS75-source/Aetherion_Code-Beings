const mongoose = require("mongoose");

const assignmentSubmissionSchema = new mongoose.Schema(
    {
        assignmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Assignment",
            required: true,
        },
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        answerFilePath: {
            type: String,
            required: true, // Path to the student's uploaded answer image
        },
        score: {
            type: Number,
            default: null,
        },
        feedback: {
            type: String,
            default: "",
        },
        isAIGenerated: {
            type: Boolean,
            default: false,
        },
        status: {
            type: String,
            enum: ["submitted", "graded", "failed_evaluation"],
            default: "submitted",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("AssignmentSubmission", assignmentSubmissionSchema);
