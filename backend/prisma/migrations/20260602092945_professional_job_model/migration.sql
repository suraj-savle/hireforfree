/*
  Warnings:

  - You are about to drop the column `salary` on the `Job` table. All the data in the column will be lost.
  - Added the required column `jobType` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workMode` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "JobType" AS ENUM ('FULL_TIME', 'PART_TIME', 'INTERNSHIP', 'CONTRACT', 'FREELANCE');

-- CreateEnum
CREATE TYPE "WorkMode" AS ENUM ('REMOTE', 'ONSITE', 'HYBRID');

-- CreateEnum
CREATE TYPE "ExperienceLevel" AS ENUM ('FRESHER', 'JUNIOR', 'MID_LEVEL', 'SENIOR', 'LEAD');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('ACTIVE', 'CLOSED', 'PAUSED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "JobCategory" AS ENUM ('SOFTWARE_DEVELOPMENT', 'DESIGN', 'MARKETING', 'SALES', 'HR', 'FINANCE', 'DATA_SCIENCE', 'DEVOPS', 'CYBER_SECURITY', 'PRODUCT_MANAGEMENT', 'OTHER');

-- DropForeignKey
ALTER TABLE "Job" DROP CONSTRAINT "Job_createdById_fkey";

-- AlterTable
ALTER TABLE "Job" DROP COLUMN "salary",
ADD COLUMN     "applicationCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "applicationDeadline" TIMESTAMP(3),
ADD COLUMN     "benefits" TEXT[],
ADD COLUMN     "category" "JobCategory",
ADD COLUMN     "experienceLevel" "ExperienceLevel",
ADD COLUMN     "experienceYears" INTEGER,
ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "jobType" "JobType" NOT NULL,
ADD COLUMN     "requirements" TEXT[],
ADD COLUMN     "salaryCurrency" TEXT NOT NULL DEFAULT 'INR',
ADD COLUMN     "salaryMax" INTEGER,
ADD COLUMN     "salaryMin" INTEGER,
ADD COLUMN     "skills" TEXT[],
ADD COLUMN     "status" "JobStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "vacancies" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "workMode" "WorkMode" NOT NULL;

-- CreateIndex
CREATE INDEX "Job_createdAt_idx" ON "Job"("createdAt");

-- CreateIndex
CREATE INDEX "Job_jobType_idx" ON "Job"("jobType");

-- CreateIndex
CREATE INDEX "Job_workMode_idx" ON "Job"("workMode");

-- CreateIndex
CREATE INDEX "Job_status_idx" ON "Job"("status");

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
