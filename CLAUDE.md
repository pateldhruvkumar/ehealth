# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A full-stack Electronic Health Records (EHR) system with two separate Node.js projects:
- `ehealth-backend/` — Fastify REST API (TypeScript, Node.js)
- `ehealth-frontend/` — Next.js 16 App Router application (TypeScript)

## Commands

### Backend (`cd ehealth-backend`)
```bash
npm run dev          # Start dev server with tsx watch (port 4000)
npm run build        # Compile TypeScript to dist/
npm start            # Run compiled production build

npm run db:generate  # Regenerate Prisma client after schema changes
npm run db:migrate   # Create and apply a new migration (dev)
npm run db:seed      # Seed DB with test accounts (patient/doctor/admin@example.com, Password123!)
npm run db:studio    # Open Prisma Studio
```

For production migrations: `npx prisma migrate deploy`

### Frontend (`cd ehealth-frontend`)
```bash
npm run dev    # Start Next.js dev server (port 3000)
npm run build  # Build for production
npm run lint   # Run ESLint
```

## Architecture

### Backend

Fastify v5 with a layered architecture: `routes → controllers → services → prisma`.

- **`src/server.ts`** — Entry point. Registers CORS, Helmet, routes with prefixes.
- **`src/config/`** — `env.ts` validates all env vars via Zod at startup (will throw on missing required vars). `database.ts` holds a singleton Prisma client using `@prisma/adapter-pg` (pg Pool adapter for Neon/PostgreSQL). `s3.ts` wraps AWS SDK for presigned URL generation.
- **`src/middleware/auth.ts`** — `authenticate` preHandler reads `Authorization: Bearer <token>`, verifies JWT, fetches user from DB, and attaches to `request.user`. Role guards: `requirePatient`, `requireDoctor`, `requireAdmin`. Used as `preHandler` arrays in route definitions.
- **`src/utils/response.ts`** — All responses use `success(reply, data, message, code)` or `errors.notFound(reply, message)` helpers, producing a consistent `{ success, message, data?, error? }` shape.
- **`src/validators/`** — Zod schemas for request validation, one file per domain.
- **`src/types/index.ts`** — Defines `UserRole`, `AuthUser`, `ApiResponse`, `PaginatedResult`. Also augments `FastifyRequest` with `user?: AuthUser`.

### Frontend

Next.js 16 App Router. All client-side data fetching is done via TanStack Query hooks.

- **`src/lib/api-client.ts`** — Axios instance pointed at `NEXT_PUBLIC_API_URL`. Interceptors: auto-attaches JWT from `localStorage` on every request; on 401, clears the stored token. Response interceptor unwraps `response.data` so hooks receive the API payload directly.
- **`src/lib/constants.ts`** — `ROUTES` object for all app routes, `AUTH_TOKEN_KEY` for localStorage key, `DOCUMENT_TYPES`, `BLOOD_GROUPS`, `GENDERS` enums.
- **`src/providers/`** — `QueryProvider` (TanStack Query), `AuthProvider` (reads token from localStorage on mount, sets axios default), `ThemeProvider` (next-themes). Wrap order in root layout: `QueryProvider > AuthProvider > ThemeProvider`.
- **`src/hooks/`** — Custom hooks per domain (e.g., `use-auth.ts`, `use-documents.ts`). These wrap `useQuery`/`useMutation` from TanStack Query and call the corresponding service files.
- **`src/services/`** — Pure API call functions using `apiClient`. One file per domain.
- **`src/app/`** — Route segments: `/auth/*`, `/patient/*`, `/doctor/*`, `/onboarding`.

### Database Schema (Prisma)

Key relationships:
- `User` (1) → `Patient` or `Doctor` (1-1, userId is PK)
- `Patient` → `Document[]`, `SharedAccess[]` (as sharer), `EmergencyContact[]`, `Consultation[]`
- `Doctor` → `SharedAccess[]` (as recipient), `Consultation[]`
- `SharedAccess` → `AccessLog[]`
- `Document` is soft-deleted (`isDeleted`, `deletedAt`)
- `SharedAccess` has a unique `accessCode` and unique `(patientId, doctorId)` constraint

Document storage uses AWS S3 presigned URLs — the backend generates upload/download URLs and the client uploads/fetches directly from S3. The `s3Key` and `s3Url` are stored in the `Document` model.

### Authentication Flow

1. Login/register → backend returns `{ token, user }` → frontend stores token in `localStorage` under `auth_token`
2. `AuthProvider` reads token on mount and sets it as axios default header
3. Each request via `apiClient` re-reads from localStorage via interceptor as a fallback
4. JWT payload contains `{ id }` — the middleware re-fetches the user from DB on each request to verify `isActive`
