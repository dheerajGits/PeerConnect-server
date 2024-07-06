import { Router } from "express";

class UserRoutes {
  public router = Router();
  public path = "/user";
  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.get(`${this.path}/:meetingId`);
  }
}
