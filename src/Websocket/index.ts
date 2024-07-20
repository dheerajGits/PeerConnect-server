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
  public server: http.Server;
  public wss: Server;
  public app: express.Application;

  constructor(port?: number) {
    this.app = express();
    this.server = http.createServer(this.app);
    this.wss = new Server(this.server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });
    this.server.listen(port || 3031);
    this.wss.on("connection", (socket: Socket) => {
      console.log("User Connected");
      this.initializeRoom(socket);
    });
  }

  public initializeRoom = (socket: Socket) => {
    // this is when user joins a room
    socket.on(
      "join-room",
      ({
        id,
        participantId,
        userId,
      }: {
        id: string;
        participantId: string;
        userId: string;
      }) => {
        console.log(id, "  ", participantId);
        this.joinRoom(id, participantId, userId, socket);
      }
    );

    // this when a user creates a room
    socket.on("create-room", () => {
      this.createRoom(socket);
    });

    // this is when a user is disconnected
    socket.on("disconnect", (data: any) => {
      console.log(data);
      console.log("user is disconnected");
    });

    // this is when we need to create a user and attendee
    socket.on("create-attendee", ({ meetingId }: { meetingId: string }) => {
      this.createAttendee(socket, meetingId);
    });
  };

  public createAttendee = async (socket: Socket, meetingId: string) => {
    const User = await this.user.create({
      data: {
        phone: uuidV4(),
        name: "",
      },
    });
    const attendee = await this.attendeeServices.createAttendee(
      meetingId,
      User.id
    );
    console.log("user-created: ", User);
    socket.emit("create-user-afterJoin", {
      userId: User.id,
      participantId: attendee.id,
    });
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
      userId: User.id,
      participantId: participant.id,
    });
  };

  public joinRoom = async (
    id: string,
    participantId: string,
    userId: string,
    socket: Socket
  ) => {
    if (!participantId) {
      // this means that the participant has not been created yet so we would be creating a participant
      const participant = await this.attendeeServices.createAttendee(
        id,
        userId
      );
      participantId = participant.id;
    }
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

    socket.join(id);

    socket.to(id).emit("participant-joined", participantId);

    socket.emit("get-users", {
      participants: await this.attendeeServices.getAllLiveAttendees(id),
    });

    // handle on disconnect case
    socket.on("disconnect", async () => {
      await this.attendeeServices.removeAttendeeFromMeeting(participantId);

      socket.to(id).emit("user-disconnected", { meetingId: id, participantId });
    });
  };
}
export default WSS;
