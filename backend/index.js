require('dotenv').config();

const http = require("http");
const express = require("express");
const app = express();
const socketInstance = require("socket.io");
const cors = require("cors");
const mockData = require("./mockData.json");

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = socketInstance(server);

const users = new Map()
users.set('Alex', {room: 2, progress: 20})
users.set('Lex', {room: 4, progress: 68})

function filterByRoom(name) {
  return new Map(
    [...users].filter(([,{room}]) => room === name)
  )
}

function onNewWebsocketConnection(socket) {
  console.info(`Socket ${socket.id} has connected.`);

  socket.on("disconnect", () => {
    console.info(`Socket ${socket.id} has disconnected.`);
  });

  socket.on("progress", (data) => {
    users.set(data.user, {room: data.room, progress: data.progress});
    socket.broadcast.emit("users-in-room", [...filterByRoom(Number(data.room))]);
    socket.emit("users-in-room", [...filterByRoom(Number(data.room))]);
  })

  socket.on("connect-to-room", (data) => {
    users.set(data.user, {room: data.room, progress: 0})
    socket.broadcast.emit("users-in-room", [...filterByRoom(Number(data.room))]);
    socket.emit("users-in-room", [...filterByRoom(Number(data.room))]);
  })

  socket.on("disconnect-from-room", (data) => {
    users.delete(data.user)
  })
}

function startServer() {
  io.on("connection", onNewWebsocketConnection);
  server.listen(port, () => console.info(`Listening on port ${port}.`));

  app.get("/:id", (req, res) => {
    res.json(mockData[req.params.id]);
  })
}

startServer();
