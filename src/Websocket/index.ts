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
      // console.log("User Connected");
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
        this.joinRoom(id, participantId, userId, socket);
      }
    );

    // this when a user creates a room
    socket.on("create-room", () => {
      this.createRoom(socket);
    });

    // this is when a user is disconnected
    socket.on("disconnect", () => {
      console.log("user is disconnected");
    });

    // this is when we need to create a user and attendee
    socket.on(
      "create-attendee-and-join",
      ({ meetingId }: { meetingId: string }) => {
        this.createAttendeeAndJoin(socket, meetingId);
      }
    );

    // to reinitiate a call when the call failed
    // socket.on("call-to-peer-failed", (participantId: string) => {
    //   console.log("renitiating-call-to participant with id: ", participantId);
    //   socket.emit("reinitate-call", participantId);
    // });
  };

  public createAttendeeAndJoin = async (socket: Socket, meetingId: string) => {
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
    const participantId = attendee?.id;
    await this.meetings.update({
      where: {
        id: meetingId,
      },
      data: {
        meetingAttendees: {
          connect: {
            id: participantId,
          },
        },
      },
    });

    socket.join(meetingId);
    socket.on("user-ready-to-be-called", () => {
      console.log("participant ready to be called");
      socket.to(meetingId).emit("participant-joined", participantId);
    });

    socket.emit("get-users", {
      participants: await this.attendeeServices.getAllLiveAttendees(meetingId),
    });

    // handle on disconnect case
    socket.on("disconnect", async () => {
      await this.attendeeServices.removeAttendeeFromMeeting(
        participantId ?? ""
      );

      socket
        .to(meetingId)
        .emit("user-disconnected", { meetingId, participantId });
    });

    socket.emit("create-user-afterJoin", {
      user: User.id,
      participant: attendee?.id,
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
    if (participant?.id) {
      await this.meetings.update({
        where: {
          id: meetingDetails.id,
        },
        data: {
          meetingAttendees: {
            connect: {
              id: participant.id,
            },
          },
        },
      });
    }
    socket.join(meetingDetails.id);
    socket.on("user-ready-to-be-called", () => {
      socket.to(meetingDetails.id).emit("participant-joined", participant?.id);
    });
    socket.emit("room-created", {
      roomId: meetingDetails.id,
      User: User.id,
      participant: participant?.id,
    });
  };

  public joinRoom = async (
    id: string,
    participantId: string,
    userId: string,
    socket: Socket
  ) => {
    if (!participantId) {
      console.log("No participantId given");
      // this means that the participant has not been created yet so we would be creating a participant
      const participant = await this.attendeeServices.createAttendee(
        id,
        userId
      );
      if (participant?.id) {
        participantId = participant.id;
      }
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
    socket.on("user-ready-to-be-called", () => {
      socket.to(id).emit("participant-joined", participantId);
    });

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
