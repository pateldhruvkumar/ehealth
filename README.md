# E-Health Records Management System

A comprehensive Electronic Health Records (EHR) management system allowing patients to manage their medical documents securely and share them with doctors. Built with a modern tech stack ensuring performance, security, and scalability.

## Tech Stack

### Backend
- **Runtime:** Node.js, TypeScript
- **Framework:** Fastify
- **Database:** PostgreSQL (with Neon serverless)
- **ORM:** Prisma v7 with pg adapter
- **Authentication:** Custom JWT with bcrypt
- **Storage:** AWS S3
- **Validation:** Zod
- **Logging:** Pino

### Frontend
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4, shadcn/ui
- **State Management:** TanStack Query (React Query)
- **Authentication:** Custom JWT Auth
- **Forms:** React Hook Form, Zod
- **HTTP Client:** Axios
- **UI Components:** shadcn/ui, Radix UI

---

## Prerequisites

- Node.js (v18+)
- PostgreSQL (v14+) or Neon Database
- AWS Account (S3 Bucket) - Optional for document storage

---

## Getting Started

### 1. Database Setup

You can use either a local PostgreSQL instance or a cloud provider like Neon.

#### Option A: Local PostgreSQL
```bash
# Using Docker
docker run --name ehealth-postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres
```

#### Option B: Neon Database (Recommended)
1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string

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
Create a `.env` file in the `ehealth-backend` directory:

```bash
# ehealth-backend/.env
PORT=4000
HOST=0.0.0.0
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Database
DATABASE_URL="postgresql://user:password@host:5432/ehealth_db"

# JWT Secret (generate a secure random string)
JWT_SECRET="your-super-secret-jwt-key-change-this"

# AWS S3 (Optional - for document storage)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
AWS_S3_BUCKET=ehealth-documents
```

Generate Prisma Client:
```bash
npx prisma generate
```

Run Database Migrations:
```bash
npx prisma migrate deploy
```

Seed Database (Optional):
```bash
npx prisma db seed
```

This will create test accounts:
- **Patient:** `patient@example.com` / `Password123!`
- **Doctor:** `doctor@example.com` / `Password123!`
- **Admin:** `admin@example.com` / `Password123!`

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
Create a `.env` file in the `ehealth-frontend` directory:

```bash
# ehealth-frontend/.env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

Start the Frontend Server:
```bash
npm run dev
```
The application will be available at `http://localhost:3000`.

---

## Features

### Patient Portal
- **Dashboard:** Overview of recent documents and shared records
- **Document Management:** 
  - Upload medical records with drag & drop support
  - Categorize by document type (X-Ray, MRI, Blood Report, etc.)
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
  - Update medical information (blood group, allergies, chronic conditions)
  - Add emergency contacts

### Doctor Portal
- **Dashboard:** View consultation statistics and recent activities
- **Patient Access:** 
  - View records of patients who have granted access
  - Access documents by category
  - Download patient documents
- **Consultations:** 
  - Record consultation notes
  - Add diagnosis information
  - Track patient visit history
- **Patients:** Browse and search patients with granted access

### Security Features
- JWT-based authentication with secure token storage
- Password hashing with bcrypt (10 rounds)
- Role-based access control (Patient, Doctor, Admin)
- Secure document sharing with access codes
- Access logging for audit trails
- CORS protection
- Environment-based security configurations

