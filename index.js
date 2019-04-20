const express = require('express');
const bodyParser = require('body-parser');
const WebSocket = require('ws');

const PORT = process.env.PORT || 3031;

let currentSong = '';
let sendToSocket = () => {};

server = express()
  .use(bodyParser.json())
  .post('/newsong', (req, res) => {
    const { song } = req.body;

    if (!song || typeof song !== 'string') {
      return res.sendStatus(400)
    }

    console.log(`Received new song: ${song}`);
    currentSong = song;
    sendToSocket(song);
    res.sendStatus(200);
  })
  .listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
  });

const wss = new WebSocket.Server({ server });

sendToSocket = song => {
  wss.clients.forEach(client => {
    client.send(song);
  });
};

wss.on('connection', client => {
  client.on('message', message => {
    console.log('received: %s', message);
  });

  client.send(currentSong);
});

setInterval(() => {
  wss.clients.forEach((client) => {
    client.send('PING');
  });
}, 1000);
