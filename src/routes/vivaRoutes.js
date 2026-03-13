const express = require("express");
const router = express.Router();

const {
  createViva,
  getOngoingVivas,
  getVivaBySubject,
  completeViva,
  deleteViva,
} = require("../controllers/vivaController");

router.post("/create", createViva);

router.post("/complete", completeViva);

router.get("/ongoing", getOngoingVivas);

router.get("/:subject", getVivaBySubject);

router.delete("/:id", deleteViva);

module.exports = router;
