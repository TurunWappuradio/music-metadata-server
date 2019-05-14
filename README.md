# music-metadata-server
Receive metadata as a HTTP POST request and send it to clients via websockets.

Runs on a remote server listening for song updates from
[parser](https://github.com/TurunWappuradio/music-metadata-parser).
Sends updates to clients via websockets on receiving new song.
