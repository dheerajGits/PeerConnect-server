import PrismaClient from "../utils/PrismaClient";

class AttendeeServices {
  public attendees = PrismaClient.meetingAttendee;
  public meetings = PrismaClient.meetings;
  public createAttendee = async (meetingId: string, userId: string) => {
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
}
export default AttendeeServices;
