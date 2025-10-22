import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Store online users for 1:1 chat
const userSocketMap = {}; // { userId: socketId }

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  // Emit updated online users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  /** 1:1 Chat */
  socket.on("privateMessage", ({ toUserId, text, sender }) => {
    const receiverSocketId = userSocketMap[toUserId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("privateMessage", { text, sender });
    }
    socket.emit("privateMessage", { text, sender }); // also send to sender
  });

  /** Group Chat */
  socket.on("joinRoom", ({ roomName }) => {
    socket.join(roomName);
    console.log(`User ${userId} joined room ${roomName}`);
  });

  socket.on("roomMessage", ({ roomName, sender, text }) => {
    io.to(roomName).emit("roomMessage", { sender, text });
  });

  socket.on("leaveRoom", ({ roomName }) => {
    socket.leave(roomName);
    console.log(`User ${userId} left room ${roomName}`);
  });

  /** Disconnect */
  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    if (userId) delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
