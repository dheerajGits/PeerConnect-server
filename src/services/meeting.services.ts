import PrismaClient from "../utils/PrismaClient";

class MeetingServices {
  public meetings = PrismaClient.meetings;
  public createMeeting = async (
    name: string,
    startDateTime: string,
    endDateTime: string,
    duration: string
  ) => {
    const meeting = await this.meetings.create({
      data: {
        name: name,
        endDateTime: new Date(endDateTime),
        startDateTime: new Date(startDateTime),
        durationInHours: duration,
      },
    });
    return meeting;
  };

  public update = async (body: any, meetingId: string) => {
    const meeting = await this.meetings.update({
      where: {
        id: meetingId,
      },
      data: {
        ...body,
      },
    });
    return meeting;
  };

  public findMeetingById = async (meetingId: string) => {
    const meeting = await this.meetings.findUnique({
      where: {
        id: meetingId,
      },
      include: {
        users: {
          select: {
            id: true,
          },
        },
        meetingAttendees: {
          select: {
            id: true,
            isCameraOn: true,
            isHost: true,
          },
        },
      },
    });

    return meeting;
  };
}

export default MeetingServices;
