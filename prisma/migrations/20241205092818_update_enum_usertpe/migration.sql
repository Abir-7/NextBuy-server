-- AlterEnum
ALTER TYPE "USER_ROLE" ADD VALUE 'SUPERADMIN';

-- CreateTable
CREATE TABLE "admin" (
    "adminId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "image" TEXT,
    "address" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "gender" "USER_GENDER",
    "userId" TEXT NOT NULL,

    CONSTRAINT "admin_pkey" PRIMARY KEY ("adminId")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_adminId_key" ON "admin"("adminId");

-- CreateIndex
CREATE UNIQUE INDEX "admin_email_key" ON "admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "admin_userId_key" ON "admin"("userId");

-- AddForeignKey
ALTER TABLE "admin" ADD CONSTRAINT "admin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
