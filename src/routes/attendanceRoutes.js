const express = require("express");
const router = express.Router();

const { markAttendance, getAllAttendance, getStudentAttendance } = require("../controllers/attendanceController");

router.post("/mark", markAttendance);
router.get("/all", getAllAttendance);
router.get("/student/:usn", getStudentAttendance);

module.exports = router;
