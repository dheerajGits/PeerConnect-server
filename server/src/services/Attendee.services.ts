import PrismaClient from "../utils/PrismaClient";
// utility class for handling db related logic for Meeting Attendees and host
class AttendeeServices {
  public attendees = PrismaClient.meetingAttendee;
  public meetings = PrismaClient.meetings;
  public hosts = PrismaClient.host;
  public chats = PrismaClient.chat;
  public createAttendee = async (meetingId: string, userId: string) => {
    const findAttendee = await this.attendees.findMany({
      where: {
        AND: [
          {
            userId,
          },
          {
            meetingId,
          },
        ],
      },
    });
    if (findAttendee.length > 0) {
      return null;
    }
    const attendee = await this.attendees.create({
      data: {
        joinedAt: new Date(),
        userId,
        meetingId,
        meetingsId: meetingId,
      },
    });
    return attendee;
  };

  public getAllLiveAttendees = async (meetingId: string): Promise<any> => {
    const attendees = await this.attendees.findMany({
      where: {
        AND: [
          {
            meetingId,
          },
          {
            leftAt: null,
          },
        ],
      },
    });
    return attendees;
  };

  public removeAttendeeFromMeeting = async (
    attendeeId: string
  ): Promise<any> => {
    // will be used by websocket event
    const attendee = await this.attendees.update({
      where: {
        id: attendeeId,
      },
      data: {
        leftAt: new Date(),
      },
    });
    return attendee;
  };
  public findParticipantAvailabilty = async (
    participantId: string,
    meetingId: string
  ) => {
    const participantData = await this.attendees.findMany({
      where: {
        AND: [
          {
            meetingId,
          },
          {
            id: participantId,
          },
        ],
      },
    });
    return participantData;
  };
  public findCameraEnabbled = async (meetingId: string) => {
    const participants = await this.attendees.findMany({
      where: {
        AND: [
          {
            meetingId,
          },
          {
            leftAt: null, // signifies that the participant has not left till now
          },
          {
            isCameraOn: true,
          },
        ],
      },
    });
    return participants;
  };

  public toggleCameraOn = async (participantId: string, value: boolean) => {
    const participant = await this.attendees.update({
      where: {
        id: participantId,
      },
      data: {
        isCameraOn: value,
      },
    });
    return participant;
  };
  public addHostInMeeting = async (
    meetingId: string,
    participantId: string
  ) => {
    const host = await this.hosts.create({
      data: {
        meetingId,
        participantId,
      },
    });
    // connect the host to the meeting
    await this.meetings.update({
      where: {
        id: meetingId,
      },
      data: {
        meetingHosts: {
          connect: {
            id: host.id,
          },
        },
      },
    });
  };

  public getMeetingHostsParticipantIds = async (meetingId: string) => {
    const hosts = await this.hosts.findMany({
      where: {
        meetingId,
      },
      select: {
        participantId: true,
      },
    });
    return hosts;
  };

  public addParticipantChat = async (
    meetingId: string,
    participantId: string,
    chatContent: string
  ) => {
    const meetingIdbyParticipantId = await this.attendees.findUnique({
      where: {
        id: participantId,
      },
      select: {
        meetingId: true,
      },
    });
    if (meetingId == meetingIdbyParticipantId?.meetingId) {
      const chat = await this.chats.create({
        data: {
          participantId,
          meetingId,
          message: chatContent,
        },
      });
      return chat;
    }
    return null;
  };
}

export default AttendeeServices;
