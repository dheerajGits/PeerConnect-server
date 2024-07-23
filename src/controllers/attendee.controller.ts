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
      const participantId = req.params.id as string;
      const meetingId = req.query.meetingId as string;
      let filter: any = [];
      if (participantId) {
        console.log("No participant id given");
        res.status(404).send({ message: "No participantId specified" });
      }
      filter = [
        ...filter,
        {
          id: participantId,
        },
      ];
      if (meetingId) {
        filter = [
          ...filter,
          {
            meetingId,
          },
        ];
      }
      const attendeeData =
        await this.attendeeServices.findParticipantAvailabilty(filter);
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
