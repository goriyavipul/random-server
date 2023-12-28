const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { v4: uuidV4 } = require('uuid');
const path = require("path");
const cors = require("cors");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // Update the views path accordingly

app.use(express.static("public"));
app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => {
  res.redirect(`/${uuidV4()}`);
});

app.get("/healthcheck", (req, res) => {
  console.log("working find");
  res.send({ success: true });
});

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.broadcast.emit("user-connected", userId);

    socket.on("disconnect", () => {
      socket.broadcast.emit("user-disconnected", userId);
    });
  });
});

server.listen(3005, () => {
  try {
    console.log("Server running on port 3005");
  } catch (err) {
    console.log("err", err);
  }
});
