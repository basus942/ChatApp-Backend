const express = require("express");
<<<<<<< HEAD

const {
  newMessage,
  messagesUsingConversationId,
} = require("../controller/messageController");

const router = express.Router();
router.post("/", newMessage);
router.get("/:conversationId", messagesUsingConversationId);
=======
const Messages = require("../models/messageModel");

const router = express.Router();
router.post("/", async (req, res, next) => {
  const newMessage = new Messages(req.body);
  try {
    const savedMesssage = await newMessage.save();
    res.status(200).json(savedMesssage);
  } catch (error) {
    next(error);
  }
});
router.get("/:conversationId", async (req, res, next) => {
  try {
    const Messsages = await Messages.find({
      conversationId: req.params.conversationId,
    });
    res.status(200).json(Messsages);
  } catch (error) {
    next(error);
  }
});
>>>>>>> 8d1d1bada8fdb8a1f0185d8bbebebdbfb722a1ab

module.exports = router;
