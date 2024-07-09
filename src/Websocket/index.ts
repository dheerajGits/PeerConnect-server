import { Socket, Server } from "socket.io";
import { v4 as uuidV4 } from "uuid";
import PrismaClient from "../utils/PrismaClient";
import express from "express";
import AttendeeServices from "../services/Attendee.services";
import http from "http";

class WSS {
  public meetings = PrismaClient.meetings;
  public user = PrismaClient.user;
  public participants = PrismaClient.meetingAttendee;
  public attendeeServices = new AttendeeServices();
  public wss: Server;

  constructor(port?: number) {
    const app = express();
    const server = http.createServer(app);
    this.wss = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });
    server.listen(port || 3031);
    this.wss.on("connection", (socket: Socket) => {
      console.log("User Connected");
      this.initializeRoom(socket);
    });
  }

  public initializeRoom = (socket: Socket) => {
    socket.on("join-room", this.joinRoom);
    socket.on("create-room", () => {
      this.createRoom(socket);
    });
    socket.on("disconnect", () => {
      console.log("user is disconnected");
    });
    socket.on("create-user", () => {
      this.createUser(socket);
    });
  };

  public createUser = async (socket: Socket) => {
    const User = await this.user.create({
      data: {
        phone: uuidV4(),
        name: "",
      },
    });
    console.log("user-created: ", User);
    socket.emit("create-user-afterJoin", { userId: User.id });
  };
  public createRoom = async (socket: Socket) => {
    const User = await this.user.create({
      data: {
        phone: uuidV4(),
        name: "",
      },
    });
    const meetingDetails = await this.meetings.create({
      data: {
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
    const participant = await this.attendeeServices.createAttendee(
      meetingDetails.id,
      User.id
    );
    socket.join(meetingDetails.id);
    console.log("user created a room");
    socket.emit("room-created", {
      roomId: meetingDetails.id,
      participantId: participant.id,
    });
  };

  public joinRoom = async ({
    id,
    participantId,
  }: {
    id: string;
    participantId: string;
  }) => {
    await this.meetings.update({
      where: {
        id,
      },
      data: {
        meetingAttendees: {
          connect: {
            id: participantId,
          },
        },
      },
    });
  };
}
export default WSS;
