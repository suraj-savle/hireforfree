/*
  Warnings:

  - You are about to drop the column `fullName` on the `StudentProfile` table. All the data in the column will be lost.
  - The `education` column on the `StudentProfile` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `skills` column on the `StudentProfile` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `updatedAt` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `CompanyProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `StudentProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `StudentProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `StudentProfile` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "JobSearchStatus" AS ENUM ('ACTIVE', 'OPEN_TO_OFFERS', 'NOT_LOOKING');

-- CreateEnum
CREATE TYPE "CompanySize" AS ENUM ('SIZE_1_10', 'SIZE_11_50', 'SIZE_51_200', 'SIZE_201_500', 'SIZE_500_PLUS');

-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_jobId_fkey";

-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_studentId_fkey";

-- DropForeignKey
ALTER TABLE "CompanyProfile" DROP CONSTRAINT "CompanyProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "Job" DROP CONSTRAINT "Job_createdById_fkey";

-- DropForeignKey
ALTER TABLE "StudentProfile" DROP CONSTRAINT "StudentProfile_userId_fkey";

-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "CompanyProfile" ADD COLUMN     "companySize" "CompanySize",
ADD COLUMN     "facebook" TEXT,
ADD COLUMN     "foundedAt" INTEGER,
ADD COLUMN     "industry" TEXT,
ADD COLUMN     "instagram" TEXT,
ADD COLUMN     "ownerName" TEXT,
ADD COLUMN     "twitter" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "StudentProfile" DROP COLUMN "fullName",
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "experience" JSONB,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "github" TEXT,
ADD COLUMN     "headline" TEXT,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "linkedin" TEXT,
ADD COLUMN     "portfolioUrl" TEXT,
ADD COLUMN     "searchStatus" "JobSearchStatus" NOT NULL DEFAULT 'OPEN_TO_OFFERS',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "education",
ADD COLUMN     "education" JSONB,
DROP COLUMN "skills",
ADD COLUMN     "skills" TEXT[];

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "Application_jobId_idx" ON "Application"("jobId");

-- CreateIndex
CREATE INDEX "Job_createdById_idx" ON "Job"("createdById");

-- AddForeignKey
ALTER TABLE "StudentProfile" ADD CONSTRAINT "StudentProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyProfile" ADD CONSTRAINT "CompanyProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;
