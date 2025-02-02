import mongoose, { mongo } from "mongoose";

const messageModel = new mongoose.Schema({
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
  text: { type: String, required: true },
});

export default message = mongoose.model("Message", messageModel);
