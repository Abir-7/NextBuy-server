-- CreateTable
CREATE TABLE "flash_sale" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "discount" INTEGER NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "flash_sale_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "flash_sale" ADD CONSTRAINT "flash_sale_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("productId") ON DELETE RESTRICT ON UPDATE CASCADE;
