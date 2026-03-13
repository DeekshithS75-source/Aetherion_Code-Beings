const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        maxMarks: {
            type: Number,
            required: true,
        },
        teacherId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        questionFilePath: {
            type: String,
            required: true, // Path to the uploaded assignment image
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Assignment", assignmentSchema);
