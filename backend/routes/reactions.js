const express = require("express");
const router = express.Router();
const reactionController = require("../controllers/reactionController");
const { auth } = require("../middleware/auth");

router.get("/", reactionController.getReactions);
router.post("/", auth, reactionController.upsertReaction);
router.delete("/:postId", auth, reactionController.deleteReaction);

module.exports = router;
