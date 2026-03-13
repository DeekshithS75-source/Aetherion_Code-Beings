const mongoose = require("mongoose");

const VivaSchema = new mongoose.Schema({
  subject: String,

  type: String,

  numberOfQuestions: Number,

  marksPerQuestion: Number,

  totalMarks: Number,

  timeLimit: Number,

  status: {
    type: String,
    default: "ongoing",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Viva", VivaSchema);
