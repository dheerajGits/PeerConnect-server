import { Dayjs } from "dayjs";
export interface InCallMessageSend {
  participantId: string;
  message: string;
  timeStamp: Dayjs;
}
export interface InCallMessageRecieved {
  id: string;
  participantId: string;
  message: string;
  timeStamp: Dayjs;
}
