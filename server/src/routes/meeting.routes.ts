import { Router } from "express";
import MeetingControllers from "../controllers/meeting.controller";

class MeetingRoutes {
  public router = Router();
  public path = "/meeting";
  public meetingController = new MeetingControllers();
  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.post(`${this.path}`, this.meetingController.createClass);
    this.router.get(`${this.path}/:id`, this.meetingController.getMeetingById);
  }
}

export default MeetingRoutes;
