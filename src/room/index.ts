import { Socket } from "socket.io";
import { v4 as uuidV4 } from "uuid";
import PrismaClient from "../utils/PrismaClient";

const meetings = PrismaClient.meetings;
const user = PrismaClient.user;

export const roomHandler = (socket: Socket) => {
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
    socket.emit("room-created", { roomId });
    console.log("user created a room");
  };

  const createUser = async () => {
    const User = await user.create({
      data: {
        phone: "",
        name: "",
      },
    });
    console.log("User created: ", User);
    socket.emit("connection", { id: User.id });
  };

  const joinRoom = async ({ id }: { id: string }) => {
    console.log("user joined a room", id);
    // await meetings.update({
    //   where: {
    //     id: id,
    //   },
    //   data: {
    //     users: {
    //       connect: {
    //         id: id,
    //       },
    //     },
    //   },
    // });
    socket.join(id);
  };

  socket.on("connection", createUser);
  socket.on("join-room", joinRoom);

  socket.on("create-room", createRoom);
};
