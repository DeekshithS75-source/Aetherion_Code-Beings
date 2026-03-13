const express = require("express");
const router = express.Router();


const vivaController = require("../controllers/vivaController");
const {
  createViva,
  getOngoingVivas,
  getVivaBySubject,
  completeViva,
  deleteViva,
} = vivaController;
router.post("/generate-question", vivaController.generateQuestion);
router.post("/create", createViva);

router.post("/complete", completeViva);

router.get("/ongoing", getOngoingVivas);

router.get("/:subject", getVivaBySubject);

router.delete("/:id", deleteViva);

module.exports = router;
