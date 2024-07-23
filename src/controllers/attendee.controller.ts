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

  public checkParticipantValidity = async (req: Request, res: Response) => {
    try {
      console.log("In participant route");
      const participantId = req.query.participantId as string;
      const meetingId = req.query.meetingId as string;
      if (participantId) {
        console.log("No participant id given");
        res.status(404).send({ message: "No participantId specified" });
      }
      const attendeeData =
        await this.attendeeServices.findParticipantAvailabilty(
          participantId,
          meetingId
        );
      if (attendeeData.length > 0) {
        res.status(202).send({ message: "participant present", data: true });
        return;
      } else {
        res
          .status(202)
          .send({ message: "participant not present", data: false });
        return;
      }
    } catch (e) {
      console.error("error in checking validity");
    }
  };
}
export default AttendeeController;
