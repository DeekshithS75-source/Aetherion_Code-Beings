const Attendance = require("../models/Attendance");
const User = require("../models/User");

const twilio = require("twilio");

const twilioSid = process.env.TWILIO_SID;
const twilioToken = process.env.TWILIO_TOKEN;

// Only instantiate Twilio if real credentials are provided
const isTwilioConfigured =
  twilioSid &&
  twilioToken &&
  twilioSid !== "your_twilio_sid_here" &&
  twilioToken !== "your_twilio_token_here";

const client = isTwilioConfigured ? twilio(twilioSid, twilioToken) : null;

exports.markAttendance = async (req, res) => {
  try {
    const { className, eventType, date, time, absentees } = req.body;

    const students = await User.find({ role: "student" });

    const absentSet = new Set(absentees);

    const attendanceRecords = [];

    for (const student of students) {
      const lastTwo = student.usn.slice(-2);

      const isAbsent = absentSet.has(lastTwo);

      const record = {
        usn: student.usn,
        className,
        eventType,
        date,
        time,
        present: !isAbsent,
      };

      attendanceRecords.push(record);

      // Send SMS if absent
      if (isAbsent && student.parentPhone) {
        if (!isTwilioConfigured) {
          console.log(`[Twilio Not Configured] Would have sent SMS to ${student.parentPhone} for ${student.name}`);
        } else {
          try {
            const sms = await client.messages.create({
              body: `EduSphere Alert\n\nYour ward ${student.name} (${student.usn}) was ABSENT.\n\nClass: ${className}\nDate: ${date}\nTime: ${time}`,
              from: process.env.TWILIO_PHONE,
              to: student.parentPhone,
            });
            console.log("SMS sent:", sms.sid);
          } catch (smsError) {
            console.error("Twilio explicitly failed:", smsError.message);
          }
        }
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

// 2. Fetch all attendance records (for Teacher Dashboard)
exports.getAllAttendance = async (req, res) => {
  try {
    const records = await Attendance.find()
      .sort({ date: -1, time: -1 });

    // Retrieve user details to attach real names inline
    const users = await User.find({ role: 'student' }).select('usn name');
    const userMap = {};
    users.forEach(user => {
      userMap[user.usn] = user.name;
    });

    const recordsWithNames = records.map(record => ({
      ...record._doc,
      studentName: userMap[record.usn] || 'Unknown',
    }));

    res.json(recordsWithNames);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. Fetch personal attendance records (for Student Dashboard)
exports.getStudentAttendance = async (req, res) => {
  try {
    const { usn } = req.params;
    const records = await Attendance.find({ usn })
      .sort({ date: -1, time: -1 });

    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
