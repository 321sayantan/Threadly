import Conversation from "../Models/conversation.model.js";
import message from "../Models/message.model.js";
import Message from "../Models/message.model.js";
import { produceMessage } from "../utils/kafka.js";
import { redisPub } from "../utils/redisClient.js";
import { getReceiverSocketId, io, isUserInRoom } from "../utils/Socket.js";
import { v4 as uuidv4 } from "uuid";

export const sendMessage = async (req, res) => {
  try {
    const senderID = req.id;
    const receiverID = req.params.id;
    const { text, conversationID } = req.body;

    // console.log(senderID, receiverID, text)

    // let conversation = await Conversation.findOne({
    //   participants: { $all: [senderID, receiverID] },
    // });

    let isReceiverInChatRoom = isUserInRoom(receiverID, conversationID);

    // if (receiverSocketID) {
      // const receiverSocket = io.sockets.sockets.get(receiverSocketID);
      // if (receiverSocket && receiverSocket.rooms.has(conversationID)) {
      //   console.log(27, receiverSocket.rooms.has(conversationID));
      //   isReceiverInChatRoom = true;
      // }
    // }

    const newMessage = {
      _id: uuidv4(),
      senderID,
      receiverID,
      conversationID,
      text,
      seen: isReceiverInChatRoom,
      createdAt: new Date().toISOString(),
    };

    //kafka
    produceMessage(newMessage);

    // 🧠 Redis Key
    const redisKey = `message:conversation:${conversationID}`;

    // 🧠 Check if conversation exists in Redis
    const cached = await redisPub.get(redisKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      parsed.messages.push(newMessage);
      parsed.lastMessage = text;

      await redisPub.set(redisKey, JSON.stringify(parsed));
    } else {
      let conversation = await Conversation.findOne({ _id: conversationID })
        .populate("messages")
        .populate({
          path: "participants",
          select: "_id username profilePicture",
        });

      let updatedConversation;

      if (!conversation) {
        updatedConversation = {
          participants: [senderID, receiverID],
          lastMessage: text,
          messages: [newMessage],
        };
      }
      // If no conversation found in Redis, create new structure
      updatedConversation = {
        participants: [senderID, receiverID],
        lastMessage: text,
        messages: conversation.messages,
      };
      updatedConversation.messages.push(newMessage);
      await redisPub.set(redisKey, JSON.stringify(updatedConversation));
    }

    // 🔒 Optional: Set TTL to auto-expire cache after 30 mins
    await redisPub.expire(redisKey, 60 * 30); // 30 minutes

    //Publish via Redis Pub/Sub
    await redisPub.publish(
      `chat:${conversationID}`,
      JSON.stringify(newMessage)
    );

    res.status(200).json({ success: true, newMessage });
  } catch (error) {
    console.log(error);
  }
};

export const getMessage = async (req, res) => {
  try {
    const userID = req.id;
    const conversationID = req.params.id;

    console.log("inside getMessage");
    const redisKey = `message:conversation:${conversationID}`;

    const cachedConversation = await redisPub.get(redisKey);
    // console.log(105,cachedConversation)
    let conversation;

    if (cachedConversation) {
      conversation = JSON.parse(cachedConversation);
      // console.log(110,parsed)
      // const updateMessages = parsed.messages.map((m) => {
      //   if (m.senderID !== userID && m.seen === false) {
      //     return {
      //       ...m,
      //       seen: true,
      //     };
      //   }
      //   return m;
      // });
      // conversation = {
      //   ...parsed,
      //   messages: updateMessages,
      //   unseen: 0,
      // };

      // return res
      //   .status(200)
      //   .json({ success: true, conversation: conversation });
    } else {
      conversation = await Conversation.findOne({ _id: conversationID })
        .populate("messages")
        .populate({
          path: "participants",
          select: "_id username profilePicture",
        });

        conversation = conversation.toObject();

      console.log(138, conversation)

      if (!conversation) {
        return res.status(200).json({ success: true, message: [] });
      }
    }

    const receiver = conversation.participants.find((p) => {
      return p._id.toString() !== userID;
    });

    const messagesToMarkSeen = conversation.messages.filter((m) => {
      // console.log(m);
      if (
        m.conversationID.toString() === conversationID &&
        m.senderID.toString() !== userID &&
        m.seen === false
      )
        return m;
    });
    console.log(messagesToMarkSeen);

    // socket 9:00
    if (messagesToMarkSeen.length > 0) {
        console.log("message seem emit")
        io.to(conversationID).emit("messageSeen", {
          chatID: conversationID,
          messageIDs: messagesToMarkSeen.map((m) => m._id),
          seenBy: receiver._id,
        });
    }

     const updateMessages = conversation.messages.map((m) => {
       if (m.senderID !== userID && m.seen === false) {
         return {
           ...m,
           seen: true,
         };
       }
       return m;
     });

     conversation = {
       ...conversation,
       messages: updateMessages,
       unseen: 0,
       receiver,
     };

    // const newConversation = {
    //   ...conversation,
    //   receiver,
    // };

    // console.log(169, conversation);

    await redisPub.set(redisKey, JSON.stringify(conversation));
    await redisPub.expire(redisKey, 60 * 30); // 30 min TTL

    await Message.updateMany(
      {
        conversationID: conversationID,
        senderID: { $ne: userID },
        seen: false,
      },
      { seen: true }
    );

    return res.status(200).json({ success: true, conversation: conversation });
  } catch (error) {
    console.log(error);
  }
};
