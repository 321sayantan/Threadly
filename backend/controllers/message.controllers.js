import Conversation from "../Models/conversation.model.js";
import Message from "../Models/message.model.js";
import { getReceiverSocketId, io } from "../utils/Socket.js";

export const sendMessage = async (req, res) => {
  try {
    const senderID = req.id;
    const receiverID = req.params.id;
    const { text } = req.body;

    // console.log(senderID, receiverID, text)

    let conversation = await Conversation.findOne({
      participants: { $all: [senderID, receiverID] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderID, receiverID],
      });
    }

    const newMessage = await Message.create({
      senderID,
      receiverID,
      text,
    });

    if (newMessage) conversation.messages.push(newMessage._id);
    await Promise.all([conversation.save(), newMessage.save()]);


    

    //implement socket for real time data transfer
    const receiverSocketID = getReceiverSocketId(receiverID);
    if(receiverSocketID)
    {
      io.to(receiverSocketID).emit("newMessage", newMessage);
      console.log(newMessage);
    }

    res.status(200).json({ success: true, newMessage });
  } catch (error) {
    console.log(error);
  }
};

export const getMessage = async (req, res) => {
  try {
    const senderID = req.id;
    const receiverID = req.params.id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderID, receiverID] },
    }).populate("messages");

    if (!conversation) {
      return res.status(200).json({ success: true, message: [] });
    }

    return res
      .status(200)
      .json({ success: true, message: conversation.messages });
  } catch (error) {
    console.log(error);
  }
};
