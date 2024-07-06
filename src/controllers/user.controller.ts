import { Request, Response } from "express";
import UserServices from "../services/user.services";

class UserControllers {
  public userService = new UserServices();
  public getAllUsersInMeeting = async (req: Request, res: Response) => {
    try {
      const meetingId = req.params.meetingId as string;
      if (!meetingId) {
        res.status(400).send({ message: "meeting ID not specified" });
        return;
      }

      const users = await this.userService.findUsersInAMeeting(meetingId);
      res.status(200).send({ data: users, message: "findMany" });
    } catch (err) {
      console.log("[Error in UserControllers getAllUsersInMeeting]", err);
      res.status(404).send({ message: "Error occured" });
    }
  };
}
export default UserControllers;
