const Viva = require("../models/Viva");

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
