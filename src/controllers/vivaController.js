const Viva = require("../models/Viva");
const VivaResult = require("../models/VivaResult");

// create viva (teacher)
exports.createViva = async (req, res) => {
  try {
    const { subject, numberOfQuestions, marksPerQuestion, timeLimit } =
      req.body;

    const totalMarks = numberOfQuestions * marksPerQuestion;

    const viva = new Viva({
      subject,
      numberOfQuestions,
      marksPerQuestion,
      totalMarks,
      timeLimit,
    });

    await viva.save();

    res.json({
      message: "Viva created successfully",
      viva,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.getOngoingVivas = async (req, res) => {
  try {
    const vivas = await Viva.find({ status: "ongoing" });

    res.json(vivas);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.getVivaBySubject = async (req, res) => {
  try {
    const { subject } = req.params;

    const viva = await Viva.findOne({ subject });

    if (!viva) {
      return res.status(404).json({
        message: "Viva not found",
      });
    }

    res.json(viva);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.completeViva = async (req, res) => {
  try {
    const { studentId, vivaId, score, maxScore, highestDifficulty } = req.body;

    const result = new VivaResult({
      studentId,
      vivaId,
      score,
      maxScore,
      highestDifficulty,
    });

    await result.save();

    res.json({
      message: "Viva result saved",
      result,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.deleteViva = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete the viva
    const deletedViva = await Viva.findByIdAndDelete(id);

    if (!deletedViva) {
      return res.status(404).json({ message: "Viva not found" });
    }

    // Optionally delete associated results
    await VivaResult.deleteMany({ vivaId: id });

    res.json({ message: "Viva deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
