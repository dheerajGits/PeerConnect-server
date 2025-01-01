import { Request, Response } from "express";
import MeetingServices from "../services/meeting.services";

class MeetingController {
  public meetingServices = new MeetingServices();
  public createClass = async (req: Request, res: Response) => {
    try {
      const reqBody = req.body;
      const name = reqBody.name as string;
      const startDateTime = reqBody.startDateTime as string;
      const endDateTime = reqBody.endDateTime as string;
      const duration = reqBody.duration as string;
      if (!name || !startDateTime || !endDateTime || !duration) {
        res.status(404).send({ msg: "insufficient information given" });
        return;
      }
      const meeting = await this.meetingServices.createMeeting(
        name,
        startDateTime,
        endDateTime,
        duration
      );
      res
        .status(202)
        .send({ message: "meeting created successfully", data: meeting });
    } catch (e) {
      console.log("[Error while creating class: ]", e);
      res.status(400).send({ message: "something went wrong" });
    }
  };

  public getMeetingById = async (req: Request, res: Response) => {
    try {
      const meetingId = req.params.id;
      if (!meetingId) {
        res.status(404).send({ message: "meetingId not specified" });
        return;
      }
      const meeting = await this.meetingServices.findMeetingById(meetingId);
      res.status(202).send({ message: "find Unique", data: meeting });
    } catch (e) {
      res.status(400).send({ message: "error while fetching data" });
    }
  };
}

export default MeetingController;
