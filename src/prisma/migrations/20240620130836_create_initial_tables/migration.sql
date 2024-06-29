-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "phone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metaData" JSONB,
    "companiesId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Meetings" (
    "id" TEXT NOT NULL,
    "startDateTime" TIMESTAMP(3) NOT NULL,
    "endDateTime" TIMESTAMP(3) NOT NULL,
    "durationInHours" TEXT NOT NULL,

    CONSTRAINT "Meetings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Companies" (
    "id" TEXT NOT NULL,
    "companyEmail" TEXT NOT NULL,
    "password" TEXT,
    "planExpiryDate" TIMESTAMP(3) NOT NULL,
    "planId" TEXT NOT NULL,

    CONSTRAINT "Companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "discount" TEXT,
    "durationInDays" TEXT NOT NULL,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MeetingsToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "_MeetingsToUser_AB_unique" ON "_MeetingsToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_MeetingsToUser_B_index" ON "_MeetingsToUser"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_companiesId_fkey" FOREIGN KEY ("companiesId") REFERENCES "Companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Companies" ADD CONSTRAINT "Companies_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MeetingsToUser" ADD CONSTRAINT "_MeetingsToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Meetings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MeetingsToUser" ADD CONSTRAINT "_MeetingsToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
