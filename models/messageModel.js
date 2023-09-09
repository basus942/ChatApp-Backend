const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema(
  {
    conversationId: { type: String },
    senderId: { type: String },
    text: { type: String },
  },
  { timestamps: true }
);

const Messages = mongoose.model("Messages", MessageSchema);
module.exports = Messages;
