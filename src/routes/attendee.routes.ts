import { Router } from "express";
import UserControllers from "../controllers/user.controller";

class UserRoutes {
  public router = Router();
  public path = "/user";
  public userController = new UserControllers();
  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.get(
      `${this.path}/:meetingId`,
      this.userController.getAllUsersInMeeting
    );
  }
}

export default UserRoutes;
