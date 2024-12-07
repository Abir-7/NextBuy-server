/*
  Warnings:

  - You are about to drop the column `isActive` on the `Coupon` table. All the data in the column will be lost.
  - You are about to drop the column `maxUses` on the `Coupon` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Coupon" DROP COLUMN "isActive",
DROP COLUMN "maxUses";
