const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const app = express();
const attendanceRoutes = require("./routes/attendanceRoutes");
const vivaRoutes = require("./routes/vivaRoutes");
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/viva", vivaRoutes);

const assignmentRoutes = require("./routes/assignmentRoutes");
app.use("/api/assignment", assignmentRoutes);

// Serve uploads statically
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Test route
app.get("/", (req, res) => {
  res.send("Backend server is running");
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log(err);
  });

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
