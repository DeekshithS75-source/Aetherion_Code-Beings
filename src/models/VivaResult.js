const mongoose = require("mongoose");

const VivaResultSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    vivaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Viva",
    },

    score: {
        type: Number,
        required: true,
    },

    maxScore: {
        type: Number,
        required: true,
    },

    highestDifficulty: {
        type: Number,
        required: true,
    },

    completedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("VivaResult", VivaResultSchema);
