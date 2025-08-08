/*
  Warnings:

  - You are about to drop the column `userId` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `aadhaar` on the `KYC` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Transaction` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[aadhaarNumber]` on the table `KYC` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `branch` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerId` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `aadhaarNumber` to the `KYC` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kind` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentMethod` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - The required column `customerId` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "public"."Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropIndex
DROP INDEX "public"."KYC_aadhaar_key";

-- AlterTable
ALTER TABLE "public"."Account" DROP COLUMN "userId",
ADD COLUMN     "branch" TEXT NOT NULL,
ADD COLUMN     "customerId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."KYC" DROP COLUMN "aadhaar",
ADD COLUMN     "aadhaarNumber" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Transaction" DROP COLUMN "description",
ADD COLUMN     "kind" TEXT NOT NULL,
ADD COLUMN     "message" TEXT,
ADD COLUMN     "paymentMethod" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "customerId" TEXT NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("customerId");

-- CreateTable
CREATE TABLE "public"."Log" (
    "id" TEXT NOT NULL,
    "customerId" TEXT,
    "action" TEXT NOT NULL,
    "details" JSONB,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RequestLog" (
    "id" TEXT NOT NULL,
    "customerId" TEXT,
    "method" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "origin" TEXT,
    "responseTime" INTEGER NOT NULL,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RequestLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Quiz" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "correctOption" TEXT NOT NULL,
    "incorrectOptions" TEXT[],

    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Log_customerId_idx" ON "public"."Log"("customerId");

-- CreateIndex
CREATE INDEX "Log_action_idx" ON "public"."Log"("action");

-- CreateIndex
CREATE INDEX "Log_createdAt_idx" ON "public"."Log"("createdAt");

-- CreateIndex
CREATE INDEX "RequestLog_customerId_idx" ON "public"."RequestLog"("customerId");

-- CreateIndex
CREATE INDEX "RequestLog_createdAt_idx" ON "public"."RequestLog"("createdAt");

-- CreateIndex
CREATE INDEX "RequestLog_method_idx" ON "public"."RequestLog"("method");

-- CreateIndex
CREATE UNIQUE INDEX "KYC_aadhaarNumber_key" ON "public"."KYC"("aadhaarNumber");

-- AddForeignKey
ALTER TABLE "public"."Account" ADD CONSTRAINT "Account_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."User"("customerId") ON DELETE RESTRICT ON UPDATE CASCADE;
