const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.teacherRegister = async (req, res) => {
  try {
    const { name, email, password, department } = req.body;

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newTeacher = new User({
      name,
      email,
      password: hashedPassword,
      department,
      role: "teacher",
    });

    await newTeacher.save();

    res.status(201).json({
      message: "Teacher registered successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    res.json({
      message: "Login successful",
      role: user.role,
      userId: user._id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addStudent = async (req, res) => {
  try {
    const { name, usn, password, parentEmail, parentPhone } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = new User({
      name,
      usn,
      password: hashedPassword,
      parentEmail,
      parentPhone,
      role: "student",
    });

    await student.save();

    res.json({
      message: "Student created successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.studentLogin = async (req, res) => {
  try {
    const { usn, password } = req.body;

    const student = await User.findOne({ usn });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const isMatch = await bcrypt.compare(password, student.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    res.json({
      message: "Student login successful",
      role: "student",
      userId: student._id,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};
