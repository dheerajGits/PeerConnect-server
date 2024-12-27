import { Socket } from "socket.io";
import { InCallMessageRecieved } from "../Interfaces/InCallMessage";
class ChatUtil {
  public socket: Socket;
  constructor(socket: Socket) {
    this.socket = socket;
  }
  public initializeChatModal = () => {
    this.socket.on(
      "send-message",
      (roomId: string, messageBody: InCallMessageRecieved) => {
        this.broadcastMessage(roomId, messageBody);
      }
    );
  };

  public broadcastMessage = (
    roomId: string,
    messageBody: InCallMessageRecieved
  ) => {
    this.socket.to(roomId).emit("message-recieved", messageBody);
  };
}
export default ChatUtil;
