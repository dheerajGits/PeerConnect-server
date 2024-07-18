import PrismaClient from "../utils/PrismaClient";

class AttendeeServices {
  public attendees = PrismaClient.meetingAttendee;
  public meetings = PrismaClient.meetings;
  public createAttendee = async (meetingId: string, userId: string) => {
    const attendee = await this.attendees.create({
      data: {
        joinedAt: new Date(),
        userId: userId,
        meetingId: meetingId,
        meetingsId: meetingId,
        leftAt: new Date(),
      },
    });
    return attendee;
  };
  public getAllLiveAttendees = async (meetingId: string): Promise<any> => {
    const attendees = await this.attendees.findMany({
      where: {
        meetingId: meetingId,
      },
    });
    return attendees;
  };
  public removeAttendeeFromMeetings = async (
    meetingId: string,
    attendeeId: string
  ): Promise<any> => {
    const removedAttendee = await this.meetings.update({
      where: {
        id: meetingId,
      },
      data: {
        meetingAttendees: {
          disconnect: {
            id: attendeeId,
          },
        },
      },
    });
    return removedAttendee;
  };
}
export default AttendeeServices;
