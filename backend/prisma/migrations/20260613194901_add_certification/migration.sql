/*
  Warnings:

  - You are about to drop the column `certification` on the `StudentProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "StudentProfile" DROP COLUMN "certification",
ADD COLUMN     "certifications" JSONB;
