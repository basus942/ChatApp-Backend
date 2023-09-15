const express = require("express");

const {
  newMessage,
  messagesUsingConversationId,
} = require("../controller/messageController");

const router = express.Router();
router.post("/", newMessage);
router.get("/:conversationId", messagesUsingConversationId);

module.exports = router;
