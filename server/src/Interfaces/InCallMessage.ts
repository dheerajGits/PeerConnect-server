import { Dayjs } from "dayjs";
export interface InCallMessage {
  participantId: string;
  message: string;
  timeStamp: Dayjs;
}
