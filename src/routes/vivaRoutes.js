const express = require("express");
const router = express.Router();

const {
  createViva,
  getOngoingVivas,
  getVivaBySubject,
} = require("../controllers/vivaController");

router.post("/create", createViva);

router.get("/ongoing", getOngoingVivas);

router.get("/:subject", getVivaBySubject);

module.exports = router;
