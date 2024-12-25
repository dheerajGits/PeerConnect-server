/*
  Warnings:

  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_participantId_fkey";

-- DropTable
DROP TABLE "Message";

-- CreateTable
CREATE TABLE "Chat" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "meetingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "MeetingAttendee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meetings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
