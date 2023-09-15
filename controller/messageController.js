const Messages = require("../models/messageModel");
module.exports = {
  newMessage: async (req, res, next) => {
    const newMessage = new Messages(req.body);
    try {
      const savedMesssage = await newMessage.save();
      res.status(200).json(savedMesssage);
    } catch (error) {
      next(error);
    }
  },
  messagesUsingConversationId: async (req, res, next) => {
    try {
      const Messsages = await Messages.find({
        conversationId: req.params.conversationId,
      });
      res.status(200).json(Messsages);
    } catch (error) {
      next(error);
    }
  },
};
