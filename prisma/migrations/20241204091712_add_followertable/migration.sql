-- CreateTable
CREATE TABLE "follower" (
    "id" TEXT NOT NULL,
    "shopId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "follower_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "follower_shopId_customerId_key" ON "follower"("shopId", "customerId");

-- AddForeignKey
ALTER TABLE "follower" ADD CONSTRAINT "follower_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "shop"("shopId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follower" ADD CONSTRAINT "follower_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customer"("customerId") ON DELETE RESTRICT ON UPDATE CASCADE;
