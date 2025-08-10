import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://banking-hackathon-2.onrender.com",
    methods: ["GET", "POST"],
  },
});

// Define Express routes here (outside connection handler)
app.get("/", (req, res) => {
  res.send("Backend server is running!");
});

let adminSocketId = null;

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Admin registers itself
  socket.on("admin-register", () => {
    adminSocketId = socket.id;
    console.log("Admin registered with socket id:", adminSocketId);
  });

  // User calls admin (server forwards to admin)
  socket.on("call-user", (data) => {
    if (adminSocketId) {
      io.to(adminSocketId).emit("incoming-call", { from: socket.id, offer: data.offer });
    } else {
      socket.emit("no-admin"); // Inform user no admin connected
    }
  });

  // Admin answers user (server forwards answer to user)
  socket.on("answer-call", (data) => {
    io.to(data.to).emit("call-answered", { answer: data.answer });
  });

  // Relay ICE candidates both ways
  socket.on("ice-candidate", (data) => {
    io.to(data.to).emit("ice-candidate", { candidate: data.candidate });
  });

  // Handle disconnects
  socket.on("disconnect", () => {
    if (socket.id === adminSocketId) {
      adminSocketId = null;
      console.log("Admin disconnected");
    }
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
