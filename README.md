# E-Health Records Management System

A comprehensive Electronic Health Records (EHR) management system allowing patients to manage their medical documents securely and share them with doctors. Built with a modern tech stack ensuring performance, security, and scalability.

## Live Demo

- **Frontend:** [https://ehealth-iota.vercel.app](https://ehealth-iota.vercel.app)
- **Backend API:** [https://ehealth-production.up.railway.app/api](https://ehealth-production.up.railway.app/api)

**Test Accounts**
| Role | Email | Password |
|------|-------|----------|
| Patient | patient@example.com | Password123! |
| Doctor | doctor@example.com | Password123! |

---

## Tech Stack

### Backend
- **Runtime:** Node.js, TypeScript
- **Framework:** Fastify v5
- **Database:** PostgreSQL via [Neon](https://neon.tech) (serverless)
- **ORM:** Prisma v7 with `@prisma/adapter-pg`
- **Authentication:** JWT + bcrypt
- **Storage:** AWS S3 (presigned URLs)
- **Validation:** Zod
- **Logging:** Pino

### Frontend
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4, shadcn/ui
- **State Management:** TanStack Query (React Query)
- **Forms:** React Hook Form + Zod
- **HTTP Client:** Axios
- **UI Components:** shadcn/ui, Radix UI

---

## Prerequisites

- Node.js (v18+)
- PostgreSQL (v14+) or [Neon](https://neon.tech) database
- AWS Account with an S3 bucket for document storage

---

## Local Development

### 1. Database Setup

#### Option A: Local PostgreSQL
```bash
docker run --name ehealth-postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres
```

#### Option B: Neon Database (Recommended)
1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string — use the **pooled** connection string

> **Note:** If using Neon's pooled connection string, remove `&channel_binding=require` from the URL. Use only `?sslmode=require`. The `channel_binding` parameter causes connection failures in some hosted environments (Railway, etc.).

### 2. Backend Setup

```bash
cd ehealth-backend
npm install
```

Create `ehealth-backend/.env`:

```bash
PORT=4000
HOST=0.0.0.0
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Database — remove &channel_binding=require if present
DATABASE_URL="postgresql://user:password@host:5432/ehealth_db?sslmode=require"

# JWT Secret — generate with: openssl rand -base64 32
JWT_SECRET="your-super-secret-jwt-key-change-this"

# AWS S3
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name
```

Run migrations and seed:

```bash
npm run db:generate   # Generate Prisma Client
npm run db:migrate    # Apply migrations (dev)
npm run db:seed       # Create test accounts
```

Start the server:

```bash
npm run dev           # http://localhost:4000
```

### 3. Frontend Setup

```bash
cd ehealth-frontend
npm install
```

Create `ehealth-frontend/.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

Start the dev server:

```bash
npm run dev           # http://localhost:3000
```

---

## Deployment

### Backend — Railway

1. Create a new project on [Railway](https://railway.app) and connect your GitHub repo
2. Set the **root directory** to `ehealth-backend`
3. Set the **start command** to `npm start` (runs the compiled build)
4. Add the following environment variables in Railway → Variables:

| Variable | Value |
|---|---|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | Your Neon connection string (`?sslmode=require` only — no `channel_binding`) |
| `JWT_SECRET` | A strong random secret |
| `FRONTEND_URL` | Your Vercel app URL (e.g. `https://your-app.vercel.app`) |
| `AWS_ACCESS_KEY_ID` | Your AWS key |
| `AWS_SECRET_ACCESS_KEY` | Your AWS secret |
| `AWS_REGION` | Your S3 bucket region |
| `AWS_S3_BUCKET` | Your S3 bucket name |

5. Run production migrations from your local machine:

```bash
cd ehealth-backend
$env:DATABASE_URL="your-production-neon-url"  # PowerShell
npx prisma migrate deploy
npm run db:seed
```

### Frontend — Vercel

1. Import your GitHub repo on [Vercel](https://vercel.com)
2. Set the **root directory** to `ehealth-frontend`
3. Add the following environment variable in Vercel → Settings → Environment Variables:

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_API_URL` | `https://your-railway-app.up.railway.app/api` (include `/api`) |

4. Redeploy after saving environment variables — changes don't take effect until a new build.

### AWS S3 — CORS Configuration

To allow the browser to upload files directly to S3 from your Vercel domain, you must add a CORS policy to your bucket:

1. Go to **AWS Console → S3 → your bucket → Permissions → CORS**
2. Add the following policy:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedOrigins": [
      "https://your-app.vercel.app"
    ],
    "ExposeHeaders": ["ETag", "Content-Length", "Content-Type"],
    "MaxAgeSeconds": 3000
  }
]
```

Add all Vercel domains (including preview URLs) to `AllowedOrigins` as needed.

---

## Features

### Patient Portal
- **Dashboard:** Overview of recent documents and shared records
- **Document Management:**
  - Upload medical records with drag & drop support
  - Categorize by type (X-Ray, MRI, CT Scan, Blood Report, etc.)
  - View and download documents
  - Soft delete with recovery option
- **Sharing:**
  - Share records with doctors via secure access codes
  - Generate QR codes for easy sharing
  - Set expiration dates for shared access
  - Revoke access anytime
- **Access Logs:** View detailed history of who accessed your records
- **Profile:**
  - Manage personal information
  - Update medical info (blood group, allergies, chronic conditions)
  - Add emergency contacts

### Doctor Portal
- **Dashboard:** Consultation statistics and recent activity
- **Patient Access:**
  - View records of patients who granted access
  - Browse documents by category
  - Download patient documents
- **Consultations:**
  - Record consultation notes and diagnosis
  - Track patient visit history
- **Patients:** Browse and search patients with granted access

### Security
- JWT-based authentication
- Password hashing with bcrypt (10 rounds)
- Role-based access control (Patient, Doctor)
- Secure document sharing with unique access codes
- Audit trail for all document access
- CORS protection
- AWS S3 presigned URLs — files never pass through the backend server

---

## API Endpoints

### Authentication
- `POST /api/auth/login` — User login
- `POST /api/auth/register/patient` — Patient registration
- `POST /api/auth/register/doctor` — Doctor registration
- `GET /api/auth/me` — Get current user
- `DELETE /api/auth/me` — Deactivate account

### Documents (Patient only)
- `GET /api/documents` — List all documents
- `GET /api/documents/:id` — Get document details
- `POST /api/documents` — Create document record
- `PUT /api/documents/:id` — Update document
- `DELETE /api/documents/:id` — Soft delete document
- `POST /api/documents/upload-url` — Get S3 presigned upload URL
- `GET /api/documents/:id/download-url` — Get S3 presigned download URL

### Sharing (Patient only)
- `POST /api/sharing/grant` — Grant access to a doctor
- `POST /api/sharing/revoke` — Revoke doctor access
- `GET /api/sharing/active` — List active shares
- `GET /api/sharing/access-log` — View access logs
- `GET /api/sharing/verify/:accessCode` — Verify an access code

### Patient
- `GET /api/patient/profile` — Get patient profile
- `PUT /api/patient/profile` — Update patient profile
- `POST /api/patient/emergency-contact` — Add emergency contact

### Doctor
- `GET /api/doctor/profile` — Get doctor profile
- `PUT /api/doctor/profile` — Update doctor profile
- `GET /api/doctor/patients` — List accessible patients
- `GET /api/doctor/patients/:id/documents` — Get patient documents

### Health
- `GET /api/health` — Health check

---

## Project Structure

```
ehealth/
├── ehealth-backend/              # Fastify API Server
│   ├── src/
│   │   ├── config/               # Environment & DB config
│   │   │   ├── database.ts       # Prisma client with pg adapter
│   │   │   ├── env.ts            # Zod environment validation
│   │   │   └── s3.ts             # AWS S3 presigned URL helpers
│   │   ├── controllers/          # Route handlers
│   │   ├── middleware/           # Auth & error handling
│   │   ├── routes/               # Route definitions
│   │   ├── services/             # Business logic
│   │   ├── types/                # TypeScript types & Fastify augmentations
│   │   ├── utils/                # Response helpers
│   │   ├── validators/           # Zod request schemas
│   │   └── server.ts             # Entry point
│   ├── prisma/
│   │   ├── schema.prisma         # Database schema
│   │   ├── migrations/           # Migration history
│   │   └── seed.ts               # Seed script
│   └── package.json
│
└── ehealth-frontend/             # Next.js Application
    ├── src/
    │   ├── app/                  # App Router pages
    │   │   ├── auth/             # Login & registration
    │   │   ├── patient/          # Patient portal
    │   │   └── doctor/           # Doctor portal
    │   ├── components/           # UI Components
    │   │   ├── ui/               # shadcn/ui primitives
    │   │   ├── forms/            # Form components
    │   │   ├── layouts/          # Layout components
    │   │   ├── shared/           # Shared components
    │   │   ├── documents/        # Document components
    │   │   └── sharing/          # Sharing components
    │   ├── hooks/                # Custom React hooks
    │   ├── lib/                  # API client, constants, utilities
    │   ├── providers/            # React context providers
    │   ├── services/             # API call functions
    │   └── types/                # TypeScript interfaces
    └── components.json           # shadcn/ui config
```

---

## Database Schema

- **User** — Authentication and role management
- **Patient** — Patient profile and medical information
- **Doctor** — Doctor profile and credentials
- **Document** — Medical document metadata (soft-deletable)
- **SharedAccess** — Document sharing between patients and doctors
- **AccessLog** — Audit trail for document access
- **EmergencyContact** — Patient emergency contacts
- **Consultation** — Doctor consultation records

---

## Commands Reference

### Backend (`cd ehealth-backend`)

```bash
npm run dev           # Start dev server with hot reload (port 4000)
npm run build         # Compile TypeScript to dist/
npm start             # Run compiled production build

npm run db:generate   # Regenerate Prisma client after schema changes
npm run db:migrate    # Create and apply a new migration (dev)
npm run db:seed       # Seed DB with test accounts
npm run db:studio     # Open Prisma Studio
```

For production migrations:
```bash
npx prisma migrate deploy
```

### Frontend (`cd ehealth-frontend`)

```bash
npm run dev           # Start Next.js dev server (port 3000)
npm run build         # Build for production
npm run lint          # Run ESLint
```

---

## Environment Variables

### Backend

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `JWT_SECRET` | Yes | Secret key for JWT signing |
| `PORT` | No | Server port (default: `4000`) |
| `HOST` | No | Server host (default: `0.0.0.0`) |
| `NODE_ENV` | No | `development` or `production` |
| `FRONTEND_URL` | No | Frontend origin for CORS |
| `AWS_ACCESS_KEY_ID` | No* | AWS credentials |
| `AWS_SECRET_ACCESS_KEY` | No* | AWS credentials |
| `AWS_REGION` | No* | S3 bucket region |
| `AWS_S3_BUCKET` | No* | S3 bucket name |

*Required for document upload/download functionality.

### Frontend

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Yes | Backend API base URL (must end with `/api`) |

---

## Troubleshooting

### 404 on API requests in production
- Verify `NEXT_PUBLIC_API_URL` in Vercel ends with `/api` — e.g. `https://your-app.up.railway.app/api`

### 401 Unauthorized on login
- Check `DATABASE_URL` in Railway points to the correct database
- Ensure the production database has been seeded (`npm run db:seed`)
- Verify `JWT_SECRET` is set in Railway environment variables

### Backend can't connect to Neon database
- Remove `&channel_binding=require` from the `DATABASE_URL` — use `?sslmode=require` only
- Verify the connection string is correctly set in Railway Variables

### S3 upload blocked by CORS
- Add a CORS policy to your S3 bucket (see [AWS S3 CORS Configuration](#aws-s3--cors-configuration))
- Ensure your Vercel domain is listed in `AllowedOrigins`

### Backend won't start locally
- Verify `DATABASE_URL` in `.env` is correct
- Run `npm run db:generate` to regenerate the Prisma Client
- Check if port 4000 is already in use

### Database migration errors
- Run `npx prisma migrate reset` to reset (development only — destroys data)
- For production, always use `npx prisma migrate deploy`

---

## Security Best Practices

1. **Never commit `.env` files** — add them to `.gitignore`
2. **Use a strong JWT secret** — generate with `openssl rand -base64 32`
3. **Restrict S3 CORS origins** — list specific domains, not `*`, in production
4. **Use environment-specific configs** — different secrets for dev and prod
5. **Regularly rotate AWS credentials** — use IAM roles with least-privilege policies
6. **Keep dependencies updated** — run `npm audit` periodically

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License.

---

## Acknowledgments

- [Next.js](https://nextjs.org/) — React framework
- [Fastify](https://fastify.dev/) — Web framework
- [Prisma](https://www.prisma.io/) — Database ORM
- [shadcn/ui](https://ui.shadcn.com/) — UI components
- [TanStack Query](https://tanstack.com/query) — Data fetching
- [Neon](https://neon.tech/) — Serverless PostgreSQL
- [Railway](https://railway.app/) — Backend hosting
- [Vercel](https://vercel.com/) — Frontend hosting
