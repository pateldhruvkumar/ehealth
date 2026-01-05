import { FastifyInstance } from "fastify";

export async function healthRoutes(fastify: FastifyInstance) {
  // Basic health check
  fastify.get("/health", async (request, reply) => {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  });

  // Hello world test endpoint
  fastify.get("/", async (request, reply) => {
    return {
      message: "Welcome to E-Health API",
      version: "1.0.0",
    };
  });
}
