-- DropForeignKey
ALTER TABLE "vendor" DROP CONSTRAINT "vendor_vendorId_fkey";

-- AddForeignKey
ALTER TABLE "vendor" ADD CONSTRAINT "vendor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
