import { Router } from "express";
import UserControllers from "../controllers/user.controller";
import AttendeeController from "../controllers/attendee.controller";

class AttendeeRoutes {
  public router = Router();
  public path = "/attendees";
  public userController = new UserControllers();
  public attendeeController = new AttendeeController();
  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.get(
      `${this.path}/check-participant-registered`,
      this.attendeeController.checkParticipantValidity
    );
    this.router.post(
      `${this.path}/add-chat`,
      this.attendeeController.addChatFromParticipant
    );
    this.router.get(
      `${this.path}/:meetingId`,
      this.userController.getAllUsersInMeeting
    );
  }
}

export default AttendeeRoutes;
