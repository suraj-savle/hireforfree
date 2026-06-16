Remove Cache : Remove-Item -Recurse -Force .\dist

Format Prisma schema : npx prisma format

Start Docker : docker compose up -d

Start Backend : npm run dev:start or npm start


POST /auth/register
POST /auth/login

POST /profiles/student
POST /profiles/company

POST /uploads/resume
POST /uploads/profile-image
POST /uploads/company-logo
POST /uploads/verification-doc

GET /jobs
GET /jobs/:id
POST /jobs
PATCH /jobs/:id
DELETE /jobs/:id

POST /applications
GET /applications/my
PATCH /applications/:id/status

GET /jobs/my
GET /jobs/:id/applications

GET /admin/companies/pending
PATCH /admin/companies/:id/approve