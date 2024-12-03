/*
  Warnings:

  - Made the column `description` on table `product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "product" ADD COLUMN     "discounts" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "description" SET NOT NULL;
