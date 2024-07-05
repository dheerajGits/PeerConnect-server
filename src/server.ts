import express from "express";
import http from "http";
import cors from "cors";
import WSS from "./Websocket";

const port = 3030;

const app = express();

app.use(cors);

const server = http.createServer(app);
const WebSocketPort = 3031;
new WSS(WebSocketPort); // initialized

server.listen(port, () => {
  console.log(`listening to server on port ${port}`);
  console.log(`Websocket Listening on port ${WebSocketPort || 3031}`);
});
