import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { z } from "zod";

// Prefer real secrets in `.env`, but fall back to `env.example` for local boot.
const envCandidates = [".env", ".env.local", "env.example"];
for (const candidate of envCandidates) {
  const fullPath = path.resolve(process.cwd(), candidate);
  if (fs.existsSync(fullPath)) {
    dotenv.config({ path: fullPath });
    break;
  }
}

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(4000),
  HOST: z.string().default("0.0.0.0"),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  FRONTEND_URL: z.string().url().default("http://localhost:3000"),

  DATABASE_URL: z.string().min(1),

  CLERK_PUBLISHABLE_KEY: z.string().min(1),
  CLERK_SECRET_KEY: z.string().min(1),

  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_REGION: z.string().default("us-east-1"),
  AWS_S3_BUCKET: z.string().min(1).default("ehealth-documents"),
});

export const env = envSchema.parse(process.env);

export const PORT = env.PORT;
export const HOST = env.HOST;
export const NODE_ENV = env.NODE_ENV;
export const FRONTEND_URL = env.FRONTEND_URL;

export const DATABASE_URL = env.DATABASE_URL;

export const CLERK_PUBLISHABLE_KEY = env.CLERK_PUBLISHABLE_KEY;
export const CLERK_SECRET_KEY = env.CLERK_SECRET_KEY;

export const AWS_ACCESS_KEY_ID = env.AWS_ACCESS_KEY_ID;
export const AWS_SECRET_ACCESS_KEY = env.AWS_SECRET_ACCESS_KEY;
export const AWS_REGION = env.AWS_REGION;
export const AWS_S3_BUCKET = env.AWS_S3_BUCKET;
