# E-Health Records Management System

A cloud-based electronic health records (EHR) platform that empowers patients to securely store, manage, and share their complete medical history. Built with modern technologies for scalability, security, and seamless user experience.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![TypeScript](https://img.shields.io/badge/typescript-%5E5.0.0-blue.svg)

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Database Setup](#database-setup)
  - [Running the Application](#running-the-application)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Contributing](#-contributing)
- [License](#-license)

## 🎯 Overview

E-Health solves the problem of scattered medical records by providing a centralized, secure platform where:

- **Patients** can store all medical documents (X-rays, MRIs, blood reports, prescriptions, bills) in one place
- **Doctors** can access patient history with proper consent for better diagnosis
- **Healthcare continuity** is maintained across different providers, cities, or states

### Problem Statement

When patients travel or visit new healthcare providers, they often lack access to their complete medical history. Physical documents get lost, forgotten, or damaged. This leads to:

- Redundant diagnostic tests
- Incomplete medical history for doctors
- Delayed or compromised treatment decisions

### Solution

E-Health provides a secure cloud platform where patients own and control their medical data, sharing it instantly with any healthcare provider through secure access links or QR codes.

## ✨ Features

### For Patients

- 📁 **Document Management** - Upload, organize, and manage medical records
- 🏷️ **Smart Categorization** - Automatic categorization by document type
- 🔍 **Search & Filter** - Find documents by date, type, or keywords
- 🔗 **Secure Sharing** - Share records with doctors via links or QR codes
- ⏰ **Time-based Access** - Set expiration for shared access
- 📊 **Dashboard** - Overview of health records and recent activity
- 👤 **Profile Management** - Medical history, allergies, emergency contacts

### For Doctors

- 📋 **Patient Records View** - Access shared patient documents
- 📝 **Consultation Notes** - Add notes and diagnosis for each visit
- 🔔 **Access Notifications** - Get notified when patients share records
- ✅ **Verified Profiles** - License verification for trust

### Security & Privacy

- 🔐 **End-to-end Encryption** - Documents encrypted at rest and in transit
- 🛡️ **Role-based Access** - Strict access control based on user roles
- 📜 **Audit Logs** - Complete trail of who accessed what and when
- ⏳ **Auto-expiring Links** - Shared access expires automatically

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| Next.js 15 | React framework with App Router |
| TypeScript | Type-safe development |
| Tailwind CSS | Utility-first styling |
| shadcn/ui | Accessible UI components |
| React Query | Server state management |
| Zustand | Client state management |

### Backend

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime environment |
| Fastify | High-performance web framework |
| TypeScript | Type-safe development |
| Prisma | Type-safe ORM |
| Zod | Schema validation |

### Database & Storage

| Technology | Purpose |
|------------|---------|
| PostgreSQL | Primary database |
| AWS S3 | Document storage |
| Redis | Caching & sessions (planned) |

### Infrastructure

| Technology | Purpose |
|------------|---------|
| Vercel | Frontend hosting |
| AWS | Backend & storage |
| Clerk | Authentication |

## 📁 Project Structure

```text
ehealth/
├── ehealth-app/                 # Frontend (Next.js)
│   ├── src/
│   │   ├── app/                 # App router pages
│   │   ├── components/          # React components
│   │   │   ├── ui/              # Base UI components
│   │   │   ├── forms/           # Form components
│   │   │   └── layouts/         # Layout components
│   │   ├── hooks/               # Custom React hooks
│   │   ├── lib/                 # Utilities & helpers
│   │   ├── stores/              # Zustand stores
│   │   └── types/               # TypeScript types
│   ├── public/                  # Static assets
│   ├── package.json
│   └── tailwind.config.js
│
└── ehealth-backend/             # Backend (Fastify)
    ├── prisma/
    │   ├── schema.prisma        # Database schema
    │   ├── migrations/          # Database migrations
    │   └── seed.ts              # Seed data
    ├── src/
    │   ├── config/              # Configuration files
    │   │   ├── env.ts           # Environment variables
    │   │   └── database.ts      # Database connection
    │   ├── routes/              # API routes
    │   │   ├── health.ts        # Health check routes
    │   │   ├── auth.ts          # Authentication routes
    │   │   ├── patients.ts      # Patient routes
    │   │   ├── doctors.ts       # Doctor routes
    │   │   ├── documents.ts     # Document routes
    │   │   └── sharing.ts       # Sharing routes
    │   ├── services/            # Business logic
    │   ├── middleware/          # Custom middleware
    │   ├── utils/               # Helper functions
    │   └── server.ts            # Server entry point
    ├── package.json
    └── tsconfig.json
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **PostgreSQL** >= 14.0 (local or cloud)
- **AWS Account** (for S3 storage)
- **Git**

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/ehealth.git
cd ehealth
```

2. **Install Frontend Dependencies**

```bash
cd ehealth-app
npm install
```

3. **Install Backend Dependencies**

```bash
cd ../ehealth-backend
npm install
```

### Environment Variables

#### Backend (`ehealth-backend/.env`)

```env
# Server Configuration
PORT=4000
HOST=0.0.0.0
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/ehealth_db"

# AWS S3 (Add in Phase 4)
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=ehealth-documents

# Authentication (Add in Phase 2)
CLERK_SECRET_KEY=your_clerk_secret
```

#### Frontend (`ehealth-app/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

### Database Setup

1. **Create PostgreSQL Database**

```bash
psql -U postgres
CREATE DATABASE ehealth_db;
\q
```

2. **Generate Prisma Client**

```bash
cd ehealth-backend
npm run db:generate
```

3. **Push Schema to Database**

```bash
npm run db:push
```

4. **View Database (Optional)**

```bash
npm run db:studio
```

### Running the Application

1. **Start Backend Server**

```bash
cd ehealth-backend
npm run dev
```

Server runs at: `http://localhost:4000`

2. **Start Frontend Development Server**

```bash
cd ehealth-app
npm run dev
```

App runs at: `http://localhost:3000`

## 📚 API Documentation

### Base URL

```text
http://localhost:4000/api
```

### Endpoints

#### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Server & database health status |
| GET | `/` | API welcome message |

#### Authentication (Phase 2)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | User login |
| POST | `/auth/logout` | User logout |
| POST | `/auth/forgot-password` | Request password reset |

#### Patients (Phase 3)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/patients/profile` | Get patient profile |
| PUT | `/patients/profile` | Update patient profile |
| GET | `/patients/emergency-contacts` | List emergency contacts |
| POST | `/patients/emergency-contacts` | Add emergency contact |

#### Documents (Phase 4)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/documents` | List all documents |
| POST | `/documents/upload-url` | Get presigned upload URL |
| POST | `/documents` | Create document record |
| GET | `/documents/:id` | Get document details |
| DELETE | `/documents/:id` | Delete document |

#### Sharing (Phase 6)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/sharing/grant` | Grant access to doctor |
| POST | `/sharing/revoke` | Revoke access |
| GET | `/sharing/access-log` | View access history |

### Response Format

All API responses follow this structure:

```json
{
  "success": true,
  "data": { },
  "message": "Optional message"
}
```

Error responses:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  }
}
```

## 🗄️ Database Schema

### Entity Relationship Diagram

```text
┌──────────────┐       ┌──────────────┐
│    Users     │       │   Patients   │
├──────────────┤       ├──────────────┤
│ id           │───┐   │ id           │
│ email        │   └──►│ userId       │
│ role         │       │ firstName    │
│ isVerified   │       │ lastName     │
└──────────────┘       │ dateOfBirth  │
       │               │ bloodGroup   │
       │               └──────┬───────┘
       │                      │
       ▼                      │
┌──────────────┐              │
│   Doctors    │              │
├──────────────┤              ▼
│ id           │       ┌──────────────┐
│ userId       │       │  Documents   │
│ specialization│      ├──────────────┤
│ licenseNumber │      │ id           │
└──────┬───────┘       │ patientId    │
       │               │ documentType │
       │               │ s3Key        │
       │               └──────────────┘
       │
       ▼
┌──────────────┐       ┌──────────────┐
│ SharedAccess │──────►│  AccessLog   │
├──────────────┤       ├──────────────┤
│ patientId    │       │ action       │
│ doctorId     │       │ accessedAt   │
│ expiresAt    │       │ ipAddress    │
└──────────────┘       └──────────────┘
```

### Key Models

- **User** - Base authentication (email, role, verification status)
- **Patient** - Patient profile (personal info, medical history)
- **Doctor** - Doctor profile (specialization, license)
- **Document** - Medical records (type, S3 reference, metadata)
- **SharedAccess** - Access permissions (patient-doctor relationship)
- **AccessLog** - Audit trail (who accessed what, when)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Use TypeScript for all new code
- Follow ESLint configuration
- Write meaningful commit messages
- Add tests for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Dhruvkumar**

- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)

## 🙏 Acknowledgments

- [Fastify](https://www.fastify.io/) - Fast and low overhead web framework
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Re-usable components

---

<p align="center">Made with ❤️ for better healthcare accessibility</p>


