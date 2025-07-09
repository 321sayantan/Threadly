import Conversation from "../Models/conversation.model.js";
import Message from "../Models/message.model.js";
import { produceMessage } from "../utils/kafka.js";
import { redisPub } from "../utils/redisClient.js";
import { getReceiverSocketId, io } from "../utils/Socket.js";

export const sendMessage = async (req, res) => {
  try {
    const senderID = req.id;
    const receiverID = req.params.id;
    const { text, conversationID } = req.body;

    // console.log(senderID, receiverID, text)

    // let conversation = await Conversation.findOne({
    //   participants: { $all: [senderID, receiverID] },
    // });
    
    const newMessage = {
      senderID,
      receiverID,
      conversationID,
      text,
      createdAt: new Date().toISOString(),
    };
    
    //kafka
    produceMessage(newMessage);
    
    //cache in Redis
    await redisPub.rpush(
      `message:conversation:${conversationID}`,
      JSON.stringify(newMessage)
    );

    await redisPub.expire(`message:conversation:${conversationID}`, 60 * 30);

    //Publish via Redis Pub/Sub
    await redisPub.publish(
      `chat:${conversationID}`,
      JSON.stringify(newMessage)
    );
    
    
    res.status(200).json({ success: true, newMessage });
    
    
    
    
    
    
    
    // const conversation_present = await redisPub.exists(
    //   `message:conversation:${conversationID}`
    // );
    // console.log(conversation_present);

    // if(!conversation_present)
    // {
    //   conversation = await Conversation.findById(conversationID);
    //   // console.log(conversation);

    //   if (!conversation) {
    //     conversation = await Conversation.create({
    //       participants: [senderID, receiverID],
    //     });

    //     conversationID = conversation._id;
    //   }

    //   if (newMessage) conversation.messages.push(newMessage._id);

    //   await conversation.save();
    // }

    // await Promise.all([newMessage.save()]);



    //implement socket for real time data transfer
    // const receiverSocketID = getReceiverSocketId(receiverID);
    // if(receiverSocketID)
    // {
    //   // io.to(receiverSocketID).emit("newMessage", newMessage);
    //   console.log(newMessage);
    // }

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
      .json({ success: true, conversation: conversation });
  } catch (error) {
    console.log(error);
  }
};
