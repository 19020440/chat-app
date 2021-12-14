const mongoose = require("mongoose");

const NotifySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
    },
    des: {
      type: String,
    },
    seen: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notify", NotifySchema);
