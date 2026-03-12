const Attendance = require("../models/Attendance");
const User = require("../models/User");

const twilio = require("twilio");

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

exports.markAttendance = async (req, res) => {
  try {
    const { className, classType, date, time, absentees } = req.body;

    const students = await User.find({ role: "student" });

    const absentSet = new Set(absentees);

    const attendanceRecords = [];

    for (const student of students) {
      const lastTwo = student.usn.slice(-2);

      const isAbsent = absentSet.has(lastTwo);

      const record = {
        usn: student.usn,
        className,
        classType,
        date,
        time,
        present: !isAbsent,
      };

      attendanceRecords.push(record);

      // Send SMS if absent
      if (isAbsent && student.parentPhone) {
        const sms = await client.messages.create({
          body: `EduSphere Alert

Your ward ${student.name} (${student.usn}) was ABSENT.

Class: ${className}
Date: ${date}
Time: ${time}`,
          from: process.env.TWILIO_PHONE,
          to: student.parentPhone,
        });

        console.log("SMS sent:", sms.sid);
      }
    }

    await Attendance.insertMany(attendanceRecords);

    res.json({
      success: true,
      message: "Attendance marked",
      records: attendanceRecords,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
