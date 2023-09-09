const express = require("express");
const Conversations = require("../models/conversationModel");
const router = express.Router();

router.post("/", async (req, res, next) => {
  const newConversation = new Conversations({
    members: [req.body.senderId, req.body.receiverId],
  });

  try {
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (error) {
    next(error);
  }
});

router.get("/:userId", async (req, res, next) => {
  try {
    const conversations = await Conversations.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(conversations);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
