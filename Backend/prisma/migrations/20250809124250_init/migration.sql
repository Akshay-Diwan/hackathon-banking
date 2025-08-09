-- CreateTable
CREATE TABLE "public"."TempUser" (
    "id" TEXT NOT NULL,
    "sessionID" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "expiresIn" TEXT NOT NULL,

    CONSTRAINT "TempUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TempUser_email_key" ON "public"."TempUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "TempUser_phone_key" ON "public"."TempUser"("phone");

-- CreateIndex
CREATE INDEX "TempUser_expiresIn_idx" ON "public"."TempUser"("expiresIn");
