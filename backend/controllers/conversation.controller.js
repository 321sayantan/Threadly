import { Socket } from "socket.io";
import Conversation from "../Models/conversation.model.js";
import User from "../Models/user.model.js";
import { getReceiverSocketId, io } from "../utils/Socket.js";

export const createChat = async (req, res) => {
  try {
    const senderID = req.id;
    const receiverID = req.params.id;

    if (!receiverID) {
      res.status(404).json({ message: "receiver ID required", success: false });
    }

    // Check if conversation already exists
    let existingConversation = await Conversation.findOne({
      participants: { $all: [senderID, receiverID] },
    });

    if (existingConversation) {
      return res
        .status(200)
        .json({ success: true, conversation: existingConversation });
    }

    // Create a new conversation
    const newConversation = await Conversation.create({
      participants: [senderID, receiverID],
      lastMessage: "",
    });
    console.log(newConversation);

    const user = await User.findById(senderID).select("-password");
    user.chats.push(newConversation._id);
    await user.save();

    const receiver = await User.findById(receiverID).select("-password");
    receiver.chats.push(newConversation._id);
    await receiver.save();

    const receiverSocketID = await getReceiverSocketId(receiverID);
    io.to(receiverSocketID).emit("newConversation", {
      lastMessage: "",
      updatedAt: newConversation.updatedAt,
      conversationID: newConversation._id,
      unseen: 0,
      receiver: {
        _id: user._id,
        username: user.username,
        profilePicture: user.profilePicture,
      },
    });

    return res
      .status(201)
      .json({ success: true, conversation: newConversation });
  } catch (error) {
    console.log(error);
  }
};

export const getChatList = async (req, res) => {
  try {
    const userID = req.id;
    console.log(userID);
    const user = await User.findById(userID)
      .select("chats")
      .populate({
        path: "chats",
        populate: [
          {
            path: "participants",
            select: "_id username profilePicture",
          },
          {
            path: "messages",
          },
        ],
      });
    // console.log(user)
    if (!user) {
      res.status(404).json({ message: "user not found", success: false });
    }

    const list = user.chats.map((chat) => {
      const participants = chat.participants.filter((p) => {
        // console.log(p._id.toString(), userID.toString());
        return p._id.toString() !== userID;
      });
      const receiver = participants[0];

      const unSeenMessages = chat.messages.filter((m) => {
        if (m.seen === false && m.senderID.toString() !== userID) {
          return m;
        }
      });

      return {
        lastMessage: chat.lastMessage,
        updatedAt: chat.updatedAt,
        conversationID: chat._id,
        unseen: unSeenMessages.length,
        receiver,
      };
    });

    // console.log(list);

    res.status(200).json({ chatList: list, success: true });
  } catch (error) {}
};
