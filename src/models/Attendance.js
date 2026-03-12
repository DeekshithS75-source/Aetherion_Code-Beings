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

  classType: {
    type: String,
    enum: ["normal", "workshop", "bootcamp"],
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
