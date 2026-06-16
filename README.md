# HireForFree Portal

A full-stack Job Portal platform with **NestJS backend**, **Next.js frontend**, and **PostgreSQL database**, fully dockerized for easy setup and deployment.

## Tech Stack

### Frontend
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- Lucide Icons

### Backend
- NestJS
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Multer (file uploads)

### Docker & Docker Compose

## Project Structure

```

hireforfree-portal/
│── backend/        # NestJS API
│── frontend/       # Next.js App
│── docker-compose.yml
│── README.md

````

## 🚀 Getting Started (Docker)

### 1. Clone the repo
```bash
git clone https://github.com/suraj-savle/hireforfree.git
cd hireforfree-portal
````

### 2. Create environment files

#### Backend `.env`

```env
DATABASE_URL=""

# Email configuration
RESEND_API_KEY=""
EMAIL_FROM="From: HireForFree <noreply@hire4free.in>"

# jwt
JWT_SECRET=""
```

#### Frontend `.env`

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 3. Run with Docker

```bash
docker-compose up --build
```

## 🌐 Access URLs

* Frontend: [http://localhost:3000](http://localhost:3000)
* Backend API: [http://localhost:3001](http://localhost:3001)
* Database: PostgreSQL (Docker container)

## ⚙️ Manual Setup (Without Docker)

### Backend

```bash
cd backend
npm install
npx prisma generate
npm run start:dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Prisma studio

```bash
cd backend
npx prisma studio
```

## Admin Access (Important)

Admin registration is **not available from frontend UI** for security reasons.

You must create an admin user manually using the database seed script.

### Create Admin User

Run the following command inside the `backend` folder:

```bash
npx prisma db seed
```

### OTP Authentication Setup (IMPORTANT)

This project uses Resend for email OTP verification.

## Step 1: Create Resend Account
Go to: https://resend.com
Sign up / login

## Step 2: Add Domain
Add your domain in Resend dashboard
Example: yourdomain.com

## Step 3: Configure DNS

Add records in your domain provider:
Wait until domain is verified

## 🧠 Features

* Student Job Search & Apply System
* Company Job Posting Dashboard
* Admin Approval System
* Resume Upload Support
* Company Profiles with Logos
* Application Tracking System
* Role-based Authentication