---

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register/patient` - Patient registration
- `POST /api/auth/register/doctor` - Doctor registration
- `GET /api/auth/me` - Get current user
- `DELETE /api/auth/me` - Delete account

### Documents (Patient only)
- `GET /api/documents` - List all documents
- `GET /api/documents/:id` - Get document details
- `POST /api/documents` - Create document record
- `PUT /api/documents/:id` - Update document
- `DELETE /api/documents/:id` - Soft delete document
- `POST /api/documents/upload-url` - Get S3 upload URL
- `GET /api/documents/:id/download-url` - Get S3 download URL

### Sharing (Patient only)
- `POST /api/sharing/grant` - Grant access to doctor
- `POST /api/sharing/revoke` - Revoke doctor access
- `GET /api/sharing/active` - List active shares
- `GET /api/sharing/access-log` - View access logs
- `GET /api/sharing/verify/:accessCode` - Verify access code

### Patients
- `GET /api/patient/profile` - Get patient profile
- `PUT /api/patient/profile` - Update patient profile
- `POST /api/patient/emergency-contact` - Add emergency contact

### Doctors
- `GET /api/doctor/profile` - Get doctor profile
- `PUT /api/doctor/profile` - Update doctor profile
- `GET /api/doctor/patients` - List accessible patients
- `GET /api/doctor/patients/:id/documents` - Get patient documents

---

## Project Structure

```
ehealth/
├── ehealth-backend/          # Fastify API Server
│   ├── src/
│   │   ├── config/           # Environment & DB config
│   │   │   ├── database.ts   # Prisma client with pg adapter
│   │   │   ├── env.ts        # Environment validation
│   │   │   └── s3.ts         # AWS S3 configuration
│   │   ├── controllers/      # Route handlers
│   │   ├── middleware/       # Auth & Error handling
│   │   ├── routes/           # API Routes definition
│   │   ├── services/         # Business logic
│   │   ├── types/            # TypeScript types
│   │   ├── utils/            # Helper functions
│   │   └── validators/       # Zod schemas
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema
│   │   ├── migrations/       # Database migrations
│   │   └── seed.ts           # Database seeding
│   └── prisma.config.ts      # Prisma configuration
│
└── ehealth-frontend/         # Next.js Application
    ├── src/
    │   ├── app/              # App Router pages
    │   │   ├── auth/         # Authentication pages
    │   │   ├── patient/      # Patient portal pages
    │   │   └── doctor/       # Doctor portal pages
    │   ├── components/       # UI Components
    │   │   ├── ui/           # shadcn/ui components
    │   │   ├── forms/        # Form components
    │   │   ├── layouts/      # Layout components
    │   │   ├── shared/       # Shared components
    │   │   ├── documents/    # Document components
    │   │   └── sharing/      # Sharing components
    │   ├── hooks/            # Custom React Hooks
    │   ├── lib/              # Utilities & API client
    │   ├── providers/        # React Context providers
    │   ├── services/         # API Service calls
    │   └── types/            # TypeScript interfaces
    └── components.json       # shadcn/ui config
```

---

## Database Schema

### Core Models
- **User:** Authentication and role management
- **Patient:** Patient profile and medical information
- **Doctor:** Doctor profile and credentials
- **Document:** Medical document metadata
- **SharedAccess:** Document sharing between patients and doctors
- **AccessLog:** Audit trail for document access
- **EmergencyContact:** Patient emergency contacts
- **Consultation:** Doctor consultation records

---

## Development

### Backend Commands
```bash
# Development
npm run dev

# Build
npm run build

# Start production
npm start

# Database
npx prisma generate        # Generate Prisma Client
npx prisma migrate dev     # Create and apply migration
npx prisma migrate deploy  # Apply migrations (production)
npx prisma db seed         # Seed database
npx prisma studio          # Open Prisma Studio
```

### Frontend Commands
```bash
# Development
npm run dev

# Build
npm run build

# Start production
npm start

# Linting
npm run lint
```

---

## Environment Variables

### Backend Required
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT signing

### Backend Optional
- `PORT` - Server port (default: 4000)
- `HOST` - Server host (default: 0.0.0.0)
- `NODE_ENV` - Environment (development/production)
- `FRONTEND_URL` - Frontend URL for CORS
- `AWS_ACCESS_KEY_ID` - AWS credentials
- `AWS_SECRET_ACCESS_KEY` - AWS credentials
- `AWS_REGION` - AWS region
- `AWS_S3_BUCKET` - S3 bucket name

### Frontend Required
- `NEXT_PUBLIC_API_URL` - Backend API URL

---

## Security Best Practices

1. **Never commit `.env` files** - They contain sensitive credentials
2. **Use strong JWT secrets** - Generate using `openssl rand -base64 32`
3. **Enable HTTPS in production** - Use SSL/TLS certificates
4. **Regularly update dependencies** - Run `npm audit` and fix vulnerabilities
5. **Implement rate limiting** - Protect against brute force attacks
6. **Use environment-specific configs** - Different settings for dev/prod
7. **Backup database regularly** - Prevent data loss

---

## Troubleshooting

### Backend won't start
- Check if PostgreSQL is running
- Verify `DATABASE_URL` in `.env`
- Run `npx prisma generate` to regenerate Prisma Client
- Check if port 4000 is available

### Frontend can't connect to backend
- Verify backend is running on port 4000
- Check `NEXT_PUBLIC_API_URL` in `.env`
- Check browser console for CORS errors
- Verify CORS settings in backend `server.ts`

### Database migration errors
- Ensure database exists
- Check database connection string
- Run `npx prisma migrate reset` to reset database (development only)
- Check migration files for conflicts

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

## Support

For issues and questions:
- Open an issue on GitHub
- Check existing documentation
- Review API endpoints and database schema

---

## Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Fastify](https://fastify.io/) - Web framework
- [Prisma](https://www.prisma.io/) - Database ORM
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [TanStack Query](https://tanstack.com/query) - Data fetching
- [Neon](https://neon.tech/) - Serverless PostgreSQL
