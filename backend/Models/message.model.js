import mongoose, { mongo } from "mongoose";

const messageModel = new mongoose.Schema(
  {
    senderID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    conversationID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
    },
    text: { type: String, required: true },
    seen: { type: Boolean, default: false },
    seenAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const message = mongoose.model("Message", messageModel);
export default message;
