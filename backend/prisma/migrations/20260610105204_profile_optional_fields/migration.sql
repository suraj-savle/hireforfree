-- AlterTable
ALTER TABLE "CompanyProfile" ALTER COLUMN "companyName" DROP NOT NULL;

-- AlterTable
ALTER TABLE "StudentProfile" ALTER COLUMN "firstName" DROP NOT NULL,
ALTER COLUMN "lastName" DROP NOT NULL,
ALTER COLUMN "skills" SET DEFAULT ARRAY[]::TEXT[];
