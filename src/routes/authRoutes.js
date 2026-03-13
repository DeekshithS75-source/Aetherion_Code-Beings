const express = require("express");
const router = express.Router();

const {
  teacherRegister,
  login,
  addStudent,
  studentLogin,
} = require("../controllers/authController");
router.post("/teacher-register", teacherRegister);
router.post("/login", login);
router.post("/add-student", addStudent);
router.post("/student-login", studentLogin);
module.exports = router;
