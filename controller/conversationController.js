const Conversations = require("../models/conversationModel");
module.exports = {
  newConversation: async (req, res, next) => {
    const newConversation = new Conversations({
      members: [req.body.senderId, req.body.receiverId],
    });

    try {
      const savedConversation = await newConversation.save();
      res.status(200).json(savedConversation);
    } catch (error) {
      next(error);
    }
  },
  conversationWithUserId: async (req, res, next) => {
    try {
      const conversations = await Conversations.find({
        members: { $in: [req.params.userId] },
      });
      res.status(200).json(conversations);
    } catch (error) {
      next(error);
    }
  },
  conversationOfTwoUsers: async (req, res, next) => {
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
  },
};
