const express = require("express");

const {
  newConversation,
  conversationWithUserId,
  conversationOfTwoUsers,
} = require("../controller/conversationController");
const router = express.Router();

router.post("/", newConversation);

router.get("/:userId", conversationWithUserId);
router.get("/:firstUserId/:secondUserId", conversationOfTwoUsers);

module.exports = router;
