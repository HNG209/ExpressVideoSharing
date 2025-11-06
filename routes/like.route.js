const express = require("express");
const { likeController } = require("../controllers/like.controller");
const { authenticateToken } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/", authenticateToken, likeController.toggleLike);

module.exports = router;
