import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import { config } from "./config/env";
import { healthRoutes } from "./routes/health";

// Create Fastify instance with logging
const fastify = Fastify({
  logger: {
    level: config.nodeEnv === "development" ? "info" : "warn",
    transport:
      config.nodeEnv === "development"
        ? { target: "pino-pretty", options: { colorize: true } }
        : undefined,
  },
});

// Register plugins
async function registerPlugins() {
  // CORS - allow frontend to make requests
  await fastify.register(cors, {
    origin: config.frontendUrl,
    credentials: true,
  });

  // Security headers
  await fastify.register(helmet, {
    contentSecurityPolicy: false, // Disable for development
  });
}

// Register routes
async function registerRoutes() {
  await fastify.register(healthRoutes, { prefix: "/api" });
}

function isAddrInUseError(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code?: unknown }).code === "EADDRINUSE"
  );
}

// Start server
async function start() {
  let port = config.port;
  try {
    await registerPlugins();
    await registerRoutes();

    // In development, if the configured port is taken, try the next ports.
    // This prevents noisy EADDRINUSE failures when you accidentally have another dev server running.
    const maxAttempts = config.nodeEnv === "development" ? 10 : 1;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        await fastify.listen({ port, host: config.host });
        break;
      } catch (err) {
        if (isAddrInUseError(err) && attempt < maxAttempts - 1) {
          port += 1;
          continue;
        }
        throw err;
      }
    }

    console.log(`
    🚀 E-Health API Server Running!
    
    Environment: ${config.nodeEnv}
    Local:       http://localhost:${port}
    Health:      http://localhost:${port}/api/health
    
    Ready to accept requests...
    `);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on("SIGINT", async () => {
  console.log("\nShutting down gracefully...");
  await fastify.close();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await fastify.close();
  process.exit(0);
});

start();
