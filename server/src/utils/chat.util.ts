import { Socket } from "socket.io";
import { InCallMessage } from "../Interfaces/InCallMessage";
export function initializeChatModal(socket: Socket) {
  socket.on("send-message", (roomId: string, messageBody: InCallMessage) => {
    console.log("Message Recieved from room ", roomId, " ", messageBody);
    broadcastMessage(roomId, messageBody, socket);
  });
}

function broadcastMessage(
  roomId: string,
  messageBody: InCallMessage,
  socket: Socket
) {
  socket.to(roomId).emit("message-recieved", messageBody);
}
