const express = require("express");
const bodyParser = require("body-parser");
const WebSocket = require("express-ws");
const { dispatchMetaInformation } = require("./src/bots");

const PORT = process.env.PORT || 3031;
const MUSIC_API_PASSWORD = process.env.MUSIC_API_PASSWORD;

let currentSong = "";
let sendToSocket = () => {};

const app = express();
const expressWs = WebSocket(app);
const wss = expressWs.getWss("/");

app.use(
  bodyParser.json({
    type: ["application/json", "text/plain"] // for getting past Heroku CORS block
  })
);

app.post("/newsong", (req, res) => {
  // TODO: password should not be in body
  const { song, password } = req.body;

  if (!song || typeof song !== "string") {
    return res.sendStatus(400); // 400 Bad Request
  }

  if (password !== MUSIC_API_PASSWORD) {
    return res.sendStatus(403); // 403 Forbidden
  }

  console.log(`Received new song: ${song}`);
  currentSong = song;
  sendToSocket(song);
  res.sendStatus(200);
});

sendToSocket = song => {
  if (song !== "") {
    dispatchMetaInformation(song);
    wss.clients.forEach(client => {
      client.send(song);
    });
  }
};

app.ws("/", client => {
  client.on("message", message => {
    if (message !== "PONG") {
      console.log("received: %s", message);
    }
  });

  if (currentSong !== "") {
    client.send(currentSong);
  }
});

setInterval(() => {
  wss.clients.forEach(client => {
    client.send("PING");
  });
}, 1000);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
