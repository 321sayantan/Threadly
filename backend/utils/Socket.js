import { Server } from "socket.io";
import express from "express";
import http from "http";
import { client, redisSub } from "./redisClient.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://admin.socket.io"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const roomMap = new Map();
let onlineUsers = {};
const socketUserMap = new Map();
const userSocketMap = new Map();
let s;

async function getReceiverSocketId(userID) {
  onlineUsers = await client.hgetall("onlineUsers");
  console.log("Passed UserID:", userID);
  console.log("socketID", onlineUsers[userID]);
  console.log("user for this socket", s.data.userID);
  // console.log("socketUserMap", socketUserMap[onlineUsers[userID]]);
  // console.log("userSocketMap", userSocketMap[userID]);
  return onlineUsers[userID];
}

function isUserInRoom(userID, convID) {
  return roomMap.get(convID)?.has(userID) || false;
}

io.on("connection", async (socket) => {
  s = socket;
  console.log("A new User Connected: ", socket.id);
  const userID = socket.handshake.query.userID;
  if (userID) {
    // console.log(userID)
    // onlineUsers[userID] = socket.id;
    await client.hset("onlineUsers", userID, socket.id);
  }

  onlineUsers = await client.hgetall("onlineUsers");
  io.emit("getOnlineUsers", Object.keys(onlineUsers));

  // Remove old socketID if it exists
  if (userSocketMap.has(userID)) {
    console.log("old socket id removed");
    const oldSocketID = userSocketMap.get(userID);
    socketUserMap.delete(oldSocketID);
  }

  userSocketMap.set(userID, socket.id);
  socketUserMap.set(socket.id, userID);

  socket.data.userID = userID; // Attach userID to socket for easy access

  socket.on("typing", (data) => {
    console.log(`user ${data.userID} is typing in  ${data.chatID}`);
    socket.to(data.chatID).emit("userTyping", {
      chatID: data.chatID,
      userID: data.userID,
    });
  });

  socket.on("stopTyping", (data) => {
    console.log(`user ${data.userID} has stopped typing in ${data.chatID}`);
    socket.to(data.chatID).emit("userStoppedTyping", {
      chatID: data.chatID,
      userID: data.userID,
    });
  });

  socket.on("joinConversation", (conversationId) => {
    const userID = socketUserMap.get(socket.id); // Get userID from current socket
    // Subscribe only once
    userSocketMap.set(userID, socket.id);
    socketUserMap.set(socket.id, userID);

    if (!roomMap.has(conversationId)) {
      roomMap.set(conversationId, new Set());
    }

    roomMap.get(conversationId).add(userID); // ✅ Use userID consistently

    redisSub.subscribe(`chat:${conversationId}`);

    // io.to(conversationId).emit("room:joined", { id: socket.data.userID });
    socket.join(conversationId); // Join Socket.IO room
    // io.to(socket.id).emit("join:room", {conversationId});
    console.log("Joined conversation");
  });

  socket.on("user:call", async ({ to, from, offer, callType, receiver }) => {
    console.log("inside user call", to, socket.id);
    const socketID = await getReceiverSocketId(to);
    io.to(socketID).emit("incomming", {
      from: socket.id,
      fromUser: from,
      offer,
      callType,
      receiver,
    });
  });

  socket.on("call:accepted", ({ to, ans }) => {
    io.to(to).emit("call:accepted", { from: socket.id, ans });
  });

  socket.on("ice-candidate", async ({ to, candidate, type }) => {
    console.log("ice-candidate ", to);
    if (type == "socketid") {
      io.to(to).emit("ice-candidate", { candidate });
    } else {
      const targetSocketId = await getReceiverSocketId(to); // map userId → socket.id
      if (targetSocketId) {
        io.to(targetSocketId).emit("ice-candidate", { candidate });
      }
    }
  });

  socket.on("call:rejected", async ({to, msg})=>{
       const receiverSocketID = await getReceiverSocketId(to);
       if (receiverSocketID) {
         io.to(receiverSocketID).emit("call:rejected", {msg});
       }
  } )

  socket.on("call:end", async ({ to }) => {
    const receiverSocketID = await getReceiverSocketId(to);
    console.log("ending call", receiverSocketID)
    if (receiverSocketID) {
      io.to(receiverSocketID).emit("call:end");
    }
  });

  socket.on("media:toggle", async (data)=>{
    const receiverSocketID = await getReceiverSocketId(data.userID);
    if (receiverSocketID) {
      io.to(receiverSocketID).emit("media:toggle", data);
    }
  })

  socket.on("leaveConversation", (conversationID) => {
    socket.leave(conversationID);
    const userID = socketUserMap.get(socket.id); // Get userID from current socket

    if (roomMap.has(conversationID)) {
      const usersInRoom = roomMap.get(conversationID);

      usersInRoom.delete(userID); // ✅ Remove by userID instead of socket.id

      if (usersInRoom.size === 0) {
        roomMap.delete(conversationID); // 🧹 Clean up empty room
      }
    }

    console.log("User", userID, "left conversation:", conversationID);
    console.log("Updated roomMap:", roomMap);
  });

  socket.on("disconnect", async () => {
    console.log("User Disconnected", socket.id);
    // delete onlineUsers[userID];
    onlineUsers = await client.hdel("onlineUsers", userID);
    io.emit("getOnlineUsers", Object.keys(onlineUsers));

    if (userID) {
      userSocketMap.delete(userID);
    }

    socketUserMap.delete(socket.id);

    // Remove user from all rooms
    for (const [conversationID, userSet] of roomMap.entries()) {
      userSet.delete(userID);
      if (userSet.size === 0) {
        roomMap.delete(conversationID);
      }
    }
  });
});

redisSub.on("message", async (channel, message) => {
  const conversationID = channel.split(":")[1];
  const parsedMessage = JSON.parse(message);
  console.log("redissub");

  io.to(conversationID).emit("newMessage", parsedMessage);

  const receiverSocketID = await getReceiverSocketId(parsedMessage.receiverID);
  io.to(receiverSocketID).emit("chatList", {
    parsedMessage,
  });

  const senderSocketID = await getReceiverSocketId(parsedMessage.senderID);
  io.to(senderSocketID).emit("chatList", {
    parsedMessage,
  });

  let isReceiverInChatRoom = isUserInRoom(
    parsedMessage.receiverID,
    conversationID
  );

  console.log("roomMap:", roomMap, isReceiverInChatRoom);

  if (isReceiverInChatRoom) {
    console.log("message seen");
    io.to(senderSocketID).emit("messageSeen", {
      chatID: conversationID,
      messageIDs: parsedMessage._id,
      seenBy: parsedMessage.receiverID,
    });
  }
});

export { app, server, io, getReceiverSocketId, isUserInRoom };
