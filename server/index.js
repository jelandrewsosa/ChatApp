const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());
const server = http.createServer(app);
const port = 3001;

// setup to connect to the frontend/client
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PATCH", "DELETE"],
  },
});

// if someone connects to the server
io.on("connection", (socket) => {
  console.log(`User Connected : ${socket.id}`);

  // gets the roomId which is the data from the frontend/client
  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  // send_message is the event name
  // this will receive the message from the client/frontend
  socket.on("send_message", (data) => {
    // send all the message to the specific room users joined
    socket.to(data.room).emit("receive_message", data);
  })

  socket.on("delete_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  })

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(port, () => {
  console.log("SERVER IS RUNNING");
});
