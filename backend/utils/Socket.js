import { Server } from "socket.io";
import express from "express";
import http from "http";
import { instrument } from "@socket.io/admin-ui";

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


const userSocketMap = {};

function getReceiverSocketId(userID) {
  return userSocketMap[userID];
}

io.on("connection", (socket) => {
  console.log("A new User Connected: ", socket.id);
  const userID = socket.handshake.query.userID;
  if (userID) {
    // console.log(userID)
    userSocketMap[userID] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
    delete userSocketMap[userID];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});


export { app, server, io, getReceiverSocketId };
