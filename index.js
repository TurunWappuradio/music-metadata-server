const express = require('express');
const WebSocket = require('ws');

const PORT = process.env.PORT || 3031;

let currentSong = '';

server = express()
  .post('newsong', (req, res) => {
    const song = req.body;

    if (!song || typeof song !== 'string') {
      return res.sendStatus(400)
    }

    currentSong = song;
    res.sendStatus(200);
  })
  .listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
  });

const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {
  ws.send(currentSong);
});
