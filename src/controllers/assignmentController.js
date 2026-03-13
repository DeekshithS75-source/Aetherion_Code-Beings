const Assignment = require("../models/Assignment");
const AssignmentSubmission = require("../models/AssignmentSubmission");
const path = require("path");

// 1. Teacher creates an assignment
exports.createAssignment = async (req, res) => {
    try {
        const { title, description, maxMarks, teacherId } = req.body;

        if (!req.file) {
            return res
                .status(400)
                .json({ message: "Assignment question image is required" });
        }

        // Save relative path for the frontend to access via static server
        const questionFilePath = `/uploads/${req.file.filename}`;

        const newAssignment = new Assignment({
            title,
            description,
            maxMarks,
            teacherId,
            questionFilePath,
        });

        await newAssignment.save();

        res.status(201).json({
            message: "Assignment created successfully",
            assignment: newAssignment,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Get all assignments
exports.getAllAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.find()
            .populate("teacherId", "name email")
            .sort({ createdAt: -1 });

        res.json(assignments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. Get single assignment
exports.getAssignmentById = async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id).populate(
            "teacherId",
            "name email"
        );

        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }

        res.json(assignment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 4. Submit an assignment (Student) -> Triggers AI Grade
exports.submitAssignment = async (req, res) => {
    try {
        const { assignmentId, studentId } = req.body;

        if (!req.file) {
            return res
                .status(400)
                .json({ message: "Answer image file is required" });
        }

        // Check if student already submitted
        const existingSubmission = await AssignmentSubmission.findOne({
            assignmentId,
            studentId,
        });

        if (existingSubmission) {
            return res
                .status(400)
                .json({ message: "You have already submitted this assignment." });
        }

        const answerFilePath = `/uploads/${req.file.filename}`;
        const absoluteFilePath = path.join(
            __dirname,
            "../../uploads",
            req.file.filename
        );

        // Initial save (pending grade)
        const submission = new AssignmentSubmission({
            assignmentId,
            studentId,
            answerFilePath,
            status: "submitted",
        });

        await submission.save();

        // Call the Python AI Evaluator asynchronously so the request doesn't hang forever
        // We send back "Evaluating..." immediately and the client can poll or just wait
        // But for a simple REST API flow, we'll await the python server here.

        try {
            // Import node-fetch dynamically for calling flask
            const fetch = (await import("node-fetch")).default;

            // We need maxMarks to tell the AI how to grade
            const assignment = await Assignment.findById(assignmentId);

            const aiResponse = await fetch(
                "http://127.0.0.1:8000/evaluate-assignment",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        image_path: absoluteFilePath,
                        max_marks: assignment.maxMarks,
                        assignment_title: assignment.title,
                        assignment_description: assignment.description,
                    }),
                }
            );

            const aiData = await aiResponse.json();

            if (!aiResponse.ok) {
                throw new Error(aiData.error || "AI Evaluation failed");
            }

            // Update the submission with AI results
            submission.score = aiData.score;
            submission.feedback = aiData.feedback;
            submission.isAIGenerated = aiData.is_ai_generated;
            submission.status = "graded";

            await submission.save();

            res.status(201).json({
                message: "Assignment evaluated successfully",
                submission,
            });
        } catch (evalError) {
            console.error("AI Evaluation Error:", evalError.message);
            submission.status = "failed_evaluation";
            await submission.save();

            res.status(201).json({
                message:
                    "Assignment uploaded successfully, but AI evaluation failed. Contact teacher.",
                submission,
            });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 5. Get submissions for a specific assignment (Teacher View)
exports.getSubmissionsForAssignment = async (req, res) => {
    try {
        const submissions = await AssignmentSubmission.find({
            assignmentId: req.params.id,
        })
            .populate("studentId", "name usn")
            .sort({ createdAt: -1 });

        res.json(submissions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 6. Get all submissions by a student (Student View)
exports.getStudentSubmissions = async (req, res) => {
    try {
        const submissions = await AssignmentSubmission.find({
            studentId: req.params.studentId,
        })
            .populate("assignmentId", "title maxMarks")
            .sort({ createdAt: -1 });

        res.json(submissions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 7. Delete an assignment and its submissions (Teacher)
exports.deleteAssignment = async (req, res) => {
    try {
        const assignmentId = req.params.id;

        // Optionally, one could delete the physical files using fs.unlinkSync here as well
        // Delete the assignment
        const deletedAssignment = await Assignment.findByIdAndDelete(assignmentId);

        if (!deletedAssignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }

        // Delete all submissions associated with this assignment
        await AssignmentSubmission.deleteMany({ assignmentId });

        res.json({ message: "Assignment deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
