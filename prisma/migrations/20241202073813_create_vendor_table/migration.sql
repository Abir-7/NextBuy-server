-- CreateTable
CREATE TABLE "vendor" (
    "vendorId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "image" TEXT,
    "address" TEXT NOT NULL,
    "mobile" INTEGER NOT NULL,
    "gender" "USER_GENDER",
    "userId" TEXT NOT NULL,

    CONSTRAINT "vendor_pkey" PRIMARY KEY ("vendorId")
);

-- CreateIndex
CREATE UNIQUE INDEX "vendor_vendorId_key" ON "vendor"("vendorId");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_email_key" ON "vendor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_userId_key" ON "vendor"("userId");

-- AddForeignKey
ALTER TABLE "vendor" ADD CONSTRAINT "vendor_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "user"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
