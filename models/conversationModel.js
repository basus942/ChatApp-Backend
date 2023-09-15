const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ConversationSchema = new Schema(
  {
    members: { type: Array },
  },
  { timestamps: true }
);

const Conversations = mongoose.model("Conversations", ConversationSchema);
module.exports = Conversations;
