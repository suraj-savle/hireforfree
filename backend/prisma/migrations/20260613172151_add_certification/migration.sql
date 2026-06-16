/*
  Warnings:

  - You are about to drop the `Course` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CourseInquiry` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CourseInquiry" DROP CONSTRAINT "CourseInquiry_courseId_fkey";

-- AlterTable
ALTER TABLE "StudentProfile" ADD COLUMN     "certification" JSONB;

-- DropTable
DROP TABLE "Course";

-- DropTable
DROP TABLE "CourseInquiry";
