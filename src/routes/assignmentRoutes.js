const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const {
    createAssignment,
    getAllAssignments,
    getAssignmentById,
    submitAssignment,
    getSubmissionsForAssignment,
    getStudentSubmissions,
    deleteAssignment,
} = require("../controllers/assignmentController");

// Configure Multer for File Uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        // Generate a unique filename using timestamp
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(
            null,
            file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
        );
    },
});

// File filter to restrict to images
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only images (JPEG/PNG) are allowed!"), false);
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// Routes
router.post("/create", upload.single("questionFile"), createAssignment);
router.post("/submit", upload.single("answerFile"), submitAssignment);

router.get("/all", getAllAssignments);
router.get("/:id", getAssignmentById);
router.get("/:id/submissions", getSubmissionsForAssignment);
router.get("/student/:studentId", getStudentSubmissions);
router.delete("/:id", deleteAssignment);

module.exports = router;
