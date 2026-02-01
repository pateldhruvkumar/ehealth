import "dotenv/config";

import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";

import { connectDB, disconnectDB } from "./config/database";
import { HOST, PORT, FRONTEND_URL } from "./config/env";
import { errorHandler } from "./middleware/error-handler";
import { authRoutes } from "./routes/auth";
import { healthRoutes } from "./routes/health";
import { doctorRoutes } from "./routes/doctor";
import { documentRoutes } from "./routes/document";
import { patientRoutes } from "./routes/patient";
import { sharingRoutes } from "./routes/sharing";

async function buildServer() {
  const app = Fastify({
    logger: {
      transport:
        process.env.NODE_ENV === "development"
          ? {
              target: "pino-pretty",
              options: { translateTime: "SYS:standard", ignore: "pid,hostname" }
            }
          : undefined
    }
  });

  try {
    await connectDB();
    app.log.info("Database connected");
  } catch (err) {
    app.log.error({ err }, "Database connection failed (continuing without DB)");
  }

  await app.register(cors, {
    origin: process.env.NODE_ENV === "development" ? true : FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Range", "X-Content-Range"],
    maxAge: 600 // Cache preflight for 10 minutes
  });

  await app.register(helmet);

  app.setErrorHandler(errorHandler);

  await app.register(healthRoutes, { prefix: "/api" });
  await app.register(authRoutes, { prefix: "/api/auth" });
  await app.register(patientRoutes, { prefix: "/api/patient" });
  await app.register(doctorRoutes, { prefix: "/api/doctor" });
  await app.register(documentRoutes, { prefix: "/api/documents" });
  await app.register(sharingRoutes, { prefix: "/api/sharing" });

  return app;
}

async function start() {
  const app = await buildServer();

  const close = async () => {
    try {
      await app.close();
    } finally {
      try {
        await disconnectDB();
      } catch {
        // ignore
      }
    }
  };

  process.once("SIGINT", close);
  process.once("SIGTERM", close);

  await app.listen({ port: PORT, host: HOST });
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

