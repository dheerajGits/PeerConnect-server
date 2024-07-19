import { Request, Response } from "express";
import AttendeeServices from "../services/Attendee.services";

class AttendeeController {
  public attendeeServices = new AttendeeServices();

  public getAllLiveAttendees = async (req: Request, res: Response) => {
    try {
      const meetingId = req.params.meetingId;
      if (!meetingId) {
        res.send(401).send({ message: "meetingId not specified" });
        return;
      }
      const meetingAttendees = await this.attendeeServices.getAllLiveAttendees(
        meetingId
      );
      res.status(202).send({ message: "getAll", data: meetingAttendees });
    } catch (e) {
      console.log("..[ERROR IN ATTENDEE CONTROLLER GETLIVEATTENDEE]", e);
      res.status(400).send({ message: "something went wrong" });
    }
  };
}
export default AttendeeController;
