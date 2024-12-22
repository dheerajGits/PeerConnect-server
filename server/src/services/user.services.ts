import PrismaClient from "../utils/PrismaClient";
class UserServices {
  public users = PrismaClient.user;
  public meetings = PrismaClient.meetings;
  public findUsersInAMeeting = async (meetingId: string) => {
    const usersInMeeting = await this.meetings.findUnique({
      where: {
        id: meetingId,
      },
      select: {
        users: {
          select: {
            id: true,
          },
        },
      },
    });
    return usersInMeeting?.users;
  };
}
export default UserServices;
