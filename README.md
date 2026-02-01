# E-Health Records Management System

A comprehensive Electronic Health Records (EHR) management system allowing patients to manage their medical documents securely and share them with doctors. Built with a modern tech stack ensuring performance, security, and scalability.

## Tech Stack

### Backend
- **Runtime:** Node.js, TypeScript
- **Framework:** Fastify
- **Database:** PostgreSQL
- **ORM:** Prisma v7
- **Authentication:** Clerk
- **Storage:** AWS S3
- **Validation:** Zod
- **Logging:** Pino

### Frontend
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, shadcn/ui
- **State Management:** Zustand, TanStack Query
- **Authentication:** Custom JWT Auth (PostgreSQL)
- **Forms:** React Hook Form, Zod
- **HTTP Client:** Axios

---

## Prerequisites

- Node.js (v18+)
- PostgreSQL (v14+)
- AWS Account (S3 Bucket)
- Clerk Account (Authentication)

---

## Getting Started

### 1. Database Setup

Ensure you have a PostgreSQL database running locally or in the cloud.

```bash
# Example using Docker
docker run --name ehealth-postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres
```

### 2. Backend Setup

Navigate to the backend directory:
```bash
cd ehealth-backend
```

Install dependencies:
```bash
npm install
```

Configure Environment Variables:
1. Copy `env.example` to `.env`.
2. Update the values with your credentials.

```bash
# ehealth-backend/.env
PORT=4000
HOST=0.0.0.0
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
DATABASE_URL="postgresql://postgres:password@127.0.0.1:5432/ehealth_db"
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
AWS_S3_BUCKET=ehealth-documents
```

Run Database Migrations:
```bash
npm run db:generate
npm run db:migrate
```

Seed Database (Optional):
```bash
npm run db:seed
```

Start the Backend Server:
```bash
npm run dev
```
The server will start at `http://localhost:4000`.

### 3. Frontend Setup

Open a new terminal and navigate to the frontend directory:
```bash
cd ehealth-frontend
```

Install dependencies:
```bash
npm install
```

Configure Environment Variables:
1. Copy `env.example` to `.env.local`.
2. Update the values.

```bash
# ehealth-frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/register
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

Start the Frontend Server:
```bash
npm run dev
```
The application will be available at `http://localhost:3000`.

---

## Features

### Patient Portal
- **Dashboard:** Overview of recent documents and shared records.
- **Document Management:** Upload (drag & drop), view, and delete medical records securely (stored in S3).
- **Sharing:** Share records with doctors via secure codes or QR codes.
- **Access Logs:** View history of who accessed your records.
- **Profile:** Manage personal and medical information.

### Doctor Portal
- **Dashboard:** View consultation statistics.
- **Patient Access:** View records of patients who have granted access.
- **Consultations:** Record and manage consultation notes.
- **Search:** Find other doctors in the network.

## Project Structure

```
ehealth/
├── ehealth-backend/      # Fastify API Server
│   ├── src/
│   │   ├── config/       # Environment & DB config
│   │   ├── controllers/  # Route handlers
│   │   ├── middleware/   # Auth & Error handling
│   │   ├── routes/       # API Routes definition
│   │   ├── services/     # Business logic
│   │   └── validators/   # Zod schemas
│   └── prisma/           # Database schema & migrations
│
└── ehealth-frontend/     # Next.js Application
    ├── src/
    │   ├── app/          # App Router pages
    │   ├── components/   # UI Components
    │   ├── hooks/        # Custom React Hooks
    │   ├── lib/          # Utilities & API client
    │   ├── services/     # API Service calls
    │   └── types/        # TypeScript interfaces
```
