/*
  Warnings:

  - Added the required column `address` to the `customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mobile` to the `customer` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "USER_GENDER" AS ENUM ('MALE', 'FEMALE');

-- AlterTable
ALTER TABLE "customer" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "gender" "USER_GENDER",
ADD COLUMN     "mobile" INTEGER NOT NULL;
