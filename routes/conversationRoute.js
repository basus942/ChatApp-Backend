const express = require("express");
<<<<<<< HEAD

const {
  newConversation,
  conversationWithUserId,
  conversationOfTwoUsers,
} = require("../controller/conversationController");
const router = express.Router();

router.post("/", newConversation);

router.get("/:userId", conversationWithUserId);
router.get("/:firstUserId/:secondUserId", conversationOfTwoUsers);
=======
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
router.get("/:firstUserId/:secondUserId", async (req, res, next) => {
  try {
    const conversations = await Conversations.findOne({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] },
    });

    if (!conversations) {
      // If no conversation is found, create a new conversation
      const newConversation = new Conversations({
        members: [req.params.firstUserId, req.params.secondUserId],
      });

      const savedConversation = await newConversation.save();
      res.status(200).json(savedConversation);
    } else {
      res.status(200).json(conversations);
    }
  } catch (error) {
    next(error);
  }
});
>>>>>>> 8d1d1bada8fdb8a1f0185d8bbebebdbfb722a1ab

module.exports = router;
