const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
  usn: {
    type: String,
    required: true,
  },

  className: {
    type: String,
    required: true,
  },

  eventType: {
    type: String,
    enum: ["Class", "Lab", "Workshop", "Bootcamp", "Seminar"],
    required: true,
  },

  date: {
    type: String,
    required: true,
  },

  time: {
    type: String,
    required: true,
  },

  present: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model("Attendance", AttendanceSchema);
