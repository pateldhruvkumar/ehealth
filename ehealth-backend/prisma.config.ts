import { defineConfig, env } from "prisma/config";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

// Keep Prisma CLI usable even when `.env` isn't present.
const envCandidates = [".env", ".env.local", "env.example"];
for (const candidate of envCandidates) {
  const fullPath = path.resolve(process.cwd(), candidate);
  if (fs.existsSync(fullPath)) {
    dotenv.config({ path: fullPath });
    break;
  }
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
