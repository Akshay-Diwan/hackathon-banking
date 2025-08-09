/*
  Warnings:

  - The primary key for the `KYC` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `dateOfBirth` on the `KYC` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `KYC` table. All the data in the column will be lost.
  - The required column `kycId` was added to the `KYC` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `nominee` to the `KYC` table without a default value. This is not possible if the table is not empty.
  - Added the required column `personalDetails` to the `KYC` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `address` on the `KYC` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "public"."User" DROP CONSTRAINT "User_kycId_fkey";

-- AlterTable
ALTER TABLE "public"."KYC" DROP CONSTRAINT "KYC_pkey",
DROP COLUMN "dateOfBirth",
DROP COLUMN "id",
ADD COLUMN     "kycId" TEXT NOT NULL,
ADD COLUMN     "nominee" JSONB NOT NULL,
ADD COLUMN     "personalDetails" JSONB NOT NULL,
DROP COLUMN "address",
ADD COLUMN     "address" JSONB NOT NULL,
ADD CONSTRAINT "KYC_pkey" PRIMARY KEY ("kycId");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_kycId_fkey" FOREIGN KEY ("kycId") REFERENCES "public"."KYC"("kycId") ON DELETE SET NULL ON UPDATE CASCADE;
