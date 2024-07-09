import PrismaClient from "../utils/PrismaClient";

class AttendeeServices {
  public attendees = PrismaClient.meetingAttendee;
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
}
export default AttendeeServices;
