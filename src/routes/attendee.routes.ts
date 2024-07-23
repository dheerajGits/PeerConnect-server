import { Router } from "express";
import UserControllers from "../controllers/user.controller";
import AttendeeController from "../controllers/attendee.controller";

class UserRoutes {
  public router = Router();
  public path = "/attendees";
  public userController = new UserControllers();
  public attendeeController = new AttendeeController();
  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.get(
      `${this.path}/:meetingId`,
      this.userController.getAllUsersInMeeting
    );
    this.router.get(
      `${this.router}/check-participant-registered/:id`,
      this.attendeeController.checkParticipantValidity
    );
  }
}

export default UserRoutes;
