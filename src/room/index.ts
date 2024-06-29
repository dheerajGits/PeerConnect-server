import { Socket } from "socket.io";
import { v4 as uuidV4 } from "uuid";
import PrismaClient from "../utils/PrismaClient";

const meetings = PrismaClient.meetings;

export const roomHandler = (socket: Socket) => {
  const createRoom = async () => {
    const roomId = uuidV4();
    const addRoom = await meetings.create({
      data: {
        id: roomId,
        startDateTime: new Date(),
        endDateTime: new Date(),
        durationInHours: "1",
      },
    });
    console.log(addRoom);
    socket.join(roomId);
    socket.emit("room-created", { roomId });
    console.log("user created a room");
  };

  const joinRoom = ({ id }: { id: string }) => {
    console.log("user joined a room", id);
    socket.join(id);
  };

  socket.on("join-room", joinRoom);

  socket.on("create-room", createRoom);
};
