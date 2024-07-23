import PrismaClient from "../utils/PrismaClient";

class AttendeeServices {
  public attendees = PrismaClient.meetingAttendee;
  public meetings = PrismaClient.meetings;
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
}
export default AttendeeServices;
