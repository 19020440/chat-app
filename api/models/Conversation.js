const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema(
  {
    members: {
      type: Object,
    },
    lastText: {
      type: Object,
      default: {},
    },
    name: {
      type: String,
      default: null,
    },
    covImage: {
      type: String,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", ConversationSchema);
