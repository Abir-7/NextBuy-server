/*
  Warnings:

  - The `paymentStatus` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "PAYMENT_STATUS" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "ORDER_STATUS" AS ENUM ('PENDING', 'OnGOING', 'DELIVERED');

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "paymentStatus",
ADD COLUMN     "paymentStatus" "PAYMENT_STATUS" NOT NULL DEFAULT 'PENDING',
DROP COLUMN "status",
ADD COLUMN     "status" "ORDER_STATUS" NOT NULL DEFAULT 'PENDING';

-- DropEnum
DROP TYPE "OrderStatus";

-- DropEnum
DROP TYPE "PaymentStatus";
