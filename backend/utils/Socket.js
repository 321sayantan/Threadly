import { Server } from "socket.io";
import express from "express";
import http from "http";
import { instrument } from "@socket.io/admin-ui";
import {client} from "./redisClient.js"

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://admin.socket.io"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

instrument(io, {
  auth: false,
  mode: "development",
});


let userSocketMap = {};

function getReceiverSocketId(userID) {
  return userSocketMap[userID];
}

io.on("connection", async (socket) => {
  console.log("A new User Connected: ", socket.id);
  const userID = socket.handshake.query.userID;
  if (userID) {
    // console.log(userID)
    // userSocketMap[userID] = socket.id;
    await client.hset("onlineUsers", userID, socket.id);
  }

  userSocketMap = await client.hgetall("onlineUsers");
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", async () => {
    console.log("User Disconnected", socket.id);
    // delete userSocketMap[userID];
    userSocketMap = await client.hdel("onlineUsers", userID);
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});


export { app, server, io, getReceiverSocketId };
