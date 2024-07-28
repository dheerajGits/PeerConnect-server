-- AlterTable
ALTER TABLE "MeetingAttendee" ADD COLUMN     "hostId" TEXT,
ADD COLUMN     "isHost" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Host" (
    "id" TEXT NOT NULL,
    "meetingId" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,

    CONSTRAINT "Host_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Host" ADD CONSTRAINT "Host_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meetings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Host" ADD CONSTRAINT "Host_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "MeetingAttendee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
