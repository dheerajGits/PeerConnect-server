import { Socket } from "socket.io";
import { v4 as uuidV4 } from "uuid";
import PrismaClient from "../utils/PrismaClient";

const meetings = PrismaClient.meetings;

class Room {
  public meetings = PrismaClient.meetings;
  public user = PrismaClient.user;

  public initializeRoom = (socket: Socket) => {
    const createRoom = async () => {
      const User = await user.create({
        data: {
          phone: "",
          name: "",
        },
      });
      const roomId = uuidV4();
      const addRoom = await meetings.create({
        data: {
          id: roomId,
          startDateTime: new Date(),
          endDateTime: new Date(),
          durationInHours: "1",
          users: {
            connect: {
              id: User.id,
            },
          },
        },
      });
      console.log(addRoom);
      socket.join(roomId);
      socket.emit("room-created", { roomId: roomId, userId: User.id });
      console.log("user created a room");
    };
    socket.on("join-room", this.joinRoom);
    socket.on("create-room", createRoom);
  };

  public joinRoom = async ({ id }: { id: string }) => {
    // when the user joins a room we need to add him in the meeting
    const User = await user.create({
      data: {
        phone: "",
        name: "",
      },
    });
    console.log("user joined a room", id);
    await meetings.update({
      where: {
        id: id,
      },
      data: {
        users: {
          connect: {
            id: User.id,
          },
        },
      },
    });
  };
}
export default Room;
