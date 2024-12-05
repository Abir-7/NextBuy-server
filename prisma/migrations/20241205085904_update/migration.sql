/*
  Warnings:

  - You are about to drop the column `shopId` on the `Order` table. All the data in the column will be lost.
  - Added the required column `shopId` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_shopId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "shopId";

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "shopId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "shop"("shopId") ON DELETE RESTRICT ON UPDATE CASCADE;
